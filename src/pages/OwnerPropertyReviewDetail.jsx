import React, { useState } from 'react'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import testimonialImg from '../assets/icons/testimonial-icon.png'
import testimonialBg from '../assets/icons/testimonial-bg.png'
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const testimonials = [
  {
    name: "Riya Sharma, Tenant, Indore",
    image: testimonialImg,
    quote:
      "Reanent made finding a rental home so easy. I searched, contacted the owner, and shifted in less than a week. No broker hassle!",
  },
  {
    name: "Riya Sharma, Tenant, Indore",
    image: testimonialImg,
    quote:
      "Reanent made finding a rental home so easy. I searched, contacted the owner, and shifted in less than a week. No broker hassle!",
  },
  {
    name: "Riya Sharma, Tenant, Indore",
    image: testimonialImg,
    quote:
      "Reanent made finding a rental home so easy. I searched, contacted the owner, and shifted in less than a week. No broker hassle!",
  },
  {
    name: "Riya Sharma, Tenant, Indore",
    image: testimonialImg,
    quote:
      "Reanent made finding a rental home so easy. I searched, contacted the owner, and shifted in less than a week. No broker hassle!",
  },
  {
    name: "Riya Sharma, Tenant, Indore",
    image: testimonialImg,
    quote:
      "Reanent made finding a rental home so easy. I searched, contacted the owner, and shifted in less than a week. No broker hassle!",
  },
  {
    name: "Riya Sharma, Tenant, Indore",
    image: testimonialImg,
    quote:
      "Reanent made finding a rental home so easy. I searched, contacted the owner, and shifted in less than a week. No broker hassle!",
  },
];

const ratingStats = [
  { label: "Support", value: 80 },
  { label: "Transparency", value: 60 },
  { label: "Strictness", value: 40 },
  { label: "Politeness", value: 70 },
  { label: "Deposit", value: 50 },
];

const OwnerPropertyReviewDetail = () => {

      const [activeIndex, setActiveIndex] = useState(0);
    
      const settings = {
        centerMode: true,
        centerPadding: "0px",
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        beforeChange: (oldIndex, newIndex) => setActiveIndex(newIndex),
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              centerMode: false,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              centerMode: true,
              centerPadding: "20px",
            },
          },
        ],
      };
    
      const [activeTab, setActiveTab] = useState("Property");

  return (
     <section className="mt-10 mx-auto px-4 md:px-8 lg:px-30">
  {/* Heading */}
  <div
    style={{
      backgroundImage: `url(${testimonialBg})`,
      backgroundSize: "100px",
    }}
    className="xl:w-[40%] md:w-[60%] w-[90%] bg-center bg-no-repeat flex items-center justify-center text-center mx-auto mb-10"
  >
    <h1 className="font-bold text-[#24292E] text-2xl sm:text-3xl lg:text-4xl leading-snug">
      What our Tenant say about Property & Owners.
    </h1>
  </div>

  {/* Tabs */}
  <div className="flex justify-between mb-10  items-center ">
  <div className="flex sm:flex-row flex-col justify-center items-center gap-2 p-1 border border-[#D7B56D] shadow rounded-xl overflow-hidden w-full sm:w-fit">
   <div>
     <button
      onClick={() => setActiveTab("Property")}
      className={`w-full sm:w-auto px-6 md:px-16 py-2 rounded-lg font-medium transition-all duration-300 ${
        activeTab === "Property"
          ? "bg-[#D7B56D] text-white"
          : "bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      Property
    </button>
    <button
      onClick={() => setActiveTab("Owner")}
      className={`w-full sm:w-auto px-6 md:px-16 py-2 rounded-lg font-medium transition-all duration-300 ${
        activeTab === "Owner"
          ? "bg-[#D7B56D] text-white"
          : "bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      Owner
    </button>
   </div>
  </div>
  <Link to={"/owner-property-review"} >
  <button className="hover:underline hidden cursor-pointer hover:text-[033E4A] " >See all</button>
  </Link>
  </div>

  {/* Content */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
    {/* Ratings Summary */}
    <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Property Reviews</h3>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-3xl font-bold">4.0</span>
        <span className="flex text-yellow-500">
          <FaStar /> <FaStar /> <FaStar /> <FaStar />{" "}
          <FaStar className="text-gray-300" />
        </span>
      </div>
      <p className="text-gray-500 mb-4">35k ratings</p>

      {/* Progress Bars */}
      {ratingStats.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#D7B56D] h-2 rounded-full"
              style={{ width: `${item.value}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-700 w-24">{item.label}</span>
        </div>
      ))}
    </div>

    {/* Testimonials Slider */}
   
<div className="md:col-span-2 w-full py-0 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
  {testimonials.map((item, index) => (
    <div key={index} className="px-2">
      <div className="relative rounded-xl p-6 pt-12 bg-white shadow-md transition-all duration-300 overflow-visible">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 rounded-full absolute top-0 left-6 border-4 border-white shadow-md object-cover"
        />
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
  )
}

export default OwnerPropertyReviewDetail
