import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiHome, FiMapPin, FiUser, FiPhone, FiMessageSquare } from "react-icons/fi";
import TenantApi from "../../apis/tenant/tenant.api";

const tenantInterests = [
  {
    id: 1,
    property: {
      title: "2BHK Family Apartment",
      address: "Baner, Pune",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    },
    owner: {
      name: "Rahul Mehta",
      phone: "9876543210",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    },
    message: "Hi, I’m interested in renting your property. Please contact me.",
    status: "Pending",
  },
  {
    id: 2,
    property: {
      title: "Luxury Studio Flat",
      address: "Andheri, Mumbai",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    },
    owner: {
      name: "Anita Sharma",
      phone: "9876501234",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    message: "I really liked the property details. Can we schedule a visit?",
    status: "Accepted",
  },
  {
    id: 3,
    property: {
      title: "Luxury Studio Flat",
      address: "Andheri, Mumbai",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    },
    owner: {
      name: "Anita Sharma",
      phone: "9876501234",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    message: "I really liked the property details. Can we schedule a visit?",
    status: "Declined",
  },
  {
    id: 4,
    property: {
      title: "Luxury Studio Flat",
      address: "Andheri, Mumbai",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    },
    owner: {
      name: "Anita Sharma",
      phone: "9876501234",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    message: "I really liked the property details. Can we schedule a visit?",
    status: "Accepted",
  },
];

export default function DashboardMyInterest() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterests = async () => {
    try {
      const tenantApi = new TenantApi();
      const response = await tenantApi.getAllInterests();
      console.log("Fetched interests:", response.data);

      if (response?.data) {
        console.log("hehe prop int :", response.data);
        setInterests(response.data);
      } else {
        setInterests([]);
      }
    } catch (error) {
      console.error("Error fetching interests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-14 h-14 border-4 border-[#033E4A] border-t-transparent rounded-full"
        ></motion.div>
  
        <p className="mt-6 text-lg font-semibold text-gray-700">
          Loading <span className="text-[#033E4A]">Your Interests</span>...
        </p>
  
        <p className="text-sm text-gray-500 mt-2">
          Please wait while we fetch your interests.
        </p>
      </div>
    );
  }

  if (interests.length === 0) {
    return <p className="text-center text-gray-500 py-6">No interests found.</p>;
  }
  return (
    <div className="p-6 space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold text-[#033E4A]"
      >
        Your Property Interests
      </motion.h2>

      <div className="grid gap-6 md:grid-cols-3">
        {interests.map((interest, idx) => (
          <motion.div
            key={interest.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
          >
            {/* Property Image */}
            <div className="relative">
              <img
                src={interest.property.images[0]}
                alt={interest.property.title}
                className="w-full h-48 object-cover"
              />
              <span
                className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full shadow text-white ${interest.status === "accepted"
                    ? "bg-green-600"
                    : interest.status === "declined"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
              >
                {interest.status}
              </span>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Property Info */}
              <div className="flex justify-between ">
                <div>
                  <h3 className="text-lg font-semibold text-[#033E4A] flex items-center gap-2">
                    <FiHome /> {interest.property.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FiMapPin /> {interest.property.city}, {interest.property.location}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#033E4A] flex items-center gap-2">
                    ₹{Number(interest.property.rent).toLocaleString('en-IN')}
                  </h3>


                </div>
              </div>

              {/* Tenant Message */}
              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-xl border-l-4 border-[#033E4A] flex items-start gap-2">
                <FiMessageSquare className="text-[#033E4A] mt-0.5" />
                {interest.message || "I'm interested in the property"}
              </p>

              {/* Owner Info */}
              <div className="flex items-center gap-4 mt-4">
                <img
                  src={interest.owner.profilePicture}
                  alt={interest.owner.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#033E4A]/30 shadow-md"
                />
                <div>
                  <p className="flex items-center gap-2 text-gray-800 font-semibold">
                    <FiUser className="text-[#033E4A]" /> {interest.owner.fullName}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 text-sm">
                    <FiPhone className="text-[#033E4A]" /> {interest.owner.mobileNumber || interest.owner.email}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
