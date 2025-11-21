import React, { useState } from "react";
import { FaEnvelope, FaFileAlt, FaHistory, FaMoneyBill, FaMoneyBillWave, FaPhone, FaUser } from "react-icons/fa";
import { useNavigate, useParams, Link } from "react-router-dom";
import { BsCalendarDateFill } from "react-icons/bs";
import testimonialImg from "../../assets/icons/testimonial-icon.png";

const propertyList = [
  { id: "prop1", title: "2BHK Apartment - Indore" },
  { id: "prop2", title: "1RK Flat - Bhopal" },
  { id: "prop3", title: "3BHK Villa - Ujjain" },
];

// ✅ Property-specific rating metrics
const propertyRatingStats = [
  { label: "Property Condition", value: 85 },
  { label: "Neighborhood", value: 70 },
  { label: "Safety/Locality", value: 90 },
  { label: "Property as Described", value: 78 },
];

// ✅ Owner (as rated by tenants) metrics
const ownerRatingStats = [
  { label: "Helpfulness", value: 85 },
  { label: "Restrictions", value: 60 },
  { label: "Strictness", value: 70 },
  { label: "Politeness", value: 90 },
  { label: "Deposit Return", value: 75 },
  { label: "Behaviour with Female Tenants (if applicable)", value: 95 },
];

const testimonials = [
  {
    name: "Riya Sharma, Tenant, Indore",
    image: testimonialImg,
    quote:
      "The property was clean and well maintained. The neighborhood felt safe and quiet.",
  },
  {
    name: "Amit Singh, Tenant, Bhopal",
    image: testimonialImg,
    quote:
      "Good amenities and responsive maintenance support. Would recommend renting here.",
  },
  {
    name: "Neha Patel, Tenant, Ujjain",
    image: testimonialImg,
    quote:
      "Spacious and well-kept flat. Excellent location and great value for money.",
  },
];

const RatingCircles = ({ value }) => {
  const gradientShades = [
    "#ef4444", // 1 - Red
    "#f97316", // 2 - Orange-red
    "#facc15", // 3 - Yellow
    "#84cc16", // 4 - Yellow-green
    "#16a34a", // 5 - Green
  ];

  return (
    <div className="flex space-x-1">
      {gradientShades.map((color, index) => (
        <div
          key={index}
          className="w-3.5 h-3.5 rounded-full border"
          style={{
            backgroundColor: index < Math.round(value) ? color : "transparent",
            borderColor: color,
          }}
        />
      ))}
    </div>
  );
};

const DashboardPropertyDetailToOwner = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy property
  const property = {
    title: "3BHK Apartment in Green View Residency",
    address: "Sector 45, Gurgaon, Haryana",
    type: "Apartment",
    size: "1200 sqft",
    price: 25000,
    status: "Active",
    about: "3 Bedrooms • 1 Kitchen • 2 Bathrooms • 1 Balcony",
    description:
      "A spacious 3BHK apartment with modern amenities, close to metro and market.",
   images: [
  "https://placehold.co/400x250/png?text=Property+Image+1",
  "https://placehold.co/400x250/png?text=Property+Image+2",
  "https://placehold.co/400x250/png?text=Property+Image+3",
   "https://placehold.co/400x250/png?text=Property+Image+4",
],

  };

  // Dummy property channel chat
  const [chatMessages, setChatMessages] = useState([
  { sender: "tenant", text: "Hi, I am interested in the property." },
  { sender: "owner", text: "Thanks for your interest! Are you available for a quick call?" },
  { sender: "system", text: "Tenant 'John Doe' has been assigned to the property." },
]);

  const currentTenant = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 9876543210",
  profile: "https://via.placeholder.com/150",
  paymentDue: "₹12,000 (Oct 2025)"
};

const interestedTenants = [
  { name: "Karan Mehta", email: "karan@example.com", phone: "+91 9871112222" },
  { name: "Simran Kaur", email: "simran@example.com", phone: "+91 9899998888" },
  { name: "Arjun Rao", email: "arjun@example.com", phone: "+91 9812345678" },
];

  const previousTenants = [
    { name: "Priya Verma", duration: "20 Jan 2022 - 20 Dec 2022" },
    { name: "Aman Singh", duration: "22 Jan 2021 - 9 Dec 2021" },
  ];

  const paymentHistory = [
    { tenant: "Rohit Sharma", month: "September 2025", amount: "₹25,000", status: "On-time", Via:"Phonepe" },
    { tenant: "Rohit Sharma", month: "August 2025", amount: "₹25,000", status: "2 days delayed", Via:"Cash" },
    { tenant: "Priya Verma", month: "December 2022", amount: "₹22,000", status: "12 days delayed", Via:"Cash" },
  ];

  const documents = [
    { name: "Rental Agreement.pdf", url: "#" },
    { name: "ID Proof.jpg", url: "#" },
    { name: "Property Images.zip", url: "#" },
  ];

  // Tab state for tenants
  const [tenantTab, setTenantTab] = useState("current");
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("Property");
    const [selectedProperty, setSelectedProperty] = useState(propertyList[0].id);
  
    const handlePropertyChange = (e) => setSelectedProperty(e.target.value);

// Handle send message
const handleSendMessage = () => {
  if (!newMessage.trim()) return;
  setChatMessages([...chatMessages, { sender: "owner", text: newMessage }]);
  setNewMessage("");
};

  return (
    <div className="p-0 space-y-8">
      {/* Property Info */}
      <section className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">{property.title}</h2>
        <p className="text-gray-600">{property.address}</p>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-700">
          <span><b>Type:</b> {property.type}</span>
          <span><b>Size:</b> {property.size}</span>
          <span><b>Rent:</b> ₹{property.price.toLocaleString("en-IN")}</span>
          <span>
            <b>Status:</b>{" "}
            <span className="px-2 py-1 text-sm rounded bg-green-100 text-green-700">
              {property.status}
            </span>
          </span>
        </div>
        <p className="mt-3"><b>About:</b> {property.about}</p>
        <p className="mt-2 text-gray-700">{property.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {property.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Property ${idx}`}
              className="rounded-lg object-cover w-full h-48 hover:scale-105 transition"
            />
          ))}
        </div>
      </section>

      {/* Tenant Tabs */}
    <section className="bg-white shadow-lg rounded-2xl p-6 transition hover:shadow-xl">
  {/* Tabs */}
  <div className="flex border-b border-gray-300 mb-6 space-x-6">
    <button
      onClick={() => setTenantTab("current")}
      className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
        tenantTab === "current"
          ? "border-b-2 border-[#B28C3F] text-[#B28C3F]"
          : "text-gray-600"
      }`}
    >
      <FaUser /> Current Tenant
    </button>
    <button
      onClick={() => setTenantTab("previous")}
      className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
        tenantTab === "previous"
          ? "border-b-2 border-[#B28C3F] text-[#B28C3F]"
          : "text-gray-600"
      }`}
    >
      <FaHistory /> Previous Tenants
    </button>
  </div>

  {/* Current Tenant */}
  {tenantTab === "current" && (
    <div className="flex items-center justify-between gap-6 w-full">
      {/* Left side - Tenant Info */}
      <div className="flex items-center gap-6">
        <img
          src={currentTenant.profile}
          alt="Tenant"
          className="w-24 h-24 rounded-full border-4 border-blue-100 shadow-xs"
        />
        <div className="text-[16px] ">
          <p className="text-xl font-semibold text-gray-800">
            {currentTenant.name}
          </p>
          <p className="flex items-center gap-2 text-gray-600">
            <FaEnvelope className="text-gray-400" /> {currentTenant.email}
          </p>
          <p className="flex items-center gap-2 text-gray-600">
            <FaPhone className="text-gray-400" /> {currentTenant.phone}
          </p>
          <p className="flex items-center gap-2 text-gray-600">
            <BsCalendarDateFill className="text-gray-400"/> Joined: 22/3/25
            <span className="font-medium text-gray-700">
              {currentTenant.joinDate}
            </span>
          </p>
        </div>
      </div>

      {/* Right side - Payment Due */}
      <div className="text-right">
        <p className="flex items-center justify-end gap-2 text-red-500 font-medium">
          Payment Due:{" "}
          <span className="font-semibold">{currentTenant.paymentDue}</span>
        </p>
        <button
          onClick={() => alert(`Reminder sent to ${currentTenant.name}`)}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Send Reminder
        </button>
      </div>
    </div>
  )}

  {/* Previous Tenants */}
  {tenantTab === "previous" && (
    <ul className="space-y-3">
      {previousTenants.map((tenant, idx) => (
        <li
         onClick={() => navigate(`/dashboard-tenant/people-details/1`)}
          key={idx}
          className="flex justify-between items-center p-3 bg-gray-50 rounded-xl shadow-sm hover:bg-gray-100 transition"
        >
          <div>
            <p className="font-medium text-gray-700">{tenant.name}</p>
            
          </div>
          <span className="text-gray-500 text-sm bg-gray-200 px-3 py-1 rounded-full">
            {tenant.duration}
          </span>
        </li>
      ))}
    </ul>
  )}
</section>

      {/* Payment History (Grouped by Tenant) */}
      <section className="bg-white shadow rounded-2xl p-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <FaMoneyBillWave /> Payment History
        </h3>

        {["Rohit Sharma", "Priya Verma"].map((tenant) => (
          <div key={tenant} className="mb-6">
            <h4 className="font-semibold text-lg mb-2 text-[#D7B56D] ">{tenant}</h4>
            <table className="w-full text-left border rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Month</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                   <th className="p-2">Paid via</th>
                </tr>
              </thead>
             <tbody>
          {paymentHistory
            .filter((p) => p.tenant === tenant)
            .map((p, idx) => {
              const isOnTime = p.status === "On-time";
              return (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-2">{p.month}</td>
                  <td className="p-2">{p.amount}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        isOnTime
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-2">{p.Via}</td>
                </tr>
              );
            })}
        </tbody>
            </table>
          </div>
        ))}
      </section>

    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Documents */}
  <div className="bg-white shadow rounded-2xl p-6 flex flex-col">
    <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
      <FaFileAlt /> Documents
    </h3>
    <ul className="space-y-2 flex-1 overflow-y-auto">
      {documents.map((doc, idx) => (
        <li key={idx}>
          <a
            href={doc.url}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {doc.name}
          </a>
        </li>
      ))}
    </ul>
  </div>

  {/* Property Chat Channel */}
  <div className="bg-white shadow rounded-2xl p-6 flex flex-col">
    <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
      <FaEnvelope /> Property Chat Channel
    </h3>

    {/* Scrollable chat area (scroll hidden) */}
    <div
      className="border border-gray-300 rounded-2xl p-4 bg-gray-50 overflow-y-scroll no-scrollbar"
      style={{
        height: "300px",
        scrollbarWidth: "none",     // Firefox
        msOverflowStyle: "none",    // IE & Edge
      }}
    >
      {chatMessages.map((msg, idx) => {
        if (msg.sender === "system") {
          return (
            <div key={idx} className="text-center my-2">
              <span className="text-gray-500 text-sm bg-gray-200 px-3 py-1 rounded-full">
                {msg.text}
              </span>
            </div>
          );
        }

        const isOwner = msg.sender === "owner";
        return (
          <div
            key={idx}
            className={`flex ${isOwner ? "justify-end" : "justify-start"} mb-3`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] shadow ${
                isOwner
                  ? "bg-[#B28C3F] text-white rounded-br-none"
                  : "bg-white text-gray-800 border rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>

    {/* Hide scrollbar (for Webkit browsers like Chrome) */}
    <style jsx>{`
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `}</style>

    {/* Message Input */}
    <div className="flex items-center gap-2 mt-4">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#B28C3F] outline-none"
      />
      <button
        onClick={handleSendMessage}
        className="bg-[#B28C3F] hover:bg-[#9c7a2f] text-white px-4 py-2 rounded-xl shadow-md transition"
      >
        Send
      </button>
    </div>
  </div>
</section>

<section className="mt-10 bg-white rounded-2xl py-6 mx-auto px-4 md:px-8 lg:px-4">

    {/* Property Review Tab */}
    {activeTab === "Property" && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Ratings Summary */}
        <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-3">
            Property Ratings Overview
          </h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-bold">4.3</span>
            <RatingCircles value={4.3} />

          </div>
          <p className="text-gray-500 mb-4">
            Based on 128 reviews for this property
          </p>

          {propertyRatingStats.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#D7B56D] h-2 rounded-full"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-700 w-40">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Reviews Cards */}
        <div className="md:col-span-2 w-full py-0 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testimonials.map((item, index) => (
            <div key={index} className="px-2">
              <div className="relative rounded-xl p-6 pt-4 bg-white shadow-md transition-all duration-300 overflow-visible">
                <p className="text-[#383F45] text-sm sm:text-base my-6 leading-relaxed">
                  {item.quote}
                </p>
                <hr className="my-5 text-gray-200" />
                <h3 className="text-[#383F45] font-semibold text-sm sm:text-base">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Tenant Review Tab (Owner Ratings) */}
    {activeTab === "Owner" && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-3">
            Your Ratings as an Owner
          </h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-bold">4.6</span>
            <RatingCircles value={4.3} />

          </div>
          <p className="text-gray-500 mb-4">Rated by 250 tenants</p>

          {ownerRatingStats.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#D7B56D] h-2 rounded-full"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-700 w-40">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 w-full py-0 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testimonials.map((item, index) => (
            <div key={index} className="px-2">
              <div className="relative rounded-xl p-6 pt-4 bg-white shadow-md transition-all duration-300 overflow-visible">
                <p className="text-[#383F45] text-sm sm:text-base my-6 leading-relaxed">
                  {item.quote}
                </p>
                <hr className="my-5 text-gray-200" />
                <h3 className="text-[#383F45] font-semibold text-sm sm:text-base">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </section>

    </div>
  );
};

export default DashboardPropertyDetailToOwner;
