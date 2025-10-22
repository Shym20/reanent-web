import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCheckCircle, FiClock, FiXCircle, FiX,  FiHome, FiZap, FiPlus } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";


export default function DashboardTenantRentUtilities() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [payments, setPayments] = useState([
    {
      date: "2025-09-01",
      property: "2BHK Apartment",
      tenant: "John Doe",
      phone: "9876543210",
      amount: 1200,
      type: "Rent",
      status: "Paid",
    },
    {
      date: "2025-08-29",
      property: "Luxury Villa",
      tenant: "Alice Smith",
      phone: "9876543210",
      amount: 200,
      type: "Utilities",
      status: "Pending",
    },
    {
      date: "2025-08-20",
      property: "Studio Flat",
      tenant: "Mark Wilson",
      phone: "9876543210",
      amount: 900,
      type: "Rent",
      status: "Overdue",
    },
  ]);

  const [newPayment, setNewPayment] = useState({
    date: "",
    property: "",
    tenant: "",
    phone: "",
    amount: "",
    type: "Rent",
    status: "Paid",
  });

  const filteredPayments = payments.filter(
    (p) =>
      (filter === "All" || p.status === filter) &&
      (p.tenant.toLowerCase().includes(search.toLowerCase()) ||
        p.property.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddPayment = () => {
    setPayments([...payments, newPayment]);
    setNewPayment({
      date: "",
      property: "",
      tenant: "",
      phone: "",
      amount: "",
      type: "Rent",
      status: "Paid",
    });
    setManualOpen(false);
  };

  const [isOpenn, setIsOpenn] = useState(false);
  const [payment, setPayment] = useState({
    property: "",
    type: "Rent",
    amount: "",
    method: "UPI",
  });

  const handlePay = () => {
    alert(
      `Processing ${payment.type} payment of ₹${payment.amount} for ${payment.property} via ${payment.method}`
    );
    setIsOpenn(false);
  };

  return (
   <div className="p-6 space-y-6">
  {/* Header */}
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-gradient-to-r from-[#033E4A] to-[#046E6E] text-white rounded-2xl p-6 shadow-lg"
  >
    <h2 className="text-2xl font-bold">Rent & Utilities</h2>
    <p className="text-sm opacity-90">
      Track rental and utility payments across all your properties.
    </p>
  </motion.div>

  {/* Filters & Search */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div className="flex gap-3">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#033E4A]"
      >
        <option>All</option>
        <option>Paid</option>
        <option>Pending</option>
        <option>Overdue</option>
      </select>

      {/* Create Manually Button */}
     <motion.button
        onClick={() => setIsOpenn(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-[#033E4A] to-[#046E6E] text-white px-6 py-2 rounded-xl shadow-lg font-medium"
      >
        Make a Payment
      </motion.button>
    </div>

    {/* Search */}
    <div className="relative flex items-center justify-end w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-gradient-to-r from-[#033E4A] to-[#046E6E] text-white shadow-md hover:scale-110 transition-transform"
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
              placeholder="Search properties..."
              autoFocus
              className="w-full py-2 bg-transparent outline-none text-gray-700 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>

  {/* Payments Table */}
  <div className="overflow-x-auto">
    <motion.table
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full border-collapse bg-white rounded-2xl shadow-md overflow-hidden"
    >
      <thead>
        <tr className="bg-[#E6F3F4] text-left text-sm text-gray-600">
          <th className="py-3 px-4">Date</th>
          <th className="py-3 px-4">Property</th>
          <th className="py-3 px-4">Owner</th>
          <th className="py-3 px-4">Phone</th>
          <th className="py-3 px-4">Type</th>
          <th className="py-3 px-4">Amount</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredPayments.map((p, idx) => (
          <motion.tr
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="border-b text-sm hover:bg-gray-50"
          >
            <td className="py-3 px-4">{p.date}</td>
            <td className="py-3 px-4 font-medium text-gray-800">{p.property}</td>
            <td className="py-3 px-4">{p.tenant}</td>
            <td className="py-3 px-4">{p.phone}</td>
            <td className="py-3 px-4">{p.type}</td>
            <td className="py-3 px-4 font-semibold text-gray-700">₹{p.amount}</td>
            <td className="py-3 px-4">
              <span
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm w-fit ${
                  p.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : p.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {p.status === "Paid" && <FiCheckCircle />}
                {p.status === "Pending" && <FiClock />}
                {p.status === "Overdue" && <FiXCircle />}
                {p.status}
              </span>
            </td>
            <td className="py-3 px-4">
              <button className="bg-[#033E4A] text-white px-3 py-1 rounded-xl text-xs shadow hover:bg-[#046E6E] transition">
                View
              </button>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </motion.table>
  </div>

  {/* Empty State */}
  {filteredPayments.length === 0 && (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-gray-500 mt-6"
    >
      No payment records found.
    </motion.p>
  )}

  {/* Manual Entry Modal */}
  <AnimatePresence>
    {manualOpen && (
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md"
        >
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            Add Manual Payment
          </h3>

          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={newPayment.date}
                onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Property
              </label>
              <select
                value={newPayment.property}
                onChange={(e) => setNewPayment({ ...newPayment, property: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
              >
                <option value="">Select Property</option>
                <option>2BHK Apartment</option>
                <option>Luxury Villa</option>
                <option>Studio Flat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Type
              </label>
              <select
                value={newPayment.type}
                onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
              >
                <option value="">Select Type</option>
                <option>Rent</option>
                <option>Utilities</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tenant Name
              </label>
              <input
                type="text"
                placeholder="Enter tenant name"
                value={newPayment.tenant}
                onChange={(e) => setNewPayment({ ...newPayment, tenant: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tenant Phone
              </label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={newPayment.phone}
                onChange={(e) => setNewPayment({ ...newPayment, phone: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Payment Status
              </label>
              <select
                value={newPayment.status}
                onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
              >
                <option>Paid</option>
                <option>Pending</option>
                <option>Overdue</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setManualOpen(false)}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPayment}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#033E4A] to-[#046E6E] text-white shadow hover:scale-105 transition-transform"
            >
              Add Payment
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

  <div className="mt-10">
      {/* Trigger Button */}
      

      {/* Modal */}
      <AnimatePresence>
        {isOpenn && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Pay Rent / Utilities
                </h3>
                <button
                  onClick={() => setIsOpenn(false)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Property */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Select Property
                  </label>
                  <select
                    value={payment.property}
                    onChange={(e) =>
                      setPayment({ ...payment, property: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
                  >
                    <option value="">Choose property</option>
                    <option>2BHK Apartment</option>
                    <option>Luxury Villa</option>
                    <option>Studio Flat</option>
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Payment Type
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPayment({ ...payment, type: "Rent" })}
                      className={`flex-1 px-4 py-2 rounded-lg border flex items-center justify-center gap-2 transition ${
                        payment.type === "Rent"
                          ? "bg-[#033E4A] text-white"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      <FiHome /> Rent
                    </button>
                    <button
                      onClick={() =>
                        setPayment({ ...payment, type: "Utilities" })
                      }
                      className={`flex-1 px-4 py-2 rounded-lg border flex items-center justify-center gap-2 transition ${
                        payment.type === "Utilities"
                          ? "bg-[#046E6E] text-white"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      <FiZap /> Utilities
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={payment.amount}
                    onChange={(e) =>
                      setPayment({ ...payment, amount: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
                  />
                </div>

                {/* Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={payment.method}
                    onChange={(e) =>
                      setPayment({ ...payment, method: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
                  >
                    <option>UPI</option>
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>Net Banking</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsOpenn(false)}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePay}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#033E4A] to-[#046E6E] text-white shadow hover:scale-105 transition-transform"
                >
                  Pay Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
</div>

  );
}
