import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMessageCircle, FiSearch, FiStar, FiX } from "react-icons/fi";
import OwnerApi from "../../apis/owner/owner.api";
import { getUserLocal } from "../../utils/localStorage.util";
import { io } from "socket.io-client";
import ChatApi from "../../apis/chat/chat.api";
import msgNotificationAudio from "../../assets/tune/new-notification-09-352705.mp3"
import RatingAndRemovalApi from "../../apis/ratingAndRemoval/ratingAndRemoval.api";
import { toast } from "react-toastify";


const SOCKET_URL = import.meta.env.VITE_API_URL;

const ratingApi = new RatingAndRemovalApi();

const TenantRatingModal = ({ isOpen, onClose, onRateAndRemove }) => {
  // 5-point scale for each parameter
  const initialRating = {
    behaviour: 3,
    billPayment: 3,
    roomCondition: 3,
    noiseNuisance: 3,
    propertyUse: 3,
    comments: "", // For additional comments
  };

  const [ratingData, setRatingData] = useState(initialRating);

  useEffect(() => {
    // Reset state when modal opens for a new tenant
    if (isOpen) {
      setRatingData(initialRating);
    }
  }, [isOpen]); 

  if (!isOpen) return null;

  const handleRatingChange = (field, value) => {
    setRatingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   onRateAndRemove(ratingData);
  };

  // Rating labels for user-friendly display
  const ratingLabels = [
    "Very Poor 😠",
    "Poor 🙁",
    "Average 😐",
    "Good 🙂",
    "Excellent! 😄",
  ];

  const ratingFields = [
    { key: "behaviour", label: "Tenant's Behaviour" },
    { key: "billPayment", label: "Bill/Rent Payment" },
    { key: "roomCondition", label: "Room Condition while Leaving" },
    { key: "noiseNuisance", label: "Peace and Quiet while stay" },
    { key: "propertyUse", label: "Respectful Property Use" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#033E4A]">Before Removing, Rate him/her</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {ratingFields.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}: <span className="font-bold text-[#B28C3F] ml-2">{ratingLabels[ratingData[key] - 1]}</span>
              </label>
              <CircleRating
                value={ratingData[key]}
                onChange={(value) => handleRatingChange(key, value)}
              />
            </div>
          ))}

          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments (Optional):
            </label>
            <textarea
              id="comments"
              rows="3"
              value={ratingData.comments}
              onChange={(e) => handleRatingChange('comments', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#B28C3F] focus:border-[#B28C3F]"
              placeholder="Add a review for tenant"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-md"
            >
              Submit Rating
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CircleRating = ({ value, onChange, max = 5 }) => {
  // gradient shades from red → green
  const gradientShades = [
    "#ef4444", // 1 - Red
    "#f97316", // 2 - Orange-red
    "#facc15", // 3 - Yellow
    "#84cc16", // 4 - Yellow-green
    "#16a34a", // 5 - Green
  ];

  return (
    <div className="flex space-x-2">
      {[...Array(max)].map((_, index) => {
        const ratingValue = index + 1;
        const isFilled = ratingValue <= value; // fill up to selected value
        const color = gradientShades[index];

        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(ratingValue)}
            style={{
              backgroundColor: isFilled ? color : "transparent",
              borderColor: isFilled ? color : "#d1d5db", // gray-300
              transform: isFilled ? "scale(1.15)" : "scale(1)",
            }}
            className="w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110"
          />
        );
      })}
    </div>
  );
};

export default function DashboardChannel() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeChat, setActiveChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [tenantToRate, setTenantToRate] = useState(null);
  const [propertyForRating, setPropertyForRating] = useState(null);
  const [leaveRequestData, setLeaveRequestData] = useState(null);

  const openRatingModal = (leaveData) => {
    console.log("wassap");
    setShowRatingModal(true);
    setLeaveRequestData(leaveData);
  };

  const currentUser = getUserLocal();
  const currentUserId = currentUser?.userId;
  console.log("Current User:", currentUser);

  useEffect(() => {
    if (!currentUserId) return;

    const s = io(SOCKET_URL, { transports: ["websocket"] });

    s.on("connect", () => {
      console.log("Socket connected:", s.id);
      s.emit("registerUser", currentUserId);
    });

    // ✅ clear old listeners first (in case component remounts)
    s.off("message:new");
    s.off("message:sent");
    s.off("message:update"); // new cleanup line

    // ✅ handle incoming messages only once
    s.on("message:new", (message) => {
      const convId = message.conversation_id || message.conversationId;

      // 🛑 Ignore if message is from self
      if (message.sendBy === currentUserId) return;

      setActiveChat((prev) => {
        if (!prev || prev.id !== convId) return prev;

        const audio = new Audio(msgNotificationAudio);
        audio.play().catch((err) => console.warn("Audio play failed:", err));

        const newMsg = {
          sender: message.sendBy,
          text: message.msg,
          time: new Date(message.createdTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(message.createdTime).toDateString(),
          createdAt: message.createdTime,
        };

        const dateKey = newMsg.date;
        const updatedGroups = [...(prev.messagesGrouped || [])];
        const existingGroup = updatedGroups.find((g) => g.date === dateKey);

        if (existingGroup) {
          existingGroup.messages.push(newMsg);
        } else {
          updatedGroups.push({ date: dateKey, messages: [newMsg] });
        }

        return {
          ...prev,
          messages: [...(prev.messages || []), newMsg],
          messagesGrouped: updatedGroups,
        };
      });
    });

    // ✅ sent confirmation (untouched)
    s.on("message:sent", (message) => {
      console.log("Message sent confirmation:", message);
    });

    // ✅ NEW: when backend tells to refresh conversation messages
    s.on("conversation:refresh", async ({ conversationId }) => {
      console.log("🔄 Refreshing conversation:", conversationId);

      // Optional: small sound or UI loader
      const audio = new Audio(msgNotificationAudio);
      audio.play().catch(() => { });

      // Fetch updated messages from API
      try {
        const chatApi = new ChatApi();
        const res = await chatApi.getConversationMessages(conversationId); // use your same endpoint

        if (res?.status === "success" && Array.isArray(res?.data?.messages)) {
          const messages = res.data.messages.map((msg) => ({
            sender: msg.sendBy,
            text: msg.msg,
            time: new Date(msg.createdTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            date: new Date(msg.createdTime).toDateString(),
            type: msg.type,
            createdAt: msg.createdTime,
          }));

          // Group by date (same logic used in fetchConversationMessages)
          const grouped = messages.reduce((acc, msg) => {
            const dateKey = msg.date;
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(msg);
            return acc;
          }, {});
          const groupedMessages = Object.entries(grouped).map(([date, msgs]) => ({
            date,
            messages: msgs,
          }));

          // Update only if this chat is active
          setActiveChat((prev) => {
            if (!prev || prev.id !== conversationId) return prev;
            return { ...prev, messagesGrouped: groupedMessages };
          });
        }
      } catch (err) {
        console.error("Error refreshing conversation:", err);
      }
    });


    // ✅ NEW: handle rental request updates (tenant approve/reject)
    s.on("message:update", (payload) => {
      console.log("Rental request updated:", payload);

      setActiveChat((prev) => {
        if (!prev || prev.id !== payload.conversationId) return prev;

        const updatedGroups = prev.messagesGrouped?.map((group) => ({
          ...group,
          messages: group.messages.map((msg) => {
            try {
              const parsed = JSON.parse(msg.text);
              // match same tenantStayId inside RENTAL_REQUEST JSON
              if (parsed?.tenantStayId === payload.updatedMsg?.tenantStayId) {
                return {
                  ...msg,
                  text: JSON.stringify(payload.updatedMsg), // overwrite message JSON
                  type: payload.type || "RENTAL_REQUEST_UPDATE",
                  updatedAt: payload.updatedAt,
                };
              }
            } catch {
              /* not JSON -> skip */
            }
            return msg;
          }),
        }));

        return { ...prev, messagesGrouped: updatedGroups };
      });
    });

    setSocket(s);

    return () => {
      console.log("Socket cleanup");
      s.off("message:new");
      s.off("message:sent");
      s.off("conversation:refresh");
      s.off("message:update");
      s.disconnect();
    };
  }, [currentUserId]);

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatContainerRef = useRef(null);

  const fetchOwnerChannels = async () => {
    try {
      setLoading(true);
      const ownerApi = new OwnerApi();
      const res = await ownerApi.ownerPropertyChannel();
      console.log("response is here : ", res.data);

      if (res?.status === "success") {
        const formattedChats = res.data
          .filter((chat) => chat.tenant.userId !== currentUserId) // 👈 exclude self chats
          .map((chat) => ({
            id: chat.conversation_id,
            tenant: chat.tenant_id,
            avatar: "https://i.pravatar.cc/40?u=" + chat.tenant_id,
            fullName: chat.tenant.fullName,
            profilePicture: chat.tenant.profilePicture,
            propertyName: chat.property.name,
            lastMessage: chat.lastMessage || "No messages yet",
            lastMessageTime: new Date(chat.lastMessageTime).toLocaleString(),
            unread: false,
            messages: [],
          }));

        setChats(formattedChats);
      } else {
        setError(res?.data?.message || "Failed to fetch conversations");
      }
    } catch (err) {
      console.error("Error fetching owner property channels:", err);
      setError("Something went wrong while fetching channels");
    } finally {
      setLoading(false);
    }
  };


  // Helper: format date label (Today, Yesterday, or DD MMM)
  const formatDateLabel = (dateString) => {
    const today = new Date();
    const msgDate = new Date(dateString);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) return "Today";
    if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";
    return msgDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // 🧩 UPDATED fetchConversationMessages
  const fetchConversationMessages = async (conversationId) => {
    try {
      const ownerApi = new OwnerApi();
      const res = await ownerApi.getChannelConversationById(conversationId);
      console.log("Fetched messages:", res.data.messages);

      if (res?.status === "success" && Array.isArray(res?.data?.messages)) {
        const messages = res.data.messages.map((msg) => ({
          sender: msg.sendBy,
          text: msg.msg,
          time: new Date(msg.createdTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(msg.createdTime).toDateString(),
          type: msg.type,
          createdAt: msg.createdTime,
        }));

        // ✅ Group messages by date
        const grouped = messages.reduce((acc, msg) => {
          const dateKey = msg.date;
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(msg);
          return acc;
        }, {});

        const groupedMessages = Object.entries(grouped).map(([date, msgs]) => ({
          date,
          messages: msgs,
        }));

        setActiveChat((prev) => ({
          ...prev,
          tenantInfo: res.data.participants.tenant,
          messagesGrouped: groupedMessages,
        }));
      } else {
        console.error("Invalid or empty message response", res);
      }
    } catch (err) {
      console.error("Error fetching conversation messages:", err);
    }
  };


  const filteredChats = chats.filter((chat) => {
    if (activeFilter === "Unread") return chat.unread;
    if (activeFilter === "Read") return !chat.unread;
    return true;
  });

  useEffect(() => {
    fetchOwnerChannels();
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeChat, activeChat?.messages]);


  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    const payload = {
      msg: newMessage,
      conversationId: activeChat.id,
    };

    try {
      const chatApi = new ChatApi();
      const res = await chatApi.sendMessage(payload);

      if (res.status === "success") {
        const newMsg = {
          sender: currentUserId,
          text: newMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date().toDateString(),
          createdAt: new Date(),
        };

        setActiveChat((prev) => {
          const dateKey = newMsg.date;
          let updatedGroups = [...(prev.messagesGrouped || [])];
          const existingGroup = updatedGroups.find((g) => g.date === dateKey);

          if (existingGroup) {
            existingGroup.messages.push(newMsg);
          } else {
            updatedGroups.push({ date: dateKey, messages: [newMsg] });
          }

          return {
            ...prev,
            messages: [...(prev.messages || []), newMsg],
            messagesGrouped: updatedGroups,
          };
        });

        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleRejectLeaveRequest = async (leaveData) => {
    try {
      const payload = {
        tenantStayId: leaveData.tenantStayId,
        action: "deny",
        remarks: "Owner denied the leave request",
      };

      const res = await ratingApi.actionOnDeAssociationByOwner(payload);

      if (res?.status === "success") {
        toast.success("Leave request denied.");
      } else {
        toast.error(res?.data?.message || "Failed to deny request");
      }
    } catch (err) {
      console.error("Reject Error:", err);
      toast.error("Something went wrong!");
    }
  };

  const handleRateAndRemoveTenant = async (ratingPayload) => {
    try {
      // Convert your rating modal data → backend payload format
      const payload = {
        tenantStayId: leaveRequestData?.tenantStayId,
        action: "approve",
        remarks: "All good. Approved.",
        tenantRatings: {
          behaviour: ratingPayload.behaviour,
          payment: ratingPayload.billPayment,
          roomCondition: ratingPayload.roomCondition,
          peace: ratingPayload.noiseNuisance,
          respectfulUse: ratingPayload.propertyUse,
        },
        ownerComments: ratingPayload.comments || "",
      };

      const res = await ratingApi.actionOnDeAssociationByOwner(payload);

      if (res?.status === "success") {
        toast.success("Tenant approved & rated!");
        setShowRatingModal(false);
      } else {
        toast.error(res?.data?.message || "Failed to approve tenant");
      }
    } catch (err) {
      console.error("Approve Error:", err);
      toast.error("Something went wrong!");
    }
  };


  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg overflow-hidden h-[82vh] w-full max-w-full">
      {/* Left Sidebar - Chat List */}
      <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 bg-white/70 backdrop-blur-xl border-r border-gray-300 flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#D7B56D] to-[#c09d4f] text-white shadow-lg">
          <h2 className="font-bold text-lg flex items-center gap-2 tracking-wide drop-shadow-sm">
            <span className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              <FiMessageCircle className="text-xl" />
            </span>
            Property Channel
          </h2>
        </div>

        {/* Filters */}
        <div className="flex justify-around p-3 bg-white/50 backdrop-blur-md shadow-sm">
          {["All", "Unread", "Read"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === f
                ? "bg-gradient-to-r from-[#D7B56D] to-[#c09d4f] text-white shadow-md scale-105"
                : "text-gray-600 hover:bg-gray-100 hover:shadow-sm"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center p-3 bg-white/60 backdrop-blur-md shadow-sm">
          <div className="flex items-center w-full px-3 py-2 rounded-full bg-white/80 border-1 border-[#D7B56D] focus-within:ring-2 focus-within:ring-[#D7B56D]/70 transition">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">

          {loading && <p className="text-center text-gray-500 py-6">Loading chats...</p>}
          {!loading && error && <p className="text-center text-red-500 py-6">{error}</p>}

          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }} z
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                setActiveChat(chat);
                fetchConversationMessages(chat.id);
              }}
              className={`p-4 cursor-pointer flex items-center gap-3 transition-all duration-300 ${activeChat?.id === chat.id
                ? "bg-gradient-to-r from-[#fffaf2] to-[#fdf3e0] shadow-inner"
                : "hover:bg-[#FFF9F0] hover:shadow-md"
                }`}
            >
              <img
                src={chat?.profilePicture}
                alt={chat.tenant}
                className="w-11 h-11 rounded-full object-cover shadow-md border"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">{chat?.fullName}</h3>
                  {chat.unread && (
                    <span className="bg-[#D7B56D] text-white text-xs px-2 py-0.5 rounded-full shadow">
                      New
                    </span>
                  )}
                </div>
                <p className="font-[600] text-sm text-[#D7B56D]">{chat?.propertyName}</p>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
            </motion.div>
          ))}

          {filteredChats.length === 0 && (
            <p className="text-center text-gray-500 py-6">No chats found</p>
          )}
        </div>
      </div>

      {/* Right Panel - Chat Window */}
      <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-md">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <img
                  src={activeChat?.tenantInfo?.profilePicture || activeChat?.profilePicture}
                  alt={activeChat?.tenantInfo?.fullName || "Tenant"}
                  className="w-10 h-10 rounded-full object-cover shadow"
                />
                <div>
                  <h3 className="font-bold text-gray-800">
                    {activeChat?.tenantInfo?.fullName || activeChat?.fullName}
                  </h3>
                  <p className="text-xs text-gray-500">{activeChat?.propertyName}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100"
            >
              {activeChat.messagesGrouped?.map((group, i) => (
                <div key={i}>
                  {/* 🗓️ Date Separator */}
                  <div className="flex justify-center my-3">
                    <span className="text-xs text-gray-500 bg-white/70 px-3 py-1 rounded-full shadow-sm">
                      {formatDateLabel(group.date)}
                    </span>
                  </div>

                  {/* 💬 Messages for this date */}
                  {group.messages.map((msg, idx) => {

                    // 🔸 1. Notification or Rental Contract Approved by Tenant
                    if (msg.type === "notification" || msg.type === "RENTAL_CONTRACT_APPROVED_BY_TENANT") {
                      return (
                        <div key={idx} className="flex justify-center my-2">
                          <div
                            className={`px-4 py-2 rounded-full text-xs font-medium shadow-sm border
          ${msg.type === "RENTAL_CONTRACT_APPROVED_BY_TENANT"
                                ? "bg-green-50 text-green-800 border-green-300"
                                : "bg-[#FFF4D9] text-[#8B6B2C] border-[#E6C98A]"
                              }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      );
                    }

                    // 🔸 2. RENTAL_RESPONSE (tenant accepted/rejected)
                    if (msg.type === "RENTAL_RESPONSE") {
                      let decisionData = null;
                      try {
                        decisionData = JSON.parse(msg.text);
                      } catch (err) {
                        console.error("Failed to parse RENTAL_RESPONSE:", err);
                      }

                      if (decisionData) {
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex justify-center my-3"
                          >
                            <div
                              className={`p-4 rounded-xl shadow-md border w-full max-w-sm text-sm ${decisionData.decision === "ACCEPT"
                                ? "bg-green-50 border-green-200 text-green-800"
                                : "bg-red-50 border-red-200 text-red-800"
                                }`}
                            >
                              {decisionData.decision === "ACCEPT" ? (
                                <>
                                  <p className="font-semibold"> Tenancy Accepted</p>
                                  <p className="text-xs mt-1">
                                    Tenant <strong>{activeChat?.tenantInfo?.fullName}</strong> has accepted your tenancy proposal for{" "}
                                    <strong>{decisionData.propertyName}</strong>.
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="font-semibold"> Tenancy Rejected</p>
                                  <p className="text-xs mt-1">
                                    Tenant <strong>{activeChat?.tenantInfo?.fullName}</strong> has declined your tenancy proposal for{" "}
                                    <strong>{decisionData.propertyName}</strong>.
                                  </p>
                                </>
                              )}
                            </div>
                          </motion.div>
                        );
                      }
                    }

                    // 🔸 3. RENTAL_REQUEST (owner’s own proposal message)
                    if (msg.type === "RENTAL_CONTRACT_REQUESTED") {
                      let rentalData = null;
                      try {
                        rentalData = JSON.parse(msg.text);
                      } catch (err) {
                        console.error("Failed to parse RENTAL_REQUEST:", err);
                      }

                      if (rentalData) {
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="ml-auto max-w-sm"
                          >
                            <div className="bg-[#D7B56D]/10 border border-[#D7B56D]/40 rounded-xl shadow-sm p-4 text-sm text-[#033E4A]">
                              <p className="font-bold text-[#B28C3F] mb-1"> Tenancy Request Sent</p>
                              <p className="text-xs mb-1"><strong>Property:</strong> {rentalData.propertyName}</p>
                              <p className="text-xs mb-1"><strong>Start:</strong> {rentalData.startDate}</p>
                              <p className="text-xs mb-1"><strong>End:</strong> {rentalData.endDate}</p>
                              <p className="text-xs mb-1"><strong>Rent:</strong> ₹{rentalData.donePrice}</p>
                              <p className="text-xs"><strong>Security:</strong> ₹{rentalData.securityDeposit}</p>
                            </div>
                          </motion.div>
                        );
                      }
                    }

                    // 🔸 5. RENTAL_APPROVAL (tenant approved the start tenancy)
                    if (msg.type === "RENTAL_APPROVAL") {
                      let approvalData = null;
                      try {
                        approvalData = JSON.parse(msg.text);
                      } catch (err) {
                        console.error("Failed to parse RENTAL_APPROVAL:", err);
                      }

                      if (approvalData) {
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex justify-center my-3"
                          >
                            <div className="p-4 rounded-xl shadow-md border w-full max-w-sm bg-[#E6FFE6] border-green-200 text-green-800 text-sm">
                              <p className="font-semibold">Tenancy Approved</p>
                              <p className="text-xs mt-1">
                                Tenant <strong>{activeChat?.tenantInfo?.fullName}</strong> has <strong>approved</strong> your tenancy request for{" "}
                                <strong>{approvalData.propertyName}</strong>.
                              </p>
                              <p className="text-xs mt-1 text-gray-600">
                                Approved on {new Date(approvalData.approvedAt).toLocaleString()}
                              </p>
                            </div>
                          </motion.div>
                        );
                      }
                    }

                    // 🔸 1.5 RENTAL_CONTRACT_REJECTED_BY_TENANT
                    if (msg.type === "RENTAL_CONTRACT_REJECTED_BY_TENANT") {
                      let rejectionData = null;
                      try {
                        rejectionData = JSON.parse(msg.text);
                      } catch (err) {
                        console.error("Failed to parse RENTAL_CONTRACT_REJECTED_BY_TENANT:", err);
                      }

                      if (rejectionData) {
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex justify-center my-3"
                          >
                            <div className="p-4 rounded-xl shadow-md border w-full max-w-sm bg-red-50 border-red-300 text-red-800 text-sm">
                              <p className="font-semibold text-red-700">Tenancy Rejected</p>
                              <p className="text-xs mt-1">
                                Tenant <strong>{activeChat?.tenantInfo?.fullName}</strong> has rejected your tenancy request for{" "}
                                <strong>{rejectionData.propertyName}</strong>.
                              </p>

                              {/* ✅ Rental details section */}
                              <div className="mt-3 text-xs space-y-1 border-t border-red-200 pt-2">
                                <p>
                                  <strong>Start:</strong> {rejectionData.startDate}
                                </p>
                                <p>
                                  <strong>End:</strong> {rejectionData.endDate}
                                </p>
                                <p>
                                  <strong>Rent:</strong> ₹{rejectionData.donePrice}
                                </p>
                                <p>
                                  <strong>Security:</strong> ₹{rejectionData.securityDeposit}
                                </p>
                              </div>

                              {/* ✅ Remarks if provided */}
                              {rejectionData.remarks && (
                                <p className="text-xs mt-2 italic text-red-700">
                                  <strong>Remark:</strong>{" "}
                                  {rejectionData.remarks.replace(/^Remarks:\s*/i, "")}
                                </p>
                              )}

                              <p className="text-xs mt-2 text-gray-500">
                                Rejected on{" "}
                                {new Date(msg.updatedAt || msg.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </motion.div>
                        );
                      }
                    }

                    // 🔸 OWNER SIDE — When tenant OR system notifies the owner about the removal request
                    if (msg.type === "DEASSOCIATE_REQUEST") {
                      let removalData = null;
                      try {
                        removalData = JSON.parse(msg.text);
                      } catch (err) {
                        console.error("Failed to parse DEASSOCIATE_REQUEST:", err);
                      }

                      if (removalData) {
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex justify-center my-3"
                          >
                            <div className="p-4 rounded-xl shadow-md border w-full max-w-sm bg-yellow-50 border-yellow-300 text-yellow-800 text-sm">

                              <p className="font-semibold text-yellow-700">
                                Tenancy Removal Initiated
                              </p>

                              <p className="text-xs mt-1">
                                You have initiated a request to remove the tenant from this property
                              </p>

                              {/* <p className="text-xs font-semibold mt-1">
                                {removalData.propertyName}
                              </p> */}

                              {removalData.reason && (
                                <p className="text-xs mt-2 italic text-yellow-800">
                                  <strong>Reason:</strong> {removalData.reason}
                                </p>
                              )}

                              <p className="text-xs mt-3 text-gray-500">
                                Request sent on {new Date(msg.createdAt).toLocaleString()}
                              </p>

                              {/* 🔹 No approval/decline buttons here (OWNER VIEW) */}
                            </div>
                          </motion.div>
                        );
                      }
                    }

                    // 🔸 When tenant rejects the removal request (DEASSOCIATE_REJECTED)
                    if (msg.type === "DEASSOCIATE_REJECTED") {
                      let rejectData = null;
                      try {
                        rejectData = JSON.parse(msg.text);
                      } catch (err) {
                        console.error("Failed to parse DEASSOCIATE_REJECTED:", err);
                      }

                      if (rejectData) {
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex justify-center my-3"
                          >
                            <div className="p-4 rounded-xl shadow-md border w-full max-w-sm bg-red-50 border-red-300 text-red-800 text-sm">

                              <p className="font-semibold text-red-700">
                                Removal Request Declined
                              </p>

                              <p className="text-xs mt-1">
                                Tenant <strong>{activeChat?.tenantInfo?.fullName}</strong> has
                                <strong> declined your request</strong> to remove them from the property.
                              </p>

                              {/* Reason */}
                              {rejectData.reason && (
                                <p className="text-xs mt-2 italic text-red-700">
                                  <strong>Reason:</strong> {rejectData.reason}
                                </p>
                              )}

                              <p className="text-xs mt-3 text-gray-500">
                                Declined on{" "}
                                {new Date(msg.updatedAt || msg.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </motion.div>
                        );
                      }
                    }

                    // 🔹 OWNER VIEW — Tenant requested to end stay (LEAVE_REQUEST)
                    if (msg.type === "LEAVE_REQUEST") {
                      let leaveData = null;
                      try {
                        leaveData = typeof msg.text === "string"
                          ? JSON.parse(msg.text)
                          : msg.text;  // <-- if already an object, use as is

                      } catch (err) {
                        console.error("Failed to parse LEAVE_REQUEST:", err);
                      }

                      if (leaveData) {
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex justify-center my-3"
                          >
                            <div className="p-4 rounded-xl shadow-md border w-full max-w-sm bg-blue-50 border-blue-300 text-blue-800 text-sm">

                              {/* Title */}
                              <p className="font-semibold text-blue-700">
                                Tenant Requested to End Stay
                              </p>

                              <p className="text-xs mt-1">
                                Tenant <strong>{activeChat?.tenantInfo?.fullName}</strong> has requested
                                to end their stay at this Property
                              </p>

                              {/* Timestamp */}
                              <p className="text-xs mt-3 text-gray-500">
                                Requested on {new Date(msg.createdAt).toLocaleString()}
                              </p>

                              {/* ACTION BUTTONS */}
                              <div className="mt-4 flex gap-3">
                                <button
                                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg"
                                  onClick={() => openRatingModal(leaveData)}

                                >
                                  Accept
                                </button>

                                <button
                                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg"
                                  onClick={() => handleRejectLeaveRequest(leaveData)}
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      }
                    }

                    // 🔹 OWNER VIEW — You rejected tenant's leave request  
                    if (msg.type === "LEAVE_REQUEST_REJECTED") {
                      let rejectData = null;
                      try {
                        rejectData = JSON.parse(msg.text || msg.msg);
                      } catch (err) {
                        console.error("Failed to parse LEAVE_REQUEST_REJECTED:", err);
                      }

                      if (rejectData) {
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex justify-center my-3"
                          >
                            <div className="p-4 rounded-xl shadow-md border w-full max-w-sm bg-red-50 border-red-300 text-red-800 text-sm">

                              {/* Title */}
                              <p className="font-semibold text-red-700">
                                Leave Request Rejected
                              </p>

                              {/* Summary */}
                              <p className="text-xs mt-1">
                                You have <strong>rejected</strong> the tenant's leave request for this property.
                              </p>

                              {/* Timestamp */}
                              <p className="text-xs mt-3 text-gray-500">
                                Rejected on {new Date(rejectData.rejectedAt || msg.updatedAt).toLocaleString()}
                              </p>
                            </div>
                          </motion.div>
                        );
                      }
                    }

                    // 🔸 4. Normal messages
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`max-w-sm px-4 py-3 rounded-2xl shadow-md my-2 text-sm ${msg.sender === currentUserId
                          ? "ml-auto bg-[#D7B56D] text-white rounded-br-none"
                          : "mr-auto bg-white text-gray-800 rounded-bl-none"
                          }`}
                      >
                        <p>{msg.text}</p>
                        <span className="block text-[10px] text-black mt-1 text-right">{msg.time}</span>
                      </motion.div>
                    );
                  })}


                </div>
              ))}


            </div>

            {/* Input */}
            <div className="p-4 bg-white flex gap-2 shadow-inner">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D7B56D]"
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#D7B56D] text-white px-6 py-2 rounded-full shadow hover:bg-[#c09d4f] transition"
              >
                Send
              </button>

            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
            Select a chat to start messaging 💬
          </div>
        )}
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRatingModal && (
          <TenantRatingModal
            isOpen={showRatingModal}
            onClose={() => setShowRatingModal(false)}
            onRateAndRemove={handleRateAndRemoveTenant}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
