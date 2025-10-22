import React, { useState } from "react";

import testimonialImg from "../../assets/icons/testimonial-icon.png";

const tenantRatingStats = [
  { label: "Timely Rent Payments", value: 85 },
  { label: "Property Maintenance", value: 75 },
  { label: "Cleanliness & Hygiene", value: 80 },
  { label: "Cooperative Behaviour", value: 90 },
  { label: "Communication & Responsiveness", value: 88 },
  { label: "Compliance with Rules", value: 70 },
];

const testimonials = [
  {
    name: "Rahul Mehta, Owner, Indore",
    image: testimonialImg,
    quote:
      "Tenant was very responsible and maintained the property well. Rent was always on time.",
  },
  {
    name: "Amit Verma, Owner, Bhopal",
    image: testimonialImg,
    quote:
      "Good communication and cooperative throughout. No damage at handover.",
  },
  {
    name: "Neha Patel, Owner, Ujjain",
    image: testimonialImg,
    quote:
      "Polite and easy to deal with tenant. Would rent again without hesitation.",
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
          className="w-3.5 h-3.5 rounded-full border transition-all duration-200"
          style={{
            backgroundColor: index < Math.round(value) ? color : "transparent",
            borderColor: color,
          }}
        />
      ))}
    </div>
  );
};


const DashboardTenantRating = () => {
  return (
    <section className="mt-10 mx-auto px-4 md:px-8 lg:px-4">
      {/* Heading */}
      <h2 className="text-xl md:text-2xl font-bold text-[#033E4A] mb-8">
        Your Ratings by Owners
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Ratings Summary */}
        <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Overall Rating</h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-bold">4.5</span>
           <RatingCircles value={4.5} />

          </div>
          <p className="text-gray-500 mb-4">Rated by multiple owners</p>

          {tenantRatingStats.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#033E4A] h-2 rounded-full"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-700 w-48">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Reviews */}
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
    </section>
  );
};

export default DashboardTenantRating;
