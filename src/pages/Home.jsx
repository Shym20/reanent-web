import React, { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import { FaHeart, FaSearch, FaShareAlt, FaUserCheck } from "react-icons/fa";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import heroBg from '../assets/images/hero-bg.png'
import home1 from '../assets/images/home1.png'
import home2 from '../assets/images/home2.png'
import home3 from '../assets/images/home3.png'
import BetterIcon2 from '../assets/icons/docIcon.svg'
import BetterIcon3 from '../assets/icons/chatIcon.svg'
import BetterIcon4 from '../assets/icons/rentIcon.svg'
import BetterIcon5 from '../assets/icons/ratingIcon.svg'
import BetterIcon6 from '../assets/icons/interactionIcon.svg'
import homeLeft from '../assets/images/home-left-img.jpg'
import bgHome from '../assets/images/bg-1.png'
import iconHome1 from '../assets/icons/homeIcon1.png'
import iconHome2 from '../assets/icons/homeIcon2.png'
import iconHome3 from '../assets/icons/homeIcon3.png'
import section2Img from '../assets/images/section-2-img.png'
import phoneImg from '../assets/images/mobile-img.png'

import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Testimonial from '../components/Testimonial';


const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="absolute -bottom-12 cursor-pointer left-1/2 translate-x-6 z-10"
      onClick={onClick}
    >
      <FaChevronRight className="text-primary-500 text-2xl" />
    </button>
  );
};

const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="absolute -bottom-12 cursor-pointer left-1/2 -translate-x-10 z-10"
      onClick={onClick}
    >
      <FaChevronLeft className="text-primary-500 text-2xl" />
    </button>
  );
};

const properties = [
  {
    id: 1,
    img: [home1, home2, home3],
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 2,
    img: [home1, home2, home3],
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 3,
    img: [home1, home2, home3],
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
];

const features = [
  {
    icon: BetterIcon2,
    title: "Verified Users Only",
    description: "Connect with verified tenants and owners for secure interactions.",

  },
  {
    icon: BetterIcon2,
    title: "Digital Docs & Checklists",
    description: "Specialized healthcare for infants, children, and teenagers."
  },
  {
    icon: BetterIcon3,
    title: "Instant Chat",
    description: "Built-in chat for quick and secure tenant-owner conversations."
  },
  {
    icon: BetterIcon4,
    title: "Rent & Utility Tracker",
    description: "Manage rent payments and utility bills in one smart dashboard."
  },
  {
    icon: BetterIcon5,
    title: "Ratings That Build Trust",
    description: "Review and rate your experience to help future users."
  },
  {
    icon: BetterIcon6,
    title: "No Middlemen, No Hassle",
    description: "Direct interactions – no brokers or hidden fees."
  }
];

const points = [
  { title: "Smart Search", description: "Browse verified homes with powerful filters" },
  { title: "Show Interest", description: "Reach out to owners in just one click" },
  { title: "Instant Chat", description: "No calls needed, chat directly in-app" },
  { title: "Track Payments", description: "View rent history & due reminders" },
  { title: "Your Docs, Safe", description: "Access lease & utility records anytime" }
];

const PropertyCard = ({ property }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [hovering, setHovering] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (hovering && property.img.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImage((prev) =>
          prev === property.img.length - 1 ? 0 : prev + 1
        );
      }, 800);
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => clearInterval(intervalRef.current);
  }, [hovering, property.img.length]);

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-102 transition-all duration-300 ease-in-out "
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative">
        <img
          src={property.img[currentImage]}
          alt={property.location}
          className="w-full h-100 object-cover transition-opacity duration-700"
        />
        <span className="absolute top-8 left-0 bg-[#033E4A] text-white px-3 py-1 rounded-r-md text-sm font-medium">
          {property.tag}
        </span>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center ">
          <h3 className="text-lg font-semibold">{property.price}</h3>
          <div className="flex gap-4 text-gray-500">
            <FaShareAlt className="cursor-pointer hover:text-[#033E4A]" />
            <FaHeart className="cursor-pointer hover:text-red-500" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-[14px] text-[#383F45] mt-2">
          <span>{property.beds}</span>
          <span className="text-[#D7B56D] text-lg">•</span>
          <span>{property.baths}</span>
          <span className="text-[#D7B56D] text-lg">•</span>
          <span>{property.area}</span>
        </div>
        <p className="text-[#404040] font-[500] text-[14px] mt-3">
          {property.location}
        </p>
      </div>
    </div>
  );
};



const Home = () => {

  const [activeIndex, setActiveIndex] = useState(2); // center

  const settings = {
    centerMode: true,
    centerPadding: "0px",
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => setActiveIndex(newIndex),
    initialSlide: 0,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // Tablet / Small desktop
        settings: {
          slidesToShow: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 768, // Mobile
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "20px", // small gap on sides
        },
      },
    ],
  };

  const [searchData, setSearchData] = useState({
    location: "",
    type: "",
    status: "",
    rent_min: "",
    rent_max: ""
  });

  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams(searchData).toString();
    navigate(`/properties-list?${params}`);
  };

  const isSearchDisabled = !(
    searchData.location ||
    searchData.type ||
    searchData.status ||
    searchData.rent_min ||
    searchData.rent_max
  );



  return (
    <>

      {/*Hero Section*/}
      <section
        className="relative bg-cover bg-center text-white"
        style={{
          backgroundImage:
            `url(${heroBg})`,
        }}
      >

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-[600] leading-tight">
            Connecting Homes with Trust
          </h1>
          <p className="mt-4 max-w-2xl font-[600] text-lg text-gray-200">
            Reanent is the first platform that turns rental history into a social network. We connect tenants and owners through the property they share — not just for rent payments, but for a record of trust: shared bills, past reviews, and honest ratings. With Reanent, your rental past becomes your rental proof.
          </p>

          {/* Search Bar */}
          <div className='flex flex-col gap-0'>
            <div className="mt-8 bg-white p-4 rounded-t-xl border-b-1 border-gray-200 flex flex-wrap items-center gap-8 shadow-lg max-w-max">
              <select
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                className="bg-transparent outline-none text-gray-700 border-none focus:ring-0"
              >
                <option value="">Location</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Goa">Goa</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Pune">Pune</option>
              </select>

              <select
                value={searchData.type}
                onChange={(e) => setSearchData({ ...searchData, type: e.target.value })}
                className="bg-transparent outline-none text-gray-700 border-none focus:ring-0"
              >
                <option value="">Property Type</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
              </select>

              <select
                value={searchData.status}
                onChange={(e) => setSearchData({ ...searchData, status: e.target.value })}
                className="bg-transparent outline-none text-gray-700 border-none focus:ring-0"
              >
                <option value="">Status</option>
                <option value="rent">For Rent</option>
              </select>

              <select
                value={`${searchData.rent_min}-${searchData.rent_max}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split("-");
                  setSearchData({
                    ...searchData,
                    rent_min: min || "",
                    rent_max: max || ""
                  });
                }}
                className="bg-transparent outline-none text-gray-700 border-none focus:ring-0"
              >
                <option value="-">Rent Range</option>
                <option value="-5000">Below 5,000</option>
                <option value="5000-10000">5,000 - 10,000</option>
                <option value="10000-20000">10,000 - 20,000</option>
                <option value="20000-">Above 20,000</option>
              </select>

            </div>
            <div className="bg-white p-4 rounded-b-xl sm:rounded-tr-xl flex flex-wrap items-center gap-4 shadow-lg max-w-3xl">
              <input
                type="text"
                placeholder="Search"
                className="flex-1 border-none focus:ring-0 outline-none text-gray-700"
              />
              <button onClick={handleSearch} disabled={isSearchDisabled}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out 
    ${isSearchDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#033E4A] text-white hover:bg-[#002f38] hover:scale-105 hover:shadow-lg"
                  }`}>
                Search Property <FaSearch />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-6 sm:items-start items-center sm:justify-start justify-center sm:gap-10">
            <div>
              <p className="text-2xl sm:text-3xl font-bold">500+</p>
              <p className="text-gray-200">Happy Users</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold">1,223+</p>
              <p className="text-gray-200">Properties Listed</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold">10+</p>
              <p className="text-gray-200">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is Reanent section*/}
      <section className="px-4 py-12">
        <div className="text-center mt-8 mb-12">

          {/* Title */}
          <h2 className="text-3xl font-bold text-[#24292E]">
            What is Reanent & How It Works
          </h2>

          {/* Subtitle */}
          <p className="text-[#383F45] max-w-5xl mx-auto mt-2 text-lg">
            Reanent is a smart rental property platform that connects tenants and owners directly — making renting faster, safer, and hassle-free. From finding your dream home to managing payments, everything happens in one simple, secure space.
          </p>
        </div>
        <div className='mt-20 mx-auto max-w-7xl'>
          <img src={section2Img} alt="" />
        </div>
      </section>

      {/* 3 Property Cards Section*/}
      <section className="px-4 py-12">
        <div className="text-center my-12">
          {/* Gold line above */}
          <div className="w-46 h-1.25 bg-[#D7B56D] mx-auto mb-4 rounded-full"></div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-[#24292E]">
            Featured Homes for You
          </h2>

          {/* Subtitle */}
          <p className="text-[#383F45] max-w-xl mx-auto mt-2 text-lg">
            Browse the latest rental listings and discover homes that fit your
            lifestyle. Click to view details and connect directly with the property
            owner.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={'/properties-list'}>
            <button className="relative group flex items-center cursor-pointer gap-2 text-[#033E4A] font-medium 
                   hover:scale-105 transition-all duration-300 ease-in-out">
              View all Property
              <span className="text-lg">
                <IoIosArrowDroprightCircle className="mt-1" />
              </span>

              {/* underline */}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#033E4A] 
                   transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </button>
          </Link>
        </div>
      </section>

      {/* 4 cards grid section*/}
      {/* <div className="max-w-7xl mx-auto p-3 grid grid-cols-3 grid-rows-2 gap-6">
      <div className="bg-[#F4F5F5] rounded-2xl p-6 flex flex-row justify-between col-span-2 row-span-1">
        <div className='flex flex-col justify-end '>
          <h2 className="text-[30px] font-semibold bg-gradient-to-b from-[#033E4A] to-[#07788E] bg-clip-text text-transparent">4 Steps to Your New Home</h2>
        <p className="text-[#262626] text-[18px] font-[500] w-[500px] ">
          Sign up, find your space, connect instantly, and move in — all made easy with Reanent.
        </p>
        </div>
        <div className="flex justify-center mt-6">
          <img src={phoneImg} alt="Phone" className="w-32 md:w-40" />
        </div>
      </div>

     
      <div className="bg-[#F4F5F5] rounded-2xl p-6 flex flex-col justify-between row-span-2">
        <h2 className="text-xl font-semibold text-teal-800">4 Steps to Your New Home</h2>
        <p className="text-gray-600">
          Sign up, find your space, connect instantly, and move in — all made easy with Reanent.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <img src={phoneImg} alt="Phone" className="w-32 md:w-36" />
          <img src={phoneImg} alt="Phone" className="w-32 md:w-36" />
        </div>
      </div>

    
      <div className="bg-[#F4F5F5] rounded-2xl p-6 flex flex-col justify-between">
        <h2 className="text-xl font-semibold text-teal-800">4 Steps to Your New Home</h2>
        <p className="text-gray-600">
          Sign up, find your space, connect instantly, and move in — all made easy with Reanent.
        </p>
      </div>

      <div className="bg-[#F4F5F5] rounded-2xl p-6 flex flex-col justify-between">
        <h2 className="text-xl font-semibold text-teal-800">4 Steps to Your New Home</h2>
        <p className="text-gray-600">
          Sign up, find your space, connect instantly, and move in — all made easy with Reanent.
        </p>
      </div>
    </div> */}

      {/* Client Testimonial Section  */}
      <Testimonial />

      {/* left-img & right-text Section  */}
      <div style={{ backgroundImage: `url(${bgHome})` }} className="bg-contain bg-bottom pb-6 bg-no-repeat">
        <section className='max-w-7xl mx-auto py-16 px-4 mt-6 flex flex-col md:flex-row items-center gap-8'>

          {/* Left Side - Image */}
          <div className="md:w-1/2">
            <img
              src={homeLeft}
              alt="Descriptive Alt"
              className="w-[450px] rounded-3xl"
            />
          </div>

          {/* Right Side - Text */}
          <div className="md:w-1/2">
            <hr className='w-50 text-[#D7B56D] border-2 ' />
            <h2 className="text-[32px] md:text-3xl  font-[600] text-[#24292E] my-4">
              List Your Property with Reanent
            </h2>
            <p className="text-[#383F45] text-[16px] md:text-lg">
              Join our platform to reach verified tenants, showcase your rentals, and manage your property with ease.
              Reanent is built to simplify renting for both owners and tenants.
            </p>
            <div className='flex items-center mt-8 md:w-[60%] gap-4'>
              <img src={iconHome1} className='w-14' alt="" />
              <p> <span className='font-semibold'>Expand Your Reach:</span> Connect with verified tenants actively searching for rental homes.</p>
            </div>
            <div className='flex items-center mt-8 md:w-[60%] gap-4'>
              <img src={iconHome2} className='w-14' alt="" />
              <p> <span className='font-semibold'>Showcase Your Rentals:</span> Highlight your property with detailed listings, photos, and availability status.</p>
            </div>
            <div className='flex items-center mt-8 md:w-[60%] gap-4'>
              <img src={iconHome3} className='w-14' alt="" />
              <p> <span className='font-semibold'>Smart & Supportive Tools:</span> Easily manage listings, track interest, and streamline communication — all in one platform.</p>
            </div>
            <button className='mt-14 bg-[#033E4A] text-white text-lg font-[600] py-2.5 px-4 hover:scale-105 hover:shadow-lg 
                   transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#195460] rounded-4xl '>List Your Property Today</button>
          </div>
        </section>
      </div>

    </>
  )
}

export default Home
