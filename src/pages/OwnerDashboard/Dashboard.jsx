// import React, { useState } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";

// const properties = [
//   {
//     id: 1,
//     title: "Property - 1",
//     address: "Maruti Mandir Chowk, Talegaon Dabhade, Pune – 410506",
//     status: "Active",
//     type: "Family Home",
//     size: "950 sq. ft.",
//     price: "5000k",
//     aboutPlace: "1 Living Room • 1 Kitchen • 2 Bedrooms • 2 Bathrooms",
//     description:
//       "A spacious 2BHK apartment with excellent ventilation, modern interiors, and semi-furnished fittings including wardrobes",
//     image:
//       "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500&q=80",
//     totalImages: 12,
//   },
//   {
//     id: 2,
//     title: "Property - 2",
//     address: "Ganesh Nagar, Pimpri, Pune – 411018",
//     status: "Active",
//     type: "Apartment",
//     size: "750 sq. ft.",
//     price: "3500k",
//     aboutPlace: "1 Living Room • 1 Kitchen • 1 Bedroom • 1 Bathroom",
//     description:
//       "A cozy 1BHK apartment ideal for small families with modern fittings and good locality",
//     image:
//       "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80",
//     totalImages: 8,
//   },
//   {
//     id: 3,
//     title: "Property - 3",
//     address: "Shivaji Nagar, Pune – 411005",
//     status: "Active",
//     type: "Villa",
//     size: "1500 sq. ft.",
//     price: "9000k",
//     aboutPlace: "1 Living Room • 1 Kitchen • 3 Bedrooms • 3 Bathrooms",
//     description:
//       "Luxury villa with spacious rooms, modular kitchen, garden space and semi-furnished interiors",
//     image:
//       "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=500&q=80",
//     totalImages: 15,
//   },
// ];

// const property = {
//   id: 1,
//   title: "Room - 1",
//   address: "Maruti Mandir Chowk, Talegaon Dabhade, Pune – 410506",
//   status: "Active",
//   type: "Family Home",
//   size: "950 sq. ft.",
//   price: "5000k",
//   amenities: ["1 Living Room", "1 Kitchen", "2 Bedrooms", "2 Bathrooms"],
//   description:
//     "A spacious 2BHK apartment with excellent ventilation, modern interiors, and semi-furnished fittings including wardrobes",
//   owner: {
//     name: "Vivek Jain",
//     number: "1234567890",
//     image: "https://randomuser.me/api/portraits/men/32.jpg", // owner pic
//   },
//   image:
//     "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", // property image
//   imagesCount: 12,
// };

// const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState("MyProperty");

//   return (
//     <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl">
//       {/* Tabs */}
//       <div className="flex sm:flex-row p-1 border border-[#033E4A33] shadow mb-6 rounded-xl overflow-hidden w-full sm:w-fit">
//         <button
//           onClick={() => setActiveTab("MyProperty")}
//           className={`px-4.5 md:px-16 py-2 rounded-xl font-medium ${
//             activeTab === "MyProperty"
//               ? "bg-[#033E4A] text-white"
//               : "bg-white text-gray-700"
//           } transition`}
//         >
//           My Property
//         </button>
//         <button
//           onClick={() => setActiveTab("AsTenant")}
//           className={`px-4.5 md:px-16 py-2 rounded-xl font-medium ${
//             activeTab === "AsTenant"
//               ? "bg-[#033E4A] text-white"
//               : "bg-white text-gray-700"
//           } transition`}
//         >
//           Property, Me as Tenant
//         </button>
//       </div>

//       {/* MyProperty Tab */}
//       {activeTab === "MyProperty" ? (
//         <div className="space-y-4">
//           {properties.map((property) => (
//             <div
//   key={property.id}
//   className="flex flex-col md:flex-row items-start gap-4 bg-[#FAFAFA] rounded-xl shadow p-4 relative"
// >
//   {/* Image */}
//   <div className="relative w-full md:w-52 h-40 flex-shrink-0">
//     <img
//       src={property.image}
//       alt={property.title}
//       className="w-full h-full object-cover rounded-lg"
//     />
//     <span className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-white text-lg font-semibold">
//       {property.totalImages}+
//     </span>
//   </div>

//   {/* Content */}
//   <div className="flex flex-col flex-1 gap-2">
//     <h2 className="text-lg text-[#18181B] font-semibold">{property.title}</h2>
//     <p className="text-sm text-[#24292E]">
//       <span className="font-semibold text-[#171717]">Address- </span>
//       {property.address}
//     </p>
//     <p className="text-sm">
//       <span className="font-semibold text-[#171717]">Status- </span>
//       <span className="text-green-600 rounded-xl py-1 px-2 bg-[#34C7591F] font-medium">
//         {property.status}
//       </span>
//     </p>
//     <p className="text-sm text-[#24292E]">
//       <span className="font-semibold text-[#171717]">Type- </span>
//       {property.type} &nbsp;
//       <span className="font-semibold text-[#171717]">Size- </span>
//       {property.size} &nbsp;
//       <span className="font-semibold text-[#171717]">Price- </span>
//       {property.price}
//     </p>
//     <p className="text-sm">
//       <span className="font-semibold text-[#171717]">About Place:</span>{" "}
//       {property.aboutPlace}
//     </p>
//     <p className="text-sm text-[#24292E]">
//       <span className="font-semibold text-[#171717]">Description- </span>
//       {property.description}{" "}
//       <span className="text-black font-semibold cursor-pointer">Read more</span>
//     </p>
//   </div>

//   {/* Action Buttons */}
//   <div className="flex gap-2 mt-2 md:mt-0 md:absolute md:top-4 md:right-4">
//     <button className="flex items-center gap-1 px-3 py-1 bg-[#033E4A] text-white rounded-lg hover:bg-teal-800 text-sm">
//       <FaEdit /> Edit
//     </button>
//     <button className="flex items-center gap-1 px-3 py-1 bg-[#FF3B30] text-white rounded-lg hover:bg-red-700 text-sm">
//       <FaTrash /> Delete
//     </button>
//   </div>
// </div>

//           ))}
//         </div>
//       ) : (
//         // AsTenant Tab
//         <div className="bg-white shadow-md shadow-[#E5E5E5] border border-[#E5E5E5] rounded-lg p-4 flex flex-col md:flex-row gap-6">
//           {/* Property Info */}
//           <div className="flex-1">
//             <h2 className="text-lg font-semibold">{property.title}</h2>

//             {/* Image */}
//             <div className="relative mt-2">
//               <img
//                 src={property.image}
//                 alt="Property"
//                 className="w-full md:w-100 h-52 object-cover rounded-md"
//               />
//               <span className="absolute bottom-2 left-2 bg-black text-white text-sm px-2 py-1 rounded-md">
//                 {property.imagesCount}+
//               </span>
//             </div>

//             {/* Details */}
//             <div className="flex flex-col mt-4 gap-2">
//               <p className="text-sm text-[#24292E]">
//                 <span className="font-semibold text-[#171717]">Address- </span>
//                 {property.address}
//               </p>
//               <p className="text-sm">
//                 <span className="font-semibold text-[#171717]">Status- </span>
//                 <span className="text-green-600 rounded-xl py-1 px-2 bg-[#34C7591F] font-medium">
//                   {property.status}
//                 </span>
//               </p>
//               <p className="text-sm text-[#24292E]">
//                 <span className="font-semibold text-[#171717]">Type- </span>
//                 {property.type} &nbsp;
//                 <span className="font-semibold text-[#171717]">Size- </span>
//                 {property.size} &nbsp;
//                 <span className="font-semibold text-[#171717]">Price- </span>
//                 {property.price}
//               </p>
//               <p className="text-sm">
//                 <span className="font-semibold text-[#171717]">
//                   About Place:
//                 </span>{" "}
//                 {property.amenities.join(", ")}
//               </p>
//               <p className="text-sm w-full md:w-[80%] text-[#24292E]">
//                 <span className="font-semibold text-[#171717]">
//                   Description-{" "}
//                 </span>
//                 {property.description}{" "}
//                 <span className="text-black font-semibold cursor-pointer">
//                   Read more
//                 </span>
//               </p>
//             </div>
//           </div>

//           {/* Owner Info */}
//           <div className="w-full md:w-80 flex flex-col items-center md:pl-4">
//             <img
//               src={property.owner.image}
//               alt="Owner"
//               className="w-28 h-28 rounded-full mt-4 md:mt-10 object-cover border"
//             />
//             <div>
//               <p className="mt-3 text-sm text-[#24292E] text-center md:text-left">
//                 <span className="font-semibold text-[#171717]">
//                   Property Owner -
//                 </span>{" "}
//                 {property.owner.name}
//               </p>
//               <p className="text-sm mt-2 text-[#24292E] text-center md:text-left">
//                 <span className="font-semibold text-[#171717]">Number -</span>{" "}
//                 {property.owner.number}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import { motion } from "framer-motion";
import { useState } from "react";
import { FiHome, FiPlus, FiUsers, FiDollarSign, FiBell, FiUser, FiCalendar } from "react-icons/fi";
import { getUserLocal } from "../../utils/localStorage.util";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Link } from "react-router-dom";

const monthlyRent = [
  { month: "Jan", rent: 12000 },
  { month: "Feb", rent: 15000 },
  { month: "Mar", rent: 14000 },
  { month: "Apr", rent: 18000 },
  { month: "May", rent: 20000 },
  { month: "June", rent: 16000 },

];

const paymentStatus = [
  { name: "Paid", value: 65 },
  { name: "Pending", value: 20 },
  { name: "Overdue", value: 15 },
];

const COLORS = ["#399e3c", "#FFB020", "#d83636"];

export default function OwnerDashboard() {

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

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-[#D7B56D] to-[#c09d4f] text-white rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold">Welcome back, {userName} </h2>
        <p className="text-sm opacity-90">
          Here’s what’s happening with your properties today.
        </p>
      </motion.div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: "Active Listings",
            value: "4",
            icon: <FiHome />,
          },
          {
            title: "Tenant Interests",
            value: "12",
            icon: <FiUsers />,
          },
          {
            title: "Total Earnings",
            value: "₹1,240",
            icon: <FiDollarSign />,
          },
          {
            title: "Notifications",
            value: "3",
            icon: <FiBell />,
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4"
          >
            <div className="p-3 bg-[#D7B56D]/20 rounded-xl text-[#D7B56D] text-xl">
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <h3 className="text-lg font-bold">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-0">

        {/* Rent Collection Bar Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Rent Collection</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyRent}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rent" fill="#D7B56D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Pie Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={paymentStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {paymentStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-md p-6 w-full"
      >
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <FiCalendar className="text-[#D7B56D]" /> Payments Overview
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
                  {/* Tenant Info */}
                  <div>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <FiUser /> {p.tenant}
                    </p>
                    <p className="text-sm text-gray-500">{p.property}</p>
                  </div>

                  {/* Amount + Due Date */}
                  <div className="text-right">
                    <p className="font-bold text-red-600 flex items-center gap-1 justify-end">
                      <FiDollarSign /> {p.amount}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(p.dueDate).toLocaleDateString()}
                    </p>
                    <button className="mt-2 px-3 py-2 text-sm rounded-lg font-semibold border-1 border-red-500 text-red-600 flex items-center gap-1 hover:bg-red-500 hover:text-white transition">
                      <FiBell /> Send Reminder
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No overdue payments 🎉</p>
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
                  {/* Tenant Info */}
                  <div>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <FiUser /> {p.tenant}
                    </p>
                    <p className="text-sm text-gray-500">{p.property}</p>
                  </div>

                  {/* Amount + Due Date */}
                  <div className="text-right">
                    <p className="font-bold text-yellow-700 flex items-center gap-1 justify-end">
                      <FiDollarSign /> {p.amount}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(p.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No payments due soon</p>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl p-6 shadow-md"
      >
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <Link to={'add-property'}>
            <button className="bg-[#D7B56D] text-white px-4 py-2 rounded-xl flex items-center shadow hover:bg-[#c09d4f] transition">
              <FiPlus className="mr-2" /> Add Property
            </button>
          </Link>
          <Link to={'my-properties'}>
            <button className="border border-[#D7B56D] text-[#D7B56D] px-4 py-2 rounded-xl hover:bg-[#D7B56D]/10 transition">
              Manage Listings
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Rent Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-6 shadow-lg mt-6 border border-[#D7B56D]/20"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h3 className="text-xl font-semibold text-gray-800">Rent Payment History</h3>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm focus:outline-none 
                   focus:ring-2 focus:ring-[#D7B56D] bg-white shadow-sm"
            >
              <option>All Properties</option>
              <option>2BHK Apartment</option>
              <option>Luxury Villa</option>
              <option>Studio Flat</option>
            </select>

            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm focus:outline-none 
                   focus:ring-2 focus:ring-[#D7B56D] bg-white shadow-sm"
            >
              <option>All Time</option>
              <option>Last 2 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="overflow-x-auto rounded-lg border border-[#D7B56D]/20">
          <table className="w-full min-w-[700px] text-sm">
            {/* Table Head */}
            <thead>
              <tr className="bg-[#D7B56D]/20 text-gray-700 border-b">
                <th className="py-3 px-4 text-left font-semibold">Date</th>
                <th className="py-3 px-4 text-left font-semibold">Property</th>
                <th className="py-3 px-4 text-left font-semibold">Tenant</th>
                <th className="py-3 px-4 text-left font-semibold">Amount</th>
                <th className="py-3 px-4 text-left font-semibold">Paid via</th>
                <th className="py-3 px-4 text-left font-semibold">Status</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {paymentss.map((p, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="border-b last:border-0 hover:bg-[#D7B56D]/10 transition cursor-pointer"
                >
                  <td className="py-3 px-4">{p.date}</td>
                  <td className="py-3 px-4">{p.property}</td>
                  <td className="py-3 px-4">{p.tenant}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{p.amount}</td>
                  <td className="py-3 px-4 font-medium text-gray-700">PhonePe</td>

                  {/* Status pill */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                ${p.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Inquiries */}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="bg-white rounded-2xl p-6 shadow-md mt-6" >
        <h3 className="text-lg font-semibold mb-4">Recent Tenant Inquiries</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="text-gray-500 border-b bg-gray-50">
                <th className="py-2 px-3 text-left">Tenant</th>
                <th className="py-2 px-3 text-left">Property</th>
                <th className="py-2 px-3 text-left">Message</th>
                <th className="py-2 px-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-3">John Doe</td>
                <td className="px-3">2BHK Apartment</td>
                <td className="px-3">Interested in booking</td>
                <td className="px-3 text-green-600">New</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3">Alice Smith</td>
                <td className="px-3">Luxury Villa</td>
                <td className="px-3">Can I schedule a visit?</td>
                <td className="px-3 text-yellow-600">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}

