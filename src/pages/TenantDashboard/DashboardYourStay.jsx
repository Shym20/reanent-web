import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { FiHome, FiMapPin, FiPhone, FiUser, FiX, FiMail, FiCreditCard } from "react-icons/fi";

const previousStay = [
  {
    id: 1,
    title: "Room - 1",
    address: "Maruti Mandir Chowk, Talegaon Dabhade, Pune – 410506",
    status: "Active",
    type: "Family Home",
    size: "950 sq. ft.",
    price: "5000k",
    amenities: ["1 Living Room", "1 Kitchen", "2 Bedrooms", "2 Bathrooms"],
    description:
      "A spacious 2BHK apartment with excellent ventilation, modern interiors, and semi-furnished fittings including wardrobes",
    owner: {
      name: "Vivek Jain",
      number: "1234567890",
      email: "vivek.jain@example.com",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    imagesCount: 12,
    transactions: [
      { date: "Oct 2025", amount: "₹15,000", status: "Paid" },
      { date: "Sep 2025", amount: "₹15,000", status: "Paid" },
      { date: "Aug 2025", amount: "₹15,000", status: "Paid" },
    ],
  },
];

const property = previousStay[0];

const DashboardYourStay = () => {
  const [activeTab, setActiveTab] = useState("CurrentStay");
  const [isOpen, setIsOpen] = useState(false);

  const stays = activeTab === "PreviousStay" ? previousStay : [property];

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl">
      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        {/* Tabs */}
        <div className="flex p-1 border border-[#033E4A33] shadow rounded-xl overflow-hidden w-full sm:w-fit">
          {["CurrentStay", "PreviousStay"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-16 py-2 rounded-xl font-medium transition ${
                activeTab === tab
                  ? "bg-[#033E4A] text-white"
                  : "bg-white text-gray-700 hover:bg-[#033E4A]/5"
              }`}
            >
              {tab === "CurrentStay" ? "Current Stay" : "Previous Stay"}
            </button>
          ))}
        </div>

        {/* Search Button + Bar */}
        <div className="relative flex items-center justify-end w-full sm:w-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-full bg-gradient-to-r from-[#033E4A] to-[#046C7A] text-white shadow-md hover:scale-110 transition-transform"
          >
            {isOpen ? <FiX size={18} /> : <IoSearch size={18} />}
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute right-14 bg-white border border-[#033E4A33] shadow-md rounded-full flex items-center px-3 overflow-hidden"
              >
                <IoSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  autoFocus
                  className="w-full py-2 bg-transparent outline-none text-gray-700 text-sm"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card Section */}
      <div className="space-y-8">
        {stays.map((stay, idx) => (
          <motion.div
            key={stay.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="bg-white shadow-lg border border-gray-200 rounded-2xl overflow-hidden"
          >
            {/* SECTION 1 — Owner Info */}
            <div className="p-6 bg-gray-50 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-200">
              <img
                src={stay.owner.image}
                alt="Owner"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#033E4A]/30 shadow-md"
              />
              <div className="flex-1 text-center sm:text-left space-y-2">
                <p className="text-gray-800 font-semibold flex items-center justify-center sm:justify-start gap-2">
                  <FiUser className="text-[#033E4A]" /> {stay.owner.name}
                </p>
                <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2">
                  <FiPhone className="text-[#033E4A]" /> {stay.owner.number}
                </p>
                <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2">
                  <FiMail className="text-[#033E4A]" /> {stay.owner.email}
                </p>
              </div>

              {activeTab === "CurrentStay" && (
                <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#033E4A] to-[#046C7A] text-white font-medium shadow-md hover:opacity-90 transition">
                  Request Leave
                </button>
              )}
            </div>

            {/* SECTION 2 — Property Info */}
            <div className="p-6 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#033E4A] flex items-center gap-2">
                  <FiHome /> {stay.title}
                </h2>

                <div className="relative mt-4 group">
                  <img
                    src={stay.image}
                    alt="Property"
                    className="w-full h-56 object-cover rounded-xl shadow-md group-hover:scale-[1.02] transition-transform"
                  />
                  <span className="absolute top-3 left-3 bg-[#033E4A] text-white text-xs px-3 py-1 rounded-full shadow">
                    {stay.status}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                    {stay.imagesCount}+ Photos
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-gray-700">
                  <p className="flex items-start gap-2">
                    <FiMapPin className="text-[#033E4A] mt-0.5" />
                    <span>
                      <span className="font-semibold">Address:</span> {stay.address}
                    </span>
                  </p>

                  <p>
                    <span className="font-semibold">Type:</span> {stay.type} &nbsp;|&nbsp;
                    <span className="font-semibold">Size:</span> {stay.size} &nbsp;|&nbsp;
                    <span className="font-semibold">Rent:</span>{" "}
                    <span className="text-[#033E4A] font-semibold">
                      ₹{stay.price}
                    </span>
                  </p>

                  <p>
                    <span className="font-semibold">Amenities:</span>{" "}
                    {stay.amenities.join(", ")}
                  </p>

                  <p className="w-full md:w-[90%] leading-relaxed">
                    <span className="font-semibold">Description:</span>{" "}
                    {stay.description}{" "}
                    <span className="text-[#033E4A] font-semibold cursor-pointer hover:underline">
                      Read more
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3 — Transaction History */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-[#033E4A] flex items-center gap-2 mb-3">
                <FiCreditCard /> Transaction History
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 font-semibold">
                      <th className="px-4 py-2 border-b">Date</th>
                      <th className="px-4 py-2 border-b">Amount</th>
                      <th className="px-4 py-2 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stay.transactions.map((tx, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">{tx.date}</td>
                        <td className="px-4 py-2 border-b">{tx.amount}</td>
                        <td
                          className={`px-4 py-2 border-b font-medium ${
                            tx.status === "Paid"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {tx.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardYourStay;
