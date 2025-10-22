import React, { useState } from "react";
import { FaEnvelope, FaFileAlt, FaHistory, FaMoneyBill, FaMoneyBillWave, FaPhone, FaUser } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { BsCalendarDateFill } from "react-icons/bs";

const DashboardPropertyDetailToOwner = () => {
  const { id } = useParams();

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


{/* Interested Tenants */}
<section className="bg-white shadow rounded-2xl p-6">
  <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
    <FaUser /> Interested Tenants
  </h3>

  {interestedTenants.length > 0 ? (
    <ul className="space-y-3">
      {interestedTenants.map((tenant, idx) => (
        <li
          key={idx}
          className="flex justify-between items-center p-4 bg-gray-50 rounded-xl shadow-sm hover:bg-gray-100 transition"
        >
          <div>
            <p className="font-medium text-gray-800">{tenant.name}</p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FaEnvelope className="text-gray-400" /> {tenant.email}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FaPhone className="text-gray-400" /> {tenant.phone}
            </p>
          </div>
          <button
            onClick={() => alert(`Contact request sent to ${tenant.name}`)}
            className="bg-[#B28C3F] hover:bg-[#b27f1a] text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Contact
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No tenants have shown interest yet.</p>
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

      {/* Documents */}
      <section className="bg-white shadow rounded-2xl p-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <FaFileAlt /> Documents
        </h3>
        <ul className="space-y-2">
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
      </section>
    </div>
  );
};

export default DashboardPropertyDetailToOwner;
