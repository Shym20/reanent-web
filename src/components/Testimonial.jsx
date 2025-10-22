import React, { useState } from 'react'
import testimonialImg from '../assets/icons/testimonial-icon.png'
import testimonialBg from '../assets/icons/testimonial-bg.png'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const settings = {
    centerMode: true,
    centerPadding: "0px",
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
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

  return (
    <section className="mt-6">
      <div
        style={{
          backgroundImage: `url(${testimonialBg})`,
          backgroundSize: "100px",
        }}
        className="xl:w-[30%] md:w-[40%] h-30 bg-center w-[80%] bg-no-repeat
           flex items-center justify-center text-center mx-auto mt-6"
      >
        <h1 className="font-[700] text-[#24292E] text-[30px]">
          What our client say about us.
        </h1>
      </div>

      <div className="w-full py-16 mb-8 relative">
        <Slider {...settings}>
          {testimonials.map((item, index) => {
            // mark current and next as active
            const isActive =
              index === activeIndex ||
              index === (activeIndex - 1) % testimonials.length;

            return (
              <div key={index} className="px-2 mb-6">
                <div
                  className={`relative rounded-xl p-6 pt-16 bg-white shadow-md transition-all duration-300 ${
                    isActive
                      ? "scale-100 opacity-100 shadow-lg"
                      : "scale-95 opacity-60"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-18 rounded-full z-100 absolute top-0 left-[30px] transform border-4 border-white shadow"
                  />
                  <p className="text-[#383F45] text-[14px] my-6">{item.quote}</p>
                  <hr className='my-5 text-gray-200' />
                  <h3 className="text-[#383F45] font-[700] text-[14px]">
                    {item.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonial;
