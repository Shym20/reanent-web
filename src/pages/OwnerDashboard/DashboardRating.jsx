import React, { useState } from "react";
import { Link } from "react-router-dom";

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


const DashboardRating = () => {
const [activeTab, setActiveTab] = useState("Property");
const [selectedProperty, setSelectedProperty] = useState(propertyList[0].id);

const handlePropertyChange = (e) => setSelectedProperty(e.target.value);

return ( <section className="mt-10 mx-auto px-4 md:px-8 lg:px-4">
{/* Tabs Header */} <div className="flex justify-between mb-10 items-center"> <div className="flex sm:flex-row flex-col justify-center items-center gap-2 p-1 border border-[#D7B56D] shadow rounded-xl overflow-hidden w-full sm:w-fit"> <div>
<button
onClick={() => setActiveTab("Property")}
className={`w-full sm:w-auto px-6 md:px-16 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "Property"
                  ? "bg-[#D7B56D] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
>
Property Review </button>
<button
onClick={() => setActiveTab("Owner")}
className={`w-full sm:w-auto px-6 md:px-16 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "Owner"
                  ? "bg-[#D7B56D] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
>
Tenant Review </button> </div> </div>


    <Link to={"/owner-property-review"}>
      <button className="hover:underline hidden cursor-pointer hover:text-[#033E4A]">
        See all
      </button>
    </Link>
  </div>

  {/* Dropdown visible only for Property Review */}
  {activeTab === "Property" && (
    <div className="flex justify-end mb-6">
      <select
        value={selectedProperty}
        onChange={handlePropertyChange}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#D7B56D]"
      >
        {propertyList.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title}
          </option>
        ))}
      </select>
    </div>
  )}

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


);
};

export default DashboardRating;
