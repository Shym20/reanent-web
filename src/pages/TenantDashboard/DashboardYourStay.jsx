import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { FiHome, FiMapPin, FiPhone, FiUser, FiX } from "react-icons/fi";

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
    image: "https://randomuser.me/api/portraits/men/32.jpg", // owner pic
  },
  image:
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", // property image
  imagesCount: 12,
  },
  {
     id: 2,
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
    image: "https://randomuser.me/api/portraits/men/32.jpg", // owner pic
  },
  image:
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", // property image
  imagesCount: 12,
  },
  {
     id: 3,
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
    image: "https://randomuser.me/api/portraits/men/32.jpg", // owner pic
  },
  image:
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", // property image
  imagesCount: 12,
  },
];

const property = {
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
    image: "https://randomuser.me/api/portraits/men/32.jpg", // owner pic
  },
  image:
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", // property image
  imagesCount: 12,
};

const DashboardYourStay = () => {
  const [activeTab, setActiveTab] = useState("CurrentStay");
  const [isOpen, setIsOpen] = useState(false);

  return (
   <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl">
      {/* Tabs + Search */}
     <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
  {/* Tabs */}
  <div className="flex p-1 border border-[#033E4A33] shadow rounded-xl overflow-hidden w-full sm:w-fit">
    <button
      onClick={() => setActiveTab("CurrentStay")}
      className={`px-4 md:px-16 py-2 rounded-xl font-medium transition ${
        activeTab === "CurrentStay"
          ? "bg-[#033E4A] text-white"
          : "bg-white text-gray-700 hover:bg-[#033E4A]/5"
      }`}
    >
      Current Stay
    </button>
    <button
      onClick={() => setActiveTab("PreviousStay")}
      className={`px-4 md:px-16 py-2 rounded-xl font-medium transition ${
        activeTab === "PreviousStay"
          ? "bg-[#033E4A] text-white"
          : "bg-white text-gray-700 hover:bg-[#033E4A]/5"
      }`}
    >
      Previous Stay
    </button>
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


      {/* PreviousStay Tab */}
      {activeTab === "PreviousStay" ? (
      <div className="space-y-8">
      {previousStay.map((property, idx) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.2 }}
          className="bg-white shadow-lg border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row gap-8"
        >
          {/* Property Info */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#033E4A] flex items-center gap-2">
              <FiHome /> {property.title}
            </h2>

            {/* Image */}
            <div className="relative mt-4 group">
              <img
                src={property.image}
                alt="Property"
                className="w-full h-56 object-cover rounded-xl shadow-md group-hover:scale-[1.02] transition-transform"
              />
              <span className="absolute top-3 left-3 bg-[#033E4A] text-white text-xs px-3 py-1 rounded-full shadow">
                {property.status}
              </span>
              <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                {property.imagesCount}+ Photos
              </span>
            </div>

            {/* Details */}
            <div className="mt-5 space-y-3 text-sm text-gray-700">
              <p className="flex items-start gap-2">
                <FiMapPin className="text-[#033E4A] mt-0.5" />
                <span>
                  <span className="font-semibold">Address:</span>{" "}
                  {property.address}
                </span>
              </p>

              <p>
                <span className="font-semibold">Type:</span> {property.type} &nbsp;|&nbsp;
                <span className="font-semibold">Size:</span> {property.size} &nbsp;|&nbsp;
                <span className="font-semibold">Rent:</span>{" "}
                <span className="text-[#033E4A] font-semibold">
                  ₹{property.price}
                </span>
              </p>

              <p>
                <span className="font-semibold">Amenities:</span>{" "}
                {property.amenities.join(", ")}
              </p>

              <p className="w-full md:w-[90%] leading-relaxed">
                <span className="font-semibold">Description:</span>{" "}
                {property.description}{" "}
                <span className="text-[#033E4A] font-semibold cursor-pointer hover:underline">
                  Read more
                </span>
              </p>
            </div>
          </div>

          {/* Owner Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className="w-full md:w-80 bg-gray-50 rounded-2xl p-6 flex flex-col items-center shadow-inner"
          >
            <img
              src={property.owner.image}
              alt="Owner"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#033E4A]/30 shadow-md"
            />
            <div className="mt-4 text-center space-y-2">
              <p className="text-gray-800 font-semibold flex items-center justify-center gap-2">
                <FiUser className="text-[#033E4A]" /> {property.owner.name}
              </p>
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <FiPhone className="text-[#033E4A]" /> {property.owner.number}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Previous owner details for reference.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>

      ) : (
        // CurrentStay Tab
       <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-lg border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row gap-8"
    >
      {/* Property Info */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-[#033E4A] flex items-center gap-2">
          <FiHome /> {property.title}
        </h2>

        {/* Image */}
        <div className="relative mt-4 group">
          <img
            src={property.image}
            alt="Property"
            className="w-full h-56 object-cover rounded-xl shadow-md group-hover:scale-[1.02] transition-transform"
          />
          <span className="absolute top-3 left-3 bg-[#033E4A] text-white text-xs px-3 py-1 rounded-full shadow">
            {property.status}
          </span>
          <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
            {property.imagesCount}+ Photos
          </span>
        </div>

        {/* Details */}
        <div className="mt-5 space-y-3 text-sm text-gray-700">
          <p className="flex items-start gap-2">
            <FiMapPin className="text-[#033E4A] mt-0.5" />
            <span>
              <span className="font-semibold">Address:</span> {property.address}
            </span>
          </p>

          <p>
            <span className="font-semibold">Type:</span> {property.type} &nbsp;|&nbsp;
            <span className="font-semibold">Size:</span> {property.size} &nbsp;|&nbsp;
            <span className="font-semibold">Rent:</span>{" "}
            <span className="text-[#033E4A] font-semibold">₹{property.price}</span>
          </p>

          <p>
            <span className="font-semibold">Amenities:</span>{" "}
            {property.amenities.join(", ")}
          </p>

          <p className="w-full md:w-[90%] leading-relaxed">
            <span className="font-semibold">Description:</span>{" "}
            {property.description}{" "}
            <span className="text-[#033E4A] font-semibold cursor-pointer hover:underline">
              Read more
            </span>
          </p>
        </div>
      </div>

      {/* Owner Info */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-80 bg-gray-50 rounded-2xl p-6 flex flex-col items-center shadow-inner"
      >
        <img
          src={property.owner.image}
          alt="Owner"
          className="w-24 h-24 rounded-full object-cover border-4 border-[#033E4A]/30 shadow-md"
        />
        <div className="mt-4 text-center space-y-2">
          <p className="text-gray-800 font-semibold flex items-center justify-center gap-2">
            <FiUser className="text-[#033E4A]" /> {property.owner.name}
          </p>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <FiPhone className="text-[#033E4A]" /> {property.owner.number}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Reach out to your property owner for any assistance.
          </p>
        </div>
      </motion.div>
    </motion.div>
      )}
    </div>
  );
};

export default DashboardYourStay;