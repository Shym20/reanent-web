import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiMessageCircle, FiSearch, FiCheckCircle } from "react-icons/fi";
import OwnerApi from "../../apis/owner/owner.api";
import { getUserLocal } from "../../utils/localStorage.util";
import { io } from "socket.io-client";
import ChatApi from "../../apis/chat/chat.api";
import msgNotificationAudio from "../../assets/tune/new-notification-09-352705.mp3"


const SOCKET_URL = import.meta.env.VITE_API_URL;


export default function DashboardChannel() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeChat, setActiveChat] = useState(null);
  const [socket, setSocket] = useState(null);

  const currentUser = getUserLocal();
  const currentUserId = currentUser?.userId;
  console.log("Current User:", currentUser);

  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ["websocket"] });

    s.on("connect", () => {
      console.log("Socket connected:", s.id);
      if (currentUserId) {
        s.emit("registerUser", currentUserId);
      }
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Listen for new incoming messages
    s.on("message:new", (message) => {
  const convId = message.conversation_id || message.conversationId;

  setActiveChat((prev) => {
    if (!prev || prev.id !== convId) return prev;
    if (message.sendBy === currentUserId) return prev; // 👈 ignore self echo

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

    // Update grouped messages
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
});


    // Listen for confirmation of own sent messages
    s.on("message:sent", (message) => {
      console.log("Message sent confirmation:", message);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [currentUserId]);


  // const chats = [
  //   {
  //     id: 1,
  //     tenant: "John Doe",
  //     avatar: "https://i.pravatar.cc/40?img=1",
  //     lastMessage: "Can I schedule a visit?",
  //     unread: true,
  //     messages: [
  //       { sender: "John Doe", text: "Hi, I'm interested in the apartment.", time: "10:20 AM" },
  //       { sender: "Owner", text: "Sure! What time works for you?", time: "10:22 AM" },
  //       { sender: "John Doe", text: "Can I schedule a visit?", time: "10:25 AM" },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     tenant: "Alice Smith",
  //     avatar: "https://i.pravatar.cc/40?img=2",
  //     lastMessage: "Thanks for confirming!",
  //     unread: false,
  //     messages: [
  //       { sender: "Alice Smith", text: "Hello, I want more details on the villa.", time: "Yesterday" },
  //       { sender: "Owner", text: "Sure, I’ll share the details.", time: "Yesterday" },
  //       { sender: "Alice Smith", text: "Thanks for confirming!", time: "Yesterday" },
  //     ],
  //   },
  // ];
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




  return (
    <div className="flex h-[82vh] flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg overflow-hidden">
      {/* Left Sidebar - Chat List */}
      <div className="w-full md:w-1/3 bg-white/70 backdrop-blur-xl border-r-1 border-gray-300 flex flex-col shadow-xl">
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

              {/* {!activeChat.unread && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <FiCheckCircle /> Read
                </span>
              )} */}
            </div>

            {/* Messages */}
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
  // 🔸 1. Notification
  if (msg.type === "notification") {
    return (
      <div key={idx} className="flex justify-center">
        <div className="bg-[#FFF4D9] text-[#8B6B2C] px-4 py-2 rounded-full text-xs font-medium shadow-sm border border-[#E6C98A]">
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
            className={`p-4 rounded-xl shadow-md border w-full max-w-sm text-sm ${
              decisionData.decision === "ACCEPT"
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
  if (msg.type === "RENTAL_REQUEST") {
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


  // 🔸 4. Normal messages
  return (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`max-w-sm px-4 py-3 rounded-2xl shadow-md my-2 text-sm ${
        msg.sender === currentUserId
          ? "ml-auto bg-[#D7B56D] text-white rounded-br-none"
          : "mr-auto bg-white text-gray-800 rounded-bl-none"
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
    </div>
  );
}
