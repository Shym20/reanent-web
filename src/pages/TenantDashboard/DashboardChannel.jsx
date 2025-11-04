import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiMessageCircle, FiSearch, FiCheckCircle } from "react-icons/fi";
import OwnerApi from "../../apis/owner/owner.api";
import { getUserLocal } from "../../utils/localStorage.util";
import { io } from "socket.io-client";
import ChatApi from "../../apis/chat/chat.api";
import TenantApi from "../../apis/tenant/tenant.api";
import { toast } from "react-toastify";


const SOCKET_URL = import.meta.env.VITE_API_URL;


export default function DashboardTenantChannel() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [activeChat, setActiveChat] = useState(null);
    const [socket, setSocket] = useState(null);
    const chatContainerRef = useRef(null);

    const currentUser = getUserLocal();
    const currentUserId = currentUser?.userId;
    console.log("Current User:", currentUser);

    useEffect(() => {
  const s = io(SOCKET_URL, { transports: ["websocket"] });

  s.on("connect", () => {
    console.log("Socket connected:", s.id);
    if (currentUserId) s.emit("registerUser", currentUserId);
  });

  s.on("disconnect", () => {
    console.log("Socket disconnected");
  });

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

  s.on("message:sent", (message) => {
    console.log("Message sent confirmation:", message);
  });

  setSocket(s);

  return () => s.disconnect();
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
  const chatApi = new ChatApi();

  try {
    let res;
    if (action === "ACCEPT") {
      // ✅ Tenant accepts tenancy
      res = await tenantApi.acceptStartTenancy(rentalData.tenantStayId);
    } else {
      // ❌ Tenant rejects tenancy
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

      // 📩 Also send message in chat
      const payload = {
        msg: JSON.stringify({
          ...rentalData,
          decision: action,
          remarks: action === "REJECT" ? res?.data?.data?.remarks : undefined,
        }),
        type: "RENTAL_RESPONSE",
        conversationId: activeChat.id,
      };

      const chatRes = await chatApi.sendMessage(payload);
      if (chatRes.status === "success") {
        const now = new Date();
        const newMsg = {
          sender: currentUserId,
          text:
            action === "ACCEPT"
              ? "You have accepted the tenancy request."
              : `You have rejected the tenancy request. Reason: ${res?.data?.data?.remarks}`,
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
      }
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


    return (
        <div className="flex h-[82vh] flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg overflow-hidden">
            {/* Left Sidebar - Chat List */}
            <div className="w-full md:w-1/3 bg-white/70 backdrop-blur-xl border-r-1 border-gray-300 flex flex-col shadow-xl">
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
                <div className="flex-1 overflow-y-auto custom-scrollbar">
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

  // 🟠 Case 2: Rental Request (Tenancy approval message)
  if (msg.type === "RENTAL_REQUEST") {
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
          <div
            className={`mt-3 text-xs font-semibold text-center rounded-lg py-1 ${
              rentalData.decision === "ACCEPT"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {rentalData.decision === "ACCEPT"
              ? "✅ You have accepted this tenancy."
              : `❌ You have rejected this tenancy${
                  rentalData.remarks ? ` — ${rentalData.remarks}` : ""
                }`}
          </div>
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


  // 🔵 Case 3: Normal Text Message
  return (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`max-w-sm px-4 py-3 my-2 rounded-2xl shadow-md text-sm ${
        msg.sender === currentUserId
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
        </div>
    );
}
