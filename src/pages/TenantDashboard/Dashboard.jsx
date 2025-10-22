import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiHome, FiPlus, FiUsers, FiDollarSign, FiBell, FiUser, FiCalendar, FiStar, FiX } from "react-icons/fi";
import { getUserLocal } from "../../utils/localStorage.util";
import { Link } from "react-router-dom";



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
    // Optional Comment
    comments: "",
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
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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
              Additional Comments (Optional)
            </label>
            <textarea
              rows="3"
              value={ratings.comments}
              onChange={(e) => handleRatingChange("comments", e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#B28C3F] focus:border-[#B28C3F]"
              placeholder="e.g., Owner was cooperative and property was well maintained."
            ></textarea>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#033E4A] text-white hover:bg-[#045364] transition shadow-md"
            >
              Submit Rating
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}




export default function TenantDashboard() {

  const [propertyFilter, setPropertyFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");

  const paymentss = [
    { date: "2025-09-01", property: "2BHK Apartment", tenant: "John Doe", amount: "₹500", status: "Paid" },
    { date: "2025-08-15", property: "Luxury Villa", tenant: "Alice Smith", amount: "₹1,200", status: "Pending" },
    { date: "2025-07-20", property: "Studio Flat", tenant: "Mark Wilson", amount: "₹350", status: "Paid" },
  ];

  const today = new Date();

  // Example data
  const payments = [
    {
      tenant: "John Doe",
      property: "2BHK Apartment",
      amount: 1200,
      dueDate: "2025-09-01", // overdue
    },
    {
      tenant: "Alice Smith",
      property: "Luxury Villa",
      amount: 2500,
      dueDate: "2025-09-10", // upcoming within 7 days
    },
    {
      tenant: "Mark Wilson",
      property: "Studio Flat",
      amount: 800,
      dueDate: "2025-09-12", // not upcoming
    },
  ];

  // filter payments
  const overdue = payments.filter(
    (p) => new Date(p.dueDate) < today
  );
  const upcoming = payments.filter((p) => {
    const due = new Date(p.dueDate);
    const diff = (due - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });

  const user = getUserLocal();
  console.log("user here : ", user)
  const userName = user?.fullName || "Guest User";

  const [showRatingModal, setShowRatingModal] = useState(false);
const [selectedOwner, setSelectedOwner] = useState(null);
const [selectedProperty, setSelectedProperty] = useState(null);

const handleRateOwner = (owner, property) => {
  setSelectedOwner(owner);
  setSelectedProperty(property);
  setShowRatingModal(true);
};

const handleSubmitRating = (payload) => {
  console.log("Tenant submitted rating:", payload);
  setShowRatingModal(false);
};

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <button
  className="text-sm text-[#033E4A] underline hover:text-[#045364]"
  onClick={() =>
    handleRateOwner(
      { userId: "owner123", name: "Rahul Mehta" },
      { id: "property123", title: "2BHK Apartment" }
    )
  }
>
  Rate Owner
</button>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-[#033E4A] to-[#046472] text-white rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold">Welcome back, {userName}</h2>
        <p className="text-sm opacity-90">
          Here’s what’s happening with your rentals today.
        </p>
      </motion.div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  {[
    {
      title: "My Current Stay",
      value: "Property Name",
      icon: <FiHome />,
    },
    {
      title: "Interests Send",
      value: "5",
      icon: <FiUsers />,
    },
    {
      title: "Saved Properties",
      value: "5",
      icon: <FiDollarSign />,
    },
    {
      title: "Notifications",
      value: "2",
      icon: <FiBell />,
    },
  ].map((card, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.2 }}
      className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition"
    >
      <div className="p-3 bg-[#033E4A]/10 rounded-xl text-[#033E4A] text-xl">
        {card.icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{card.title}</p>
        <h3 className="text-lg font-bold text-[#033E4A]">{card.value}</h3>
      </div>
    </motion.div>
  ))}
</div>

  {/* Quick Actions */}
     <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.8 }}
  className="bg-white rounded-2xl p-6 shadow-md"
>
  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
  <div className="flex gap-4">
    <Link to={'search'}>
    <button className="bg-[#033E4A] text-white px-4 py-2 rounded-xl flex items-center shadow hover:bg-[#045364] transition">
      <FiPlus className="mr-2" /> Search Property
    </button>
    </Link>
    <Link to={'rent-utilities'}>
    <button className="border border-[#033E4A] text-[#033E4A] px-4 py-2 rounded-xl hover:bg-[#033E4A]/10 transition">
      Pay Rent
    </button>
    </Link>
  </div>
</motion.div>


     <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="bg-white rounded-2xl shadow-md p-6 w-full"
>
  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
    <FiCalendar className="text-[#033E4A]" /> Payments Overview
  </h2>

  {/* Overdue Payments */}
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-red-600 mb-3">Overdue</h3>
    {overdue.length > 0 ? (
      <div className="space-y-3">
        {overdue.map((p, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-4 border border-red-200 rounded-xl bg-red-50"
          >
            {/* Property Info */}
            <div>
              <p className="font-semibold text-gray-800">{p.property}</p>
              <p className="text-sm text-gray-500">
                Rent: <span className="font-medium">₹{p.amount}</span>
              </p>
              {p.reminder && (
                <p className="text-xs text-red-500 italic mt-1">
                   Reminder: {p.reminder}
                </p>
              )}
            </div>

            {/* Amount + Due Date + Action */}
            <div className="text-right">
              <p className="font-bold text-red-600 flex items-center gap-1 justify-end">
                <FiDollarSign /> {p.amount}
              </p>
              <p className="text-xs text-gray-500">
                Due: {new Date(p.dueDate).toLocaleDateString()}
              </p>
              <button className="mt-2 px-3 py-2 text-sm rounded-lg font-semibold border-1 border-red-500 text-red-600 flex items-center gap-1 hover:bg-red-500 hover:text-white  shadow hover:scale-105 transition">
                 Pay Rent Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-sm">No overdue payments </p>
    )}
  </div>

  {/* Upcoming Payments */}
  <div>
    <h3 className="text-lg font-semibold text-yellow-600 mb-3">
      Upcoming (Next 7 Days)
    </h3>
    {upcoming.length > 0 ? (
      <div className="space-y-3">
        {upcoming.map((p, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-4 border border-yellow-200 rounded-xl bg-yellow-50"
          >
            {/* Property Info */}
            <div>
              <p className="font-semibold text-gray-800">{p.property}</p>
              <p className="text-sm text-gray-600">
                Rent: <span className="font-medium">₹{p.amount}</span>
              </p>
            </div>

            {/* Due Date + Pay Button */}
            <div className="text-right">
              <p className="font-bold text-yellow-700 flex items-center gap-1 justify-end">
                <FiDollarSign /> {p.amount}
              </p>
              <p className="text-xs text-gray-500">
                Due: {new Date(p.dueDate).toLocaleDateString()}
              </p>
              <button className="mt-2 px-3 py-1 text-xs rounded-lg bg-gradient-to-r from-[#033E4A] to-teal-700 text-white flex items-center gap-1 shadow hover:scale-105 transition">
                 Pay Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-sm">No payments due soon</p>
    )}
  </div>
</motion.div>

     {/* Rent Payment History */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1.2 }}
  className="bg-white rounded-2xl p-6 shadow-md mt-6"
>
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
    <h3 className="text-lg font-semibold">Rent Payment History</h3>

    {/* Filters */}
    <div className="flex gap-3">
      <select
        value={propertyFilter}
        onChange={(e) => setPropertyFilter(e.target.value)}
        className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#033E4A]"
      >
        <option>All Properties</option>
        <option>2BHK Apartment</option>
        <option>Luxury Villa</option>
        <option>Studio Flat</option>
      </select>

      <select
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value)}
        className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#033E4A]"
      >
        <option>All Time</option>
        <option>Last 2 Months</option>
        <option>Last 6 Months</option>
      </select>
    </div>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="text-gray-600 border-b bg-[#033E4A]/10">
          <th className="py-3 px-4 text-left">Date</th>
          <th className="py-3 px-4 text-left">Property</th>
          <th className="py-3 px-4 text-left">Owner</th>
          <th className="py-3 px-4 text-left">Amount</th>
          <th className="py-3 px-4 text-left">Paid via</th>
          <th className="py-3 px-4 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {paymentss.map((p, i) => (
          <motion.tr
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i }}
            className="border-b hover:bg-[#033E4A]/5 transition"
          >
            <td className="py-3 px-4">{p.date}</td>
            <td className="py-3 px-4">{p.property}</td>
            <td className="py-3 px-4">{p.tenant}</td>
            <td className="py-3 px-4 font-medium">{p.amount}</td>
            <td className="py-3 px-4 font-medium">Cash</td>
            <td
              className={`py-3 px-4 font-semibold ${
                p.status === "Paid"
                  ? "text-green-600"
                  : p.status === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {p.status}
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
</motion.div>

{/* Recent Inquiries */}
{/* <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1.0 }}
  className="bg-white rounded-2xl p-6 shadow-md"
>
  <h3 className="text-lg font-semibold mb-4 ">Recent Tenant Inquiries</h3>
  <table className="w-full text-sm">
    <thead>
      <tr className="text-gray-600 border-b bg-[#033E4A]/10">
        <th className="py-2 text-left">Tenant</th>
        <th className="py-2 text-left">Property</th>
        <th className="py-2 text-left">Message</th>
        <th className="py-2 text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b hover:bg-[#033E4A]/5 transition">
        <td className="py-2">John Doe</td>
        <td>2BHK Apartment</td>
        <td>Interested in booking</td>
        <td className="text-green-600 font-medium">New</td>
      </tr>
      <tr className="border-b hover:bg-[#033E4A]/5 transition">
        <td className="py-2">Alice Smith</td>
        <td>Luxury Villa</td>
        <td>Can I schedule a visit?</td>
        <td className="text-yellow-600 font-medium">Pending</td>
      </tr>
    </tbody>
  </table>
</motion.div> */}


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
