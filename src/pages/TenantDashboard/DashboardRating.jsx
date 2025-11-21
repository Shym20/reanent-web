import React, { useState } from "react";
import testimonialImg from "../../assets/icons/testimonial-icon.png";

const ownerTestimonials = [
  {
    name: "Mr. Sharma, Owner, Indore",
    image: testimonialImg,
    quote:
      "Very cooperative owner. Quick to address maintenance issues and easy to communicate with.",
  },
  {
    name: "Mrs. Kapoor, Owner, Bhopal",
    image: testimonialImg,
    quote:
      "Property was well maintained and she was quite transparent during the agreement process.",
  },
  {
    name: "Mr. Jain, Owner, Ujjain",
    image: testimonialImg,
    quote:
      "Helpful and polite owner. Returned deposit without any delay after move-out.",
  },
];

const propertyTestimonials = [
  {
    name: "Green Residency, Indore",
    image: testimonialImg,
    quote:
      "Spacious and well-maintained property. The society is peaceful and secure.",
  },
  {
    name: "Sunshine Apartments, Bhopal",
    image: testimonialImg,
    quote:
      "Good location, but minor water issues during summer. Overall nice experience.",
  },
  {
    name: "Lotus Villa, Ujjain",
    image: testimonialImg,
    quote:
      "Beautiful interiors, cooperative security staff, and great neighborhood.",
  },
];

const DashboardTenantGivenRatings = () => {
  const [activeTab, setActiveTab] = useState("owner");

  const getCurrentTestimonials = () =>
    activeTab === "owner" ? ownerTestimonials : propertyTestimonials;

  return (
    <section className="mt-10 mx-auto px-4 md:px-8 lg:px-4">
      <h2 className="text-xl md:text-2xl pt-6 md:pt-0 font-bold text-[#033E4A] mb-5">
        Ratings You Gave
      </h2>

      {/* Tabs */}
      <div className="w-full flex md:justify-start justify-center mb-7">
        <div className="flex flex-row sm:flex-row w-full sm:w-fit gap-2 p-1 border border-[#033E4A] shadow rounded-xl">
          <button
            onClick={() => setActiveTab("property")}
            className={`flex-1 sm:flex-none px-4 py-2 sm:px-10 md:px-16 rounded-lg font-medium transition-all duration-300
              ${activeTab === "property"
                ? "bg-[#033E4A] text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"}
            `}
          >
            Property Review
          </button>

          <button
            onClick={() => setActiveTab("owner")}
            className={`flex-1 sm:flex-none px-4 py-2 sm:px-10 md:px-16 rounded-lg font-medium transition-all duration-300
              ${activeTab === "owner"
                ? "bg-[#033E4A] text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"}
            `}
          >
            Owner Review
          </button>
        </div>
      </div>

      {/* Ratings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {getCurrentTestimonials().map((item, index) => (
          <div key={index} className="w-full">
            <div className="rounded-xl p-4 sm:p-6 bg-white shadow-md transition-all duration-300">
              <p className="text-[#383F45] text-sm sm:text-base mt-2 mb-4 leading-relaxed">
                {item.quote}
              </p>

              <hr className="my-4 text-gray-200" />

              <h3 className="text-[#383F45] font-semibold text-sm sm:text-base">
                {item.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardTenantGivenRatings;
