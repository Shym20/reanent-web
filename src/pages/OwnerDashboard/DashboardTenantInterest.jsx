import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiClock, FiX, FiMail, FiPhone } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import OwnerApi from "../../apis/owner/owner.api";

export default function DashboardTenantInterest() {
  const [isOpen, setIsOpen] = useState(false);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchInterests = async () => {
    console.log("📡 fetchInterests called, statusFilter:", statusFilter);
    try {
      setLoading(true);
      const ownerApi = new OwnerApi();
      const res = await ownerApi.getTenantInterests({
        status: statusFilter === "All" ? "" : statusFilter,
        page: 1,
        limit: 10,
      });
      console.log("API response:", res);

      if (res?.status === "success") {
        console.log("✅ interests fetched:", res.data.interests);
        setInterests(res.data.interests);
      } else {
        console.log("❌ API returned error:", res?.data);
        setError(res?.data?.message || "Failed to fetch");
      }
    } catch (err) {
      console.log("🔥 fetchInterests crashed:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🎬 useEffect fired with filter:", statusFilter);
    fetchInterests();
  }, [statusFilter]);

  const handleUpdateStatus = async (interestId, newStatus) => {
    try {
      setLoading(true);
      const ownerApi = new OwnerApi();
      const res = await ownerApi.updateInterestStatus({
        interest_id: interestId,
        new_status: newStatus,
      });

      if (res?.data?.status === "success") {
        console.log("✅ Status updated:", res.data);
        toast.success(
          newStatus === "accepted"
            ? "Interest approved successfully"
            : "Interest declined successfully"
        );

        // 🔹 Update UI instantly
        setInterests((prev) =>
          prev.map((item) =>
            item.interestId === interestId
              ? { ...item, status: newStatus }
              : item
          )
        );
      } else {
        toast.error(res?.data?.message || "Failed to update status");
      }
    } catch (err) {
      console.error("🔥 Error updating status:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const filteredInterests = interests.filter(
    (i) =>
      i.tenant.fullName.toLowerCase().includes(search.toLowerCase()) ||
      i.property.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-[#D7B56D] to-[#c09d4f] text-white rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold">Tenant Interests</h2>
        <p className="text-sm opacity-90">
          Track and manage tenants who showed interest in your properties.
        </p>
      </motion.div>

      {/* Filters + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7B56D]"
          >
            <option>All</option>
            <option>pending</option>
            <option>accepted</option>
            <option>declined</option>
          </select>
        </div>

        <div className="relative flex items-center justify-end w-full sm:w-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-full bg-gradient-to-r from-[#D7B56D] to-[#B28C3F] text-white shadow-md hover:scale-110 transition-transform"
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
                className="absolute right-14 bg-white border border-gray-200 shadow-md rounded-full flex items-center px-3 overflow-hidden"
              >
                <IoSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search properties..."
                  autoFocus
                  className="w-full py-2 bg-transparent outline-none text-gray-700 text-sm"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Loader */}
      {loading && (
      
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-14 h-14 border-4 border-[#D7B56D] border-t-transparent rounded-full"
      ></motion.div>

      <p className="mt-6 text-lg font-semibold text-gray-700">
        Loading <span className="text-[#B28C3F]">Tenant Interests</span>...
      </p>

      <p className="text-sm text-gray-500 mt-2">
        Please wait while we fetch tenant interests.
      </p>
    </div>

      )}


      {/* Tenant Interests as Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInterests.map((i, idx) => (
          <motion.div
            key={i.interestId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition border border-gray-100"
          >
            {/* Top row: Tenant + Status */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={i.tenant.profilePicture}
                  alt={i.tenant.fullName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#D7B56D]"
                />
                <h3 className="font-semibold text-lg text-gray-800">
                  {i.tenant.fullName}
                </h3>

              </div>

              <span
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${i.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : i.status === "declined"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {i.status === "accepted" && <FiCheckCircle />}
                {i.status === "declined" && <FiXCircle />}
                {i.status === "pending" && <FiClock />}
                {i.status}
              </span>
            </div>

            <h3 className="font-[600] mb-2 text-lg text-gray-800">
              "{i.message || "I am interested in the property"}"
            </h3>

            {/* Property */}
            <p className="text-[18px] text-[#D7B56D] font-semibold">
              {i.property.name}
            </p>
            <p className="text-[14px] text-gray-600 font-semibold">
              {i.property.address}, {i.property.location}
            </p>

            {/* Tenant email */}
            <p className="text-[14px] text-gray-600 mt-1 flex flex-col gap-1">
              {i.tenant.email && (
                <span className="flex items-center gap-1">
                  <FiMail className="text-gray-500" /> {i.tenant.email}
                </span>
              )}
              {i.tenant.mobileNumber && (
                <span className="flex items-center gap-1">
                  <FiPhone className="text-gray-500" /> {i.tenant.mobileNumber}
                </span>
              )}
            </p>

            {/* Date */}
            <p className="text-[14px] text-gray-700 mt-3">
              {new Date(i.createdAt).toLocaleDateString()}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              {/* <button className="bg-[#D7B56D] text-white px-4 py-2 rounded-xl text-sm shadow hover:bg-[#c09d4f] transition">
                View Details
              </button> */}
              {i.status === "pending" && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(i.interestId, "accepted")}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm shadow hover:bg-green-700 transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(i.interestId, "declined")}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm shadow hover:bg-red-700 transition"
                  >
                    Decline
                  </button>
                </>
              )}

            </div>
          </motion.div>
        ))}
      </div>

      {!loading && filteredInterests.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 mt-6"
        >
          No tenant interests found.
        </motion.p>
      )}
    </div>
  );
}
