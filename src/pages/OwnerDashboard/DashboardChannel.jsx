import { useState } from "react";
import { motion } from "framer-motion";
import { FiMessageCircle, FiSearch, FiCheckCircle } from "react-icons/fi";

export default function DashboardChannel() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeChat, setActiveChat] = useState(null);

  const chats = [
    {
      id: 1,
      tenant: "John Doe",
      avatar: "https://i.pravatar.cc/40?img=1",
      lastMessage: "Can I schedule a visit?",
      unread: true,
      messages: [
        { sender: "John Doe", text: "Hi, I'm interested in the apartment.", time: "10:20 AM" },
        { sender: "Owner", text: "Sure! What time works for you?", time: "10:22 AM" },
        { sender: "John Doe", text: "Can I schedule a visit?", time: "10:25 AM" },
      ],
    },
    {
      id: 2,
      tenant: "Alice Smith",
      avatar: "https://i.pravatar.cc/40?img=2",
      lastMessage: "Thanks for confirming!",
      unread: false,
      messages: [
        { sender: "Alice Smith", text: "Hello, I want more details on the villa.", time: "Yesterday" },
        { sender: "Owner", text: "Sure, I’ll share the details.", time: "Yesterday" },
        { sender: "Alice Smith", text: "Thanks for confirming!", time: "Yesterday" },
      ],
    },
  ];

  const filteredChats = chats.filter((chat) => {
    if (activeFilter === "Unread") return chat.unread;
    if (activeFilter === "Read") return !chat.unread;
    return true;
  });

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
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === f
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
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveChat(chat)}
              className={`p-4 cursor-pointer flex items-center gap-3 transition-all duration-300 ${
                activeChat?.id === chat.id
                  ? "bg-gradient-to-r from-[#fffaf2] to-[#fdf3e0] shadow-inner"
                  : "hover:bg-[#FFF9F0] hover:shadow-md"
              }`}
            >
              <img
                src={chat.avatar}
                alt={chat.tenant}
                className="w-11 h-11 rounded-full object-cover shadow-md border"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">{chat.tenant}</h3>
                  {chat.unread && (
                    <span className="bg-[#D7B56D] text-white text-xs px-2 py-0.5 rounded-full shadow">
                      New
                    </span>
                  )}
                </div>
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
                  src={activeChat.avatar}
                  alt={activeChat.tenant}
                  className="w-10 h-10 rounded-full object-cover shadow"
                />
                <h3 className="font-bold text-gray-800">{activeChat.tenant}</h3>
              </div>
              {!activeChat.unread && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <FiCheckCircle /> Read
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100">
              {activeChat.messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`max-w-sm px-4 py-3 rounded-2xl shadow-md text-sm ${
                    msg.sender === "Owner"
                      ? "ml-auto bg-[#D7B56D] text-white rounded-br-none"
                      : "mr-auto bg-white text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="block text-[10px] text-gray-500 mt-1 text-right">
                    {msg.time}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white flex gap-2 shadow-inner">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D7B56D]"
              />
              <button className="bg-[#D7B56D] text-white px-6 py-2 rounded-full shadow hover:bg-[#c09d4f] transition">
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
