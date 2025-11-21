import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiMessageCircle, FiSearch, FiCheckCircle } from "react-icons/fi";
import OwnerApi from "../../apis/owner/owner.api";
import { getUserLocal } from "../../utils/localStorage.util";
import { io } from "socket.io-client";
import ChatApi from "../../apis/chat/chat.api";
import TenantApi from "../../apis/tenant/tenant.api";
import { toast } from "react-toastify";
import RatingAndRemovalApi from "../../apis/ratingAndRemoval/ratingAndRemoval.api";

const removalApi = new RatingAndRemovalApi();


const SOCKET_URL = import.meta.env.VITE_API_URL;

export function TenantRateOwnerPropertyModal({ isOpen, onClose, onSubmit, owner, property }) {
  if (!isOpen || !owner || !property) return null;

  const initialRating = {
    // Owner Ratings
    helpfulness: 3,
    restrictions: 3,
    strictness: 3,
    politeness: 3,
    depositReturn: 3,
    femaleBehaviour: 3,
    // Property Ratings
    featuresAccuracy: 3,
    localitySafety: 3,
    neighbours: 3,
    propertyCondition: 3,
    // Optional Comments
    ownerComments: "",
    propertyComments: "",
  };

  const [ratings, setRatings] = useState(initialRating);

  useEffect(() => {
    if (isOpen) setRatings(initialRating);
  }, [isOpen]);

  const handleRatingChange = (field, value) => {
    setRatings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ownerId: owner.userId,
      propertyId: property.id,
      ratings,
    };
    onSubmit(payload);
  };

  const ratingLabels = ["Very Poor 😠", "Poor 🙁", "Average 😐", "Good 🙂", "Excellent! 😄"];

  const ownerFields = [
    { key: "helpfulness", label: "Helpfulness during problems" },
    { key: "restrictions", label: "Freedom from unnecessary restrictions" },
    { key: "strictness", label: "Strictness regarding rent" },
    { key: "politeness", label: "Politeness & behaviour" },
    { key: "depositReturn", label: "Return of deposit (if applicable)" },
    { key: "femaleBehaviour", label: "Behaviour with female tenants" },
  ];

  const propertyFields = [
    { key: "featuresAccuracy", label: "Property as described in listing" },
    { key: "localitySafety", label: "Safety & security of locality" },
    { key: "neighbours", label: "Behaviour of neighbours / surroundings" },
    { key: "propertyCondition", label: "Property condition (leakage, walls, bathroom, etc.)" },
  ];

  // 🟢 Gradient Circle Rating Component
  const CircleRating = ({ value, onChange, max = 5 }) => {
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
          const isFilled = ratingValue <= value;
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[70vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#033E4A]">
            Rate Owner & Property ({property.title || "Your Stay"})
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OWNER SECTION */}
          <div>
            <h3 className="text-lg font-semibold text-[#033E4A] mb-2">Owner Rating</h3>
            <div className="space-y-3">
              {ownerFields.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}:{" "}
                    <span className="font-semibold text-[#B28C3F]">
                      {ratingLabels[ratings[key] - 1]}
                    </span>
                  </label>
                  <CircleRating
                    value={ratings[key]}
                    onChange={(val) => handleRatingChange(key, val)}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* COMMENTS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments for Owner (Optional)
            </label>
            <textarea
              rows="3"
              value={ratings.ownerComments}
              onChange={(e) => handleRatingChange("ownerComments", e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., Owner was cooperative..."
            ></textarea>

          </div>

          {/* PROPERTY SECTION */}
          <div>
            <h3 className="text-lg font-semibold text-[#033E4A] mb-2">Property Rating</h3>
            <div className="space-y-3">
              {propertyFields.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}:{" "}
                    <span className="font-semibold text-[#B28C3F]">
                      {ratingLabels[ratings[key] - 1]}
                    </span>
                  </label>
                  <CircleRating
                    value={ratings[key]}
                    onChange={(val) => handleRatingChange(key, val)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* COMMENTS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments for Property (Optional)
            </label>
            <textarea
              rows="3"
              value={ratings.propertyComments}
              onChange={(e) => handleRatingChange("propertyComments", e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., Property was well maintained..."
            ></textarea>

          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#033E4A] text-white hover:bg-[#045364] transition shadow-md"
            >
              Submit & End Tenancy
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}


export default function DashboardTenantChannel() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeChat, setActiveChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const chatContainerRef = useRef(null);

  const currentUser = getUserLocal();
  const currentUserId = currentUser?.userId;
  console.log("Current User:", currentUser);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedTenantStayId, setSelectedTenantStayId] = useState(null);

  const handleRateOwner = (owner, property, tenantStayId) => {
    setSelectedOwner(owner);
    setSelectedProperty(property);
    setSelectedTenantStayId(tenantStayId);
    setShowRatingModal(true);
  };


  const handleSubmitRating = async (modalPayload) => {
    try {
      const r = modalPayload.ratings;

      const finalPayload = {
        tenantStayId: selectedTenantStayId,
        action: "approve",

        ownerRatings: {
          helpfulness: r.helpfulness,
          freedom: r.restrictions,        // mapping
          rentStrictness: r.strictness,   // mapping
          politeness: r.politeness,
          depositReturn: r.depositReturn,
          behaviourToFemale: r.femaleBehaviour,
        },

        ownerComments: modalPayload.ratings.ownerComments,

        propertyRatings: {
          asDescribed: r.featuresAccuracy,
          safety: r.localitySafety,
          neighbourBehaviour: r.neighbours,
          condition: r.propertyCondition,
        },

        propertyComments: modalPayload.ratings.propertyComments,
      };

      const res = await removalApi.actionOnDeAssociationByTenant(finalPayload);

      if (res.status === 200 || res?.status === "success") {
        toast.success("Tenancy ended & ratings submitted!");
        setShowRatingModal(false);
        fetchMessages();
      } else {
        toast.error(res.data?.message || "Rating submission failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ["websocket"] });

    s.on("connect", () => {
      console.log("Socket connected:", s.id);
      if (currentUserId) s.emit("registerUser", currentUserId);
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // ✅ clear old listeners (safety if component re-mounts)
    s.off("message:new");
    s.off("message:sent");
    s.off("message:update"); // new cleanup line

    // Listen for new messages (real-time update)
    s.on("message:new", (message) => {
      console.log("New incoming message:", message);

      const convId = message.conversation_id || message.conversationId;

      setActiveChat((prev) => {
        if (!prev || prev.id !== convId) return prev;

        const newMsg = {
          sender: message.sendBy,
          text: message.msg,
          time: new Date(message.createdTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(message.createdTime).toDateString(),
          type: message.type,
          createdAt: message.createdTime,
        };

        // 👇 merge into existing grouped structure
        const existingGroups = prev.messagesGrouped ? [...prev.messagesGrouped] : [];
        const dateIndex = existingGroups.findIndex((g) => g.date === newMsg.date);

        if (dateIndex !== -1) {
          existingGroups[dateIndex] = {
            ...existingGroups[dateIndex],
            messages: [...existingGroups[dateIndex].messages, newMsg],
          };
        } else {
          existingGroups.push({ date: newMsg.date, messages: [newMsg] });
        }

        return { ...prev, messagesGrouped: existingGroups };
      });
    });

    // ✅ sent confirmation (untouched)
    s.on("message:sent", (message) => {
      console.log("Message sent confirmation:", message);
    });

    // ✅ NEW SOCKET EVENT
    s.on("conversation:refresh", async ({ conversationId }) => {
      console.log("🔄 Refreshing conversation (tenant):", conversationId);
      try {
        const chatApi = new ChatApi();
        const res = await chatApi.getConversationMessages(conversationId);
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
          setActiveChat((prev) => {
            if (!prev || prev.id !== conversationId) return prev;
            return { ...prev, messagesGrouped: groupedMessages };
          });
        }
      } catch (err) {
        console.error("Error refreshing tenant conversation:", err);
      }
    });


    // ✅ NEW: handle rental request updates (owner can see when tenant approves/rejects)
    s.on("message:update", (payload) => {
      console.log("Rental request updated (tenant view):", payload);

      setActiveChat((prev) => {
        if (!prev || prev.id !== payload.conversationId) return prev;

        const updatedGroups = prev.messagesGrouped?.map((group) => ({
          ...group,
          messages: group.messages.map((msg) => {
            try {
              const parsed = JSON.parse(msg.text);
              // Only update matching RENTAL_REQUEST message
              if (parsed?.tenantStayId === payload.updatedMsg?.tenantStayId) {
                return {
                  ...msg,
                  text: JSON.stringify(payload.updatedMsg),
                  type: payload.type || "RENTAL_REQUEST_UPDATE",
                  updatedAt: payload.updatedAt,
                };
              }
            } catch {
              /* ignore if message.text not JSON */
            }
            return msg;
          }),
        }));

        return { ...prev, messagesGrouped: updatedGroups };
      });
    });

    setSocket(s);

    return () => {
      console.log("Socket cleanup (tenant)");
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

  const fetchOwnerChannels = async () => {
    try {
      setLoading(true);
      const ownerApi = new OwnerApi();
      const res = await ownerApi.ownerPropertyChannel();
      console.log("response is here : ", res.data);

      if (res?.status === "success") {
        const formattedChats = res.data
          .filter((chat) => chat.owner.userId !== currentUserId) // 👈 exclude self chats
          .map((chat) => ({
            id: chat.conversation_id,
            tenant: chat.owner_id,
            avatar: "https://i.pravatar.cc/40?u=" + chat.owner_id,
            fullName: chat.owner.fullName,
            profilePicture: chat.owner.profilePicture,
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

  const fetchConversationMessages = async (conversationId) => {
    try {
      const ownerApi = new OwnerApi();
      const res = await ownerApi.getChannelConversationById(conversationId);

      if (res?.status === "success" && Array.isArray(res?.data?.messages)) {
        const messages = res.data.messages.map((msg) => ({
          sender: msg.sendBy,
          text: msg.msg,
          time: new Date(msg.createdTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(msg.createdTime).toDateString(), // 🆕 group by this later
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

        // ✅ Convert object → array for rendering
        const groupedMessages = Object.entries(grouped).map(([date, msgs]) => ({
          date,
          messages: msgs,
        }));

        setActiveChat((prev) => ({
          ...prev,
          ownerInfo: res.data.participants.owner,
          messagesGrouped: groupedMessages, // 🆕 store grouped form
        }));
      } else {
        console.error("No messages found or invalid response", res);
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
        const now = new Date();
        const newMsg = {
          sender: currentUserId,
          text: newMessage,
          time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          date: now.toDateString(),
          type: "text",
          createdAt: now,
        };

        setActiveChat((prev) => {
          const existingGroups = prev.messagesGrouped ? [...prev.messagesGrouped] : [];
          const dateIndex = existingGroups.findIndex((g) => g.date === newMsg.date);

          if (dateIndex !== -1) {
            existingGroups[dateIndex] = {
              ...existingGroups[dateIndex],
              messages: [...existingGroups[dateIndex].messages, newMsg],
            };
          } else {
            existingGroups.push({ date: newMsg.date, messages: [newMsg] });
          }

          return { ...prev, messagesGrouped: existingGroups };
        });

        setNewMessage("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleTenancyDecision = async (rentalData, action) => {
    const tenantApi = new TenantApi();

    try {
      let res;
      if (action === "ACCEPT") {
        res = await tenantApi.acceptStartTenancy(rentalData.tenantStayId);
      } else {
        const remarks = prompt("Please enter a reason for rejection:");
        if (!remarks) {
          toast.info("Rejection cancelled.");
          return;
        }
        res = await tenantApi.rejectStartTenancy(rentalData.tenantStayId, remarks);
      }

      if (res?.status === "success") {
        toast.success(
          action === "ACCEPT"
            ? "Tenancy request accepted successfully!"
            : "Tenancy request rejected successfully!"
        );

        // ✅ No need to send message manually.
        // Backend will emit 'conversation:refresh' and update chat automatically.
      } else {
        toast.error("Failed to update tenancy decision");
      }
    } catch (err) {
      console.error("Error in tenancy decision:", err);
      toast.error("Something went wrong");
    }
  };

  const formatDateLabel = (dateString) => {
    const today = new Date();
    const msgDate = new Date(dateString);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) return "Today";
    if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";
    return msgDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  const handleTenantDecline = async (tenantStayId) => {
    try {
      const payload = {
        tenantStayId,
        remarks: "Tenant rejected the removal request",
        action: "decline",
      };

      const res = await removalApi.actionOnDeAssociationByTenant(payload);

      if (res.status === 200 || res?.status === "success") {
        toast.success("You declined the removal request");

        // 🟢 Optional: Refresh chat or messages
        fetchMessages();
      } else {
        toast.error(res.data?.message || "Failed to decline request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg overflow-hidden h-[82vh] w-full max-w-full">
      {/* Left Sidebar - Chat List */}
      <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 bg-white/70 backdrop-blur-xl border-r border-gray-300 flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#033E4A] to-[#055E6A] text-white shadow-lg">
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
                ? "bg-gradient-to-r from-[#033E4A] to-[#055E6A] text-white shadow-md scale-105"
                : "text-gray-600 hover:bg-[#033E4A]/10 hover:text-[#033E4A] hover:shadow-sm"
                }`}
            >
              {f}
            </button>

          ))}
        </div>

        {/* Search */}
        <div className="flex items-center p-3 bg-white/60 backdrop-blur-md shadow-sm">
          <div className="flex items-center w-full px-3 py-2 rounded-full bg-white/80 border border-[#033E4A] focus-within:ring-2 focus-within:ring-[#055E6A]/70 transition">
            <FiSearch className="text-[#033E4A] mr-2" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full outline-none text-sm bg-transparent placeholder-[#033E4A]/60 text-[#033E4A]"
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
                ? "bg-gradient-to-r from-[#033E4A]/10 to-[#055E6A]/10 shadow-inner border-l-4 border-[#033E4A]"
                : "hover:bg-[#033E4A]/5 hover:shadow-md"
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
                    <span className="bg-gradient-to-r from-[#033E4A] to-[#055E6A] text-white text-xs px-2 py-0.5 rounded-full shadow">
                      New
                    </span>
                  )}
                </div>
                <p className="font-[600] text-sm text-[#033E4A]">{chat?.propertyName}</p>
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
                  src={activeChat?.ownerInfo?.profilePicture || activeChat?.profilePicture}
                  alt={activeChat?.ownerInfo?.fullName || "Owner"}
                  className="w-10 h-10 rounded-full object-cover shadow"
                />
                <div>
                  <h3 className="font-bold text-gray-800">
                    {activeChat?.ownerInfo?.fullName || activeChat?.fullName}
                  </h3>
                  <p className="text-xs text-gray-500">{activeChat?.propertyName}</p>
                </div>
              </div>

              {/* {!activeChat.unread && (
                                <span className="flex items-center gap-1 text-xs text-green-600">
                                    <FiCheckCircle /> Read
                                </span>
                            )} */}
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

                  {/* 💬 Messages under that date */}
                  {group.messages.map((msg, idx) => {
                    // 🟡 Case 1: Notification Message
                    if (msg.type === "notification") {
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex justify-center"
                        >
                          <div className="bg-[#033E4A]/10 text-[#033E4A] text-xs px-4 py-2 rounded-full shadow-sm border border-[#033E4A]/20">
                            {msg.text}
                          </div>
                        </motion.div>
                      );
                    }

                    // 🟢 Case 1.1: Tenant approved rental contract (show centered green banner)
                    if (msg.type === "RENTAL_CONTRACT_APPROVED_BY_TENANT") {
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex justify-center my-3"
                        >
                          <div className="bg-green-50 border border-green-300 text-green-800 text-xs px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
                            <FiCheckCircle className="text-green-600 text-sm" />
                            <span>{msg.text}</span>
                          </div>
                        </motion.div>
                      );
                    }

                    // 🟠 Case 2: Rental Request (Tenancy approval message)
                    if (msg.type === "RENTAL_CONTRACT_REQUESTED") {
                      let rentalData = null;
                      try {
                        rentalData = JSON.parse(msg.text);
                      } catch (err) {
                        console.error("Failed to parse RENTAL_REQUEST message:", err);
                      }

                      if (rentalData) {
                        const alreadyDecided =
                          rentalData.decision === "ACCEPT" || rentalData.decision === "REJECT";

                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex justify-left my-3"
                          >
                            <div className="bg-white border border-[#033E4A]/20 shadow-md rounded-xl p-4 w-full max-w-sm text-gray-800">
                              <h3 className="font-bold text-[#033E4A] text-sm mb-2">
                                Tenancy Request for {rentalData.propertyName}
                              </h3>
                              <p className="text-xs mb-1">
                                <strong>Start Date:</strong> {rentalData.startDate}
                              </p>
                              <p className="text-xs mb-1">
                                <strong>End Date:</strong> {rentalData.endDate}
                              </p>
                              <p className="text-xs mb-1">
                                <strong>Rent:</strong> ₹{rentalData.donePrice}
                              </p>
                              <p className="text-xs mb-3">
                                <strong>Security:</strong> ₹{rentalData.securityDeposit}
                              </p>

                              {/* 🟢 Decision Buttons or Status */}
                              {!alreadyDecided ? (
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleTenancyDecision(rentalData, "ACCEPT")}
                                    className="px-3 py-1.5 text-xs bg-[#033E4A] text-white rounded-lg hover:bg-[#055E6A] transition"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleTenancyDecision(rentalData, "REJECT")}
                                    className="px-3 py-1.5 text-xs bg-red-100 text-red-700 border border-red-300 rounded-lg hover:bg-red-200 transition"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <>
                                </>
                              )}
                            </div>
                          </motion.div>
                        );
                      }

                    }

                    // 🟢 Case 3: RENTAL_APPROVAL (Owner confirming tenancy)
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
                                You have <strong>approved</strong> the tenancy request for{" "}
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

                    // 🟣 Case: DEASSOCIATE_REQUEST (Owner requests to remove tenant)
                    if (msg.type === "DEASSOCIATE_REQUEST") {
                      let requestData = null;
                      try {
                        requestData = JSON.parse(msg.text);
                      } catch (err) {
                        console.error("Failed to parse DEASSOCIATE_REQUEST:", err);
                      }

                      if (requestData) {
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex justify-left my-3"
                          >
                            <div className="p-4 rounded-xl shadow-md border w-full max-w-sm bg-red-50 border-red-300 text-yellow-800 text-sm">

                              <p className="font-semibold text-yellow-700">
                                Owner Requested Tenancy Removal
                              </p>

                              <p className="text-xs mt-1">
                                The owner <strong>{activeChat?.ownerInfo?.fullName}</strong> wants to end your tenancy for this property:
                              </p>

                              <p className="text-xs font-semibold mt-1">
                                {requestData.propertyName}
                              </p>

                              {requestData.reason && (
                                <p className="text-xs mt-2 italic text-yellow-800">
                                  <strong>Reason:</strong> {requestData.reason}
                                </p>
                              )}

                              <p className="text-xs mt-3 text-gray-500">
                                Requested on {new Date(msg.createdAt).toLocaleString()}
                              </p>

                              {/* STATIC BUTTONS — NO FUNCTIONALITY YET */}
                              <div className="mt-4 flex gap-3">

                                <button
                                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg"
                                  onClick={() =>
                                    handleRateOwner(
                                      activeChat?.ownerInfo,            // owner details
                                      { id: requestData.propertyId, title: requestData.propertyName },
                                      requestData.tenantStayId          // IMPORTANT
                                    )
                                  }

                                >
                                  Accept & Rate
                                </button>

                                <button
                                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg"
                                  onClick={() => handleTenantDecline(requestData.tenantStayId)}
                                >
                                  Decline
                                </button>


                              </div>
                            </div>
                          </motion.div>
                        );
                      }
                    }

                    // 🔴 Case: DEASSOCIATE_REJECTED (Owner rejected your removal request)
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
                                The owner request for <strong> Remove Tenancy</strong> has been
                                <strong> declined</strong> by you.
                              </p>

                              {/* Reason (optional) */}
                              {rejectData.reason && (
                                <p className="text-xs mt-2 italic text-red-700">
                                  <strong>Reason:</strong> {rejectData.reason}
                                </p>
                              )}

                              <p className="text-xs mt-3 text-gray-500">
                                Declined on {new Date(msg.updatedAt || msg.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </motion.div>
                        );
                      }
                    }

                    // 🟡 Case: LEAVE_REQUEST (Tenant ended the stay after rating)
                    if (msg.type === "LEAVE_REQUEST") {
                      let leaveData = null;
                      try {
                        leaveData = JSON.parse(msg.msg || msg.text);
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
                            <div className="p-4 rounded-xl shadow-md border w-full max-w-sm bg-yellow-50 border-yello-300 text-yellow-500 text-sm">

                              {/* Title */}
                              <p className="font-semibold text-yellow-400 flex items-center gap-2">
                                Leave Request Sent
                              </p>

                              {/* Summary */}
                              <p className="text-xs mt-1">
                                You have submitted ratings and requested for End Tenancy
                              </p>

                              {/* Timestamp */}
                              <p className="text-xs mt-3 text-gray-500">
                                Submitted on {new Date(msg.createdAt).toLocaleString()}
                              </p>

                            </div>
                          </motion.div>
                        );
                      }
                    }

                    // 🔴 Case: LEAVE_REQUEST_REJECTED (Owner rejected tenant's leave request)
if (msg.type === "LEAVE_REQUEST_REJECTED") {
  let rejectedData = null;
  try {
    rejectedData = JSON.parse(msg.msg || msg.text);
  } catch (err) {
    console.error("Failed to parse LEAVE_REQUEST_REJECTED:", err);
  }

  if (rejectedData) {
    return (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
        className="flex justify-center my-3"
      >
        <div className="p-4 rounded-xl shadow-md border w-full max-w-sm bg-red-50 border-red-300 text-red-700 text-sm">

          {/* Title */}
          <p className="font-semibold flex items-center gap-2 text-red-700">
            Leave Request Rejected
          </p>

          {/* Summary */}
          <p className="text-xs mt-1">
            Your request to end tenancy has been <strong>denied</strong> by the owner.
          </p>

          {/* Owner Remarks */}
          {rejectedData.remarks && (
            <p className="text-xs mt-3 italic text-red-800">
              <strong>Owner’s Remark:</strong> {rejectedData.remarks}
            </p>
          )}

          {/* Time */}
          <p className="text-xs mt-3 text-gray-500">
            Rejected on{" "}
            {new Date(rejectedData.rejectedAt || msg.updatedAt || msg.createdAt).toLocaleString()}
          </p>
        </div>
      </motion.div>
    );
  }
}


                    // 🔵 Case 3: Normal Text Message
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`max-w-sm px-4 py-3 my-2 rounded-2xl shadow-md text-sm ${msg.sender === currentUserId
                          ? "ml-auto bg-gradient-to-r from-[#033E4A] to-[#055E6A] text-white rounded-br-none"
                          : "mr-auto bg-white text-gray-800 rounded-bl-none border border-[#033E4A]/10"
                          }`}
                      >
                        <p>{msg.text}</p>
                        <span className="block text-[10px] text-gray-500 mt-1 text-right">{msg.time}</span>
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
                className="flex-1 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#055E6A]/70 border border-[#033E4A]/30 text-[#033E4A] placeholder-[#033E4A]/50 transition"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-[#033E4A] to-[#055E6A] text-white px-6 py-2 rounded-full shadow hover:opacity-90 transition-transform duration-200 hover:scale-105"
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
      <TenantRateOwnerPropertyModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
        owner={selectedOwner}
        property={selectedProperty}
      />
    </div>
  );
}
