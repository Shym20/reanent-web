import React from "react";

import home1 from "../../assets/images/home1.png";
import home2 from "../../assets/images/home2.png";
import home3 from "../../assets/images/home3.png";
import { FaHeart, FaShareAlt } from "react-icons/fa";

const properties = [
  {
    id: 1,
    img: home1,
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 2,
    img: home2,
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 3,
    img: home3,
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 4,
    img: home3,
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
];

const DashboardHistoryPage = () => {
  return (
    <>
      <section className="bg-white p-4 sm:p-6 md:p-8 lg:px-24 rounded-2xl">
        <div className="mb-6 sm:mb-10 mt-2 sm:mt-4">
          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-[#24292E]">
            Your History
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 max-w-7xl mx-auto">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative">
                <img
                  src={property.img}
                  alt={property.location}
                  className="w-full h-52  sm:h-64 md:h-100 object-cover"
                />
                <span className="absolute top-4 left-0 bg-[#033E4A] text-white px-3 py-1 rounded-r-md text-xs sm:text-sm font-medium">
                  {property.tag}
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-semibold">{property.price}</h3>
                  <div className="flex gap-4 text-gray-500">
                    <FaShareAlt className="cursor-pointer hover:text-[#033E4A]" />
                    <FaHeart className="cursor-pointer text-gray-500 hover:text-red-500" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#383F45] mt-2">
                  <span>{property.beds}</span>
                  <span className="text-[#D7B56D] text-lg">•</span>
                  <span>{property.baths}</span>
                  <span className="text-[#D7B56D] text-lg">•</span>
                  <span>{property.area}</span>
                </div>

                <p className="text-[#404040] font-medium text-xs sm:text-sm mt-3">
                  {property.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default DashboardHistoryPage;
