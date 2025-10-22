import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import house1 from "../../assets/images/home1.png";
import livingroom from "../../assets/images/home1.png";
import kitchen from "../../assets/images/home2.png";
import bedroom from "../../assets/images/home3.png";
import bathroom from "../../assets/images/home2.png";
import garden from "../../assets/images/home3.png";
import testimonialImg from '../../assets/icons/testimonial-icon.png'
import testimonialBg from '../../assets/icons/testimonial-bg.png'

import { FaCar, FaStar, FaWater } from "react-icons/fa";
import { FiHome, FiHeart, FiMaximize, FiUsers, FiShare2, FiWind, FiCalendar } from "react-icons/fi";
import { MdCheckCircle } from "react-icons/md";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuSofa, LuCar } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PropertyApi from "../../apis/property/property.api";
import TenantApi from "../../apis/tenant/tenant.api";

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

const PropertyImages = ({ images }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const galleryImages = images.map((img) => ({
    original: img,
    thumbnail: img,
  }));

  const openGallery = (index) => {
    setStartIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <>
      {/* Preview Grid */}
      <div className="grid grid-cols-2 gap-2 mx-auto h-[500px]">
        {/* First big image on left */}
        <div className="relative h-[500px] cursor-pointer" onClick={() => openGallery(0)}>
          <img
            src={images[0]}
            alt="property"
            className="w-full h-[500px] object-cover rounded-lg"
          />
        </div>

        {/* Right side images */}
        <div className="grid grid-rows-2 gap-2">
          {/* Top wide image */}
          <div className="relative cursor-pointer" onClick={() => openGallery(1)}>
            <img
              src={images[1]}
              alt="property"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>

          {/* Bottom 2 small images */}
          {/* Bottom 2 small images */}
          <div className="grid grid-cols-2 gap-2">
            {images.slice(2, 4).map((img, idx) => (
              <div
                key={idx}
                className="relative cursor-pointer h-[190px] overflow-hidden rounded-lg"
                onClick={() => openGallery(idx + 2)}
              >
                <img
                  src={img}
                  alt="property"
                  className="w-full h-full object-cover"
                />

                {/* If it's the last image and more than 4 exist */}
                {idx === 1 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">
                      +{images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Fullscreen Gallery */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="w-full max-w-5xl">
            <button
              className="absolute top-4 right-6 text-white text-2xl z-50"
              onClick={() => setIsGalleryOpen(false)}
            >
              ✕
            </button>
            <ImageGallery
              items={galleryImages}
              startIndex={startIndex}
              showThumbnails={true}
              showPlayButton={false}
              showFullscreenButton={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

const Testimonial = () => {
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
    <section className="mt-10 mx-auto px-4 md:px-8 lg:px-8">
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
              className={`w-full sm:w-auto px-6 md:px-16 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === "Property"
                ? "bg-[#D7B56D] text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
            >
              Property
            </button>
            <button
              onClick={() => setActiveTab("Owner")}
              className={`w-full sm:w-auto px-6 md:px-16 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === "Owner"
                ? "bg-[#D7B56D] text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
            >
              Owner
            </button>
          </div>
        </div>
        <Link to={"/owner-property-review"} >
          <button className="hover:underline cursor-pointer hover:text-[033E4A] " >See all</button>
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
        <div className="md:col-span-2 w-full py-8 relative">
          <Slider {...settings}>
            {testimonials.map((item, index) => {
              const isActive =
                index === activeIndex ||
                index === (activeIndex - 1) % testimonials.length;

              return (
                <div key={index} className="px-2 mb-6">
                  <div
                    className={`relative rounded-xl p-6 pt-16 bg-white shadow-md transition-all duration-300 overflow-visible ${isActive ? "scale-100 opacity-100 shadow-lg" : "scale-95 opacity-70"
                      }`}
                  >
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
              );
            })}
          </Slider>
        </div>
      </div>
    </section>

  );
};

const ScheduleVisit = () => {
  const [tourType, setTourType] = useState("On-Site");
  const [selectedDate, setSelectedDate] = useState("");
  const [showDateInput, setShowDateInput] = useState(true);
  const [selectedTime, setSelectedTime] = useState("00:00");

  // Format date as dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div className="p-4 rounded-xl w-full bg-white">
      {/* Tour Type */}
      <h3 className="font-semibold text-[#24292E] text-[14px] mb-2">Select Tour Type</h3>
      <div className="flex gap-4 mb-5">
        <button
          className={`px-4 py-1 rounded-lg border ${tourType === "On-Site"
            ? "bg-[#033E4A] text-white"
            : "bg-gray-100 text-gray-700"
            }`}
          onClick={() => setTourType("On-Site")}
        >
          On-Site
        </button>
        <button
          className={`px-4 py-1 rounded-lg border ${tourType === "Video"
            ? "bg-[#033E4A] text-white"
            : "bg-gray-100 text-gray-700"
            }`}
          onClick={() => setTourType("Video")}
        >
          Video Tour
        </button>
      </div>

      {/* Select Date */}
      <h3 className="font-semibold text-[#24292E] text-[14px] mb-2">Select Date</h3>
      <div className="flex flex-row items-center gap-3 mb-6">
        {showDateInput && (
          <input
            type="date"
            className="border rounded-lg px-3 py-2"
            onChange={(e) => {
              setSelectedDate(e.target.value);
            }}
          />
        )}
        {selectedDate && (
          <span className="text-gray-800 font-medium">
            Selected Date: <span className="text-[#033E4A] font-semibold ">{formatDate(selectedDate)}</span>
          </span>
        )}
      </div>


      {/* Select Time */}
      <h3 className="font-semibold text-[#24292E] text-[14px] mb-2">Select Time</h3>
      <div className="flex items-center gap-2 mb-6">
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />

        {selectedTime && (
          <span className="text-gray-800 font-medium">
            Selected Time: <span className="text-[#033E4A] font-semibold ">{selectedTime}</span>
          </span>
        )}
      </div>

      {/* Button */}
      <button className=" bg-[#033E4A] text-white px-8 py-2 rounded-lg hover:bg-teal-800">
        Schedule Now
      </button>
    </div>
  );
};


const DashboardPropertyDetail = () => {
  const propertyImages = [
    house1,
    livingroom,
    kitchen,
    bedroom,
    bathroom,
    garden,
    garden,
  ];

  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const api = new PropertyApi();
        const res = await api.getPropertyDetail(id);

        if (res?.status === "success") {
          console.log("HEHEH reponse : ", res.data.propertyDetails);
          setProperty(res.data.propertyDetails);
        }
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!property) return <p>No property found</p>;

  const handleSendInterest = async () => {
    try {
      const tenantApi = new TenantApi();
      const res = await tenantApi.registerInterest(id);

      if (res?.status === "success") {
       toast.success("Interest sent successfully")
      } else {
        toast.error(res?.data?.message || "Error while registering interest");
      }
    } catch (err) {
      toast.error(err);
      
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl mt-2 " >
        <div className="p-4">
          <PropertyImages images={property.images || propertyImages} />
        </div>
        <section className="bg-white p-4 sm:p-6 md:p-4 lg:px-4 rounded-2xl">
          <div className="flex flex-col lg:flex-row gap-6 p-6 bg-white">
            {/* Left Section */}
            <div className="flex-1">
              <div className="flex justify-between">
                {/* Header */}
                <div className="flex items-center gap-4 text-[#262626] text-sm">
                  <button
                    onClick={handleSendInterest}
                    className="bg-[#033E4A] text-white px-4 py-2 rounded-lg text-sm font-medium 
                 hover:bg-[#022c35] transition"
                  >
                    Send Interest
                  </button>
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-medium ${property.status === "rent"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                      }`}
                  >
                    {property.status === "rent" ? "Active" : "Inactive"}
                  </span>

                  <span>Posted 13 hours ago</span>

                </div>

                {/* Save & Share */}
                <div className="flex items-center gap-4 mt-2 text-gray-600">
                  <button className="flex items-center gap-1 hover:text-red-500">
                    <FiHeart /> Save
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-500">
                    <FiShare2 /> Share
                  </button>
                </div>
              </div>

              {/* Price & Rating */}
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-[#D7B56D] ">
                  ₹{property.rent?.toLocaleString("en-IN")}/month
                </h2>

                <div className="flex items-center gap-2 mt-1 text-[#D7B56D] ">
                  <IoStar /> <IoStar /> <IoStar /> <IoStarOutline /> <IoStarOutline />
                  <span className="ml-2 text-gray-600 text-sm">4.0</span>
                </div>
              </div>

              {/* Location */}
              <div className="mt-3 flex items-center gap-2 text-[#404040] ">
                <HiOutlineLocationMarker className="text-[#D7B56D] text-lg" />
                <span className="font-[600] ">
                  {property.address}
                </span>
              </div>

              {/* Rooms Info */}
              <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-2">
                <span className="flex items-center gap-1">
                  <GoDotFill className="text-xs text-[#D7B56D] " /> 1 Living Room
                </span>
                <span className="flex items-center gap-1">
                  <GoDotFill className="text-xs text-[#D7B56D] " /> 1 Kitchen
                </span>
                <span className="flex items-center gap-1">
                  <GoDotFill className="text-xs text-[#D7B56D]" /> 2 Bedrooms
                </span>
                <span className="flex items-center gap-1">
                  <GoDotFill className="text-xs text-[#D7B56D]" /> 2 Bathrooms
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-[#24292E] text-[16px] leading-relaxed">
                A spacious 2BHK apartment with excellent ventilation, modern interiors,
                and semi-furnished fittings including wardrobes and a modular kitchen.
                The apartment is located in a prime area, close to schools, hospitals,
                markets, and public transport, making it ideal for families and working
                professionals.
              </p>

              {/* About Place */}
              <div className="mt-5">
                <h3 className="font-semibold text-gray-800 mb-3">About Place</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-gray-100 rounded-full flex items-center gap-2 text-sm">
                    <FiHome /> 2BHK Apartment
                  </span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full flex items-center gap-2 text-sm">
                    <FiMaximize /> 950 sq. ft.
                  </span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full flex items-center gap-2 text-sm">
                    <FiUsers /> Single Family
                  </span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full flex items-center gap-2 text-sm">
                    <LuSofa /> Semi-furnished
                  </span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full flex items-center gap-2 text-sm">
                    <FiWind /> A/C, Heating & Cooling
                  </span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full flex items-center gap-2 text-sm">
                    <LuCar /> 1 Car Parking
                  </span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full flex items-center gap-2 text-sm">
                    <FaWater /> 24x7 Water Supply
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Map */}
            <div className="w-full lg:w-[40%]">
              <iframe
                title="map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.456784602448!2d73.68132981539136!3d18.72650668728654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9dd2070c02b%3A0x9d6f3f2a91c43b85!2sTalegaon%20Dabhade%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1639657454845!5m2!1sen!2sin"
                className="w-full h-full rounded-lg"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 md:p-8 lg:px-4 rounded-2xl">
          <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-white rounded-2xl mx-auto">
            {/* Left Profile Card */}
            <div className="flex flex-col items-center bg-white border border-[#E5E7EA] rounded-2xl p-4 w-64">
              <img
                src="https://i.pravatar.cc/150?img=5"
                alt="Owner"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <p className="text-gray-500 text-sm">Owner</p>
              <h2 className="text-xl font-semibold">Mr. Sharma</h2>
              <div className="flex items-center mt-2 bg-[#D7B56D1F] py-1 px-2 rounded-full ">
                <span className="text-yellow-500 text-md">★</span>
                <span className="ml-1 text-gray-700 text-md font-medium">4.6</span>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1">
              {/* Buttons */}
              <div className="flex gap-3 mb-5">
                <button onClick={() => setActiveTab("chat")}
                  className={`px-4 py-2 rounded-lg font-medium ${activeTab === "chat"
                    ? "bg-[#D7B56D] text-white"
                    : "bg-gray-100 text-gray-700"
                    }`}>
                  Chat with Owner
                </button>
                <button onClick={() => setActiveTab("schedule")}
                  className={`px-4 py-2 rounded-lg font-medium ${activeTab === "schedule"
                    ? "bg-[#D7B56D] text-white"
                    : "bg-gray-100 text-gray-700"
                    }`}>
                  Schedule a Visit
                </button>
              </div>

              {/* Description */}
              <p className="text-[#24292E] text-[16px] mb-4">
                Mr. Sharma is the owner of this property and manages all details
                directly. He is known for quick responses and clear communication.
              </p>

              <hr className="mb-5 mt-6 text-gray-300 " />

              {/* Chat Box */}
              {activeTab === "chat" && <>
                <div>
                  <label className="block mb-2 font-medium text-[#24292E] ">
                    Chat with Owner
                  </label>
                  <div className="relative mb-3">
                    <textarea
                      rows="3"
                      placeholder="Write here"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full pl-3 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="bg-[#033E4A] text-white px-8 py-2 rounded-lg hover:bg-teal-800">
                    Message Owner
                  </button>
                </div>
              </>}
              {activeTab === "schedule" && <ScheduleVisit />}
            </div>
          </div>
        </section>

        <Testimonial />

      </div>
    </>
  );
};

export default DashboardPropertyDetail;
