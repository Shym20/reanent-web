import { Search } from "lucide-react";
import React, { useState, useEffect, useRef, } from "react";
import { IoHome, IoSearch } from "react-icons/io5";
import { BsFillPeopleFill } from "react-icons/bs";
import { MapPinIcon, MagnifyingGlassIcon, FunnelIcon, XMarkIcon, HomeIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { FaHeart, FaLandmark, FaShareAlt, FaStar } from 'react-icons/fa';
import { Range } from "react-range";
import { FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";


import home1 from '../../assets/images/home1.png'
import home2 from '../../assets/images/home2.png'
import home3 from '../../assets/images/home3.png'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropertyApi from "../../apis/property/property.api";

const propertyApi = new PropertyApi();


const peopleData = [
  {
    id: 1,
    name: "Riya Sharma",
    role: "Tenant",
    location: "Indore",
    avatar: "https://i.pravatar.cc/150?img=5",
    isTenant: true,
    property: "Green Villa Apartments",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Amit Verma",
    role: "Owner",
    location: "Bhopal",
    avatar: "https://i.pravatar.cc/150?img=12",
    isTenant: false,
    property: null,
    rating: 3.8,
  },
  {
    id: 3,
    name: "Sneha Kapoor",
    role: "Tenant",
    location: "Delhi",
    avatar: "https://i.pravatar.cc/150?img=18",
    isTenant: true,
    property: "Skyline Residency",
    rating: 4.2,
  },
  {
    id: 4,
    name: "Rahul Singh",
    role: "Tenant",
    location: "Mumbai",
    avatar: "https://i.pravatar.cc/150?img=25",
    isTenant: false,
    property: null,
    rating: 4.0,
  },
  {
    id: 5,
    name: "Rahul Singh",
    role: "Tenant",
    location: "Mumbai",
    avatar: "https://i.pravatar.cc/150?img=25",
    isTenant: false,
    property: null,
    rating: 4.0,
  },
  {
    id: 6,
    name: "Rahul Singh",
    role: "Tenant",
    location: "Mumbai",
    avatar: "https://i.pravatar.cc/150?img=25",
    isTenant: false,
    property: null,
    rating: 4.0,
  },
];


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
    img: [home2, home1, home3],
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 3,
    img: [home3, home2, home1],
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 4,
    img: [home1, home2, home3],
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 5,
    img: [home2, home1, home3],
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 6,
    img: [home3, home2, home3],
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 7,
    img: [home3, home2, home3],
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 8,
    img: [home2, home2, home3],
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 9,
    img: [home1, home2, home3],
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
];

const propertiesWithMap = [
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
    img: home1,
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 5,
    img: home2,
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 6,
    img: home3,
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 7,
    img: home3,
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 8,
    img: home2,
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
  {
    id: 9,
    img: home1,
    price: "₹15,000/month",
    beds: "2 BHK",
    baths: "1 bath",
    area: "850 sq.ft (1,200 sq.ft plot)",
    location: "Vijay Nagar, Indore, Madhya Pradesh – 452010",
    tag: "For Rent",
  },
];


const PropertyCard = ({ property }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [hovering, setHovering] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const { reanent_user_info, reanent_auth_token } = useSelector(
    (state) => state.user
  );

  const isLoggedIn = reanent_user_info && reanent_auth_token;

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

  const handleClick = () => {
    if (isLoggedIn) {
      navigate(`/dashboard-tenant/property-details/${property.id}`);
    } else {
      toast.warn("Please login to view property details.");
      navigate("/login");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-102 transition-all duration-300 ease-in-out "
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative">
        <img
          src={property.img[currentImage]}
          alt={property.location}
          className="w-full h-70 object-cover transition-opacity duration-700"
        />
        <span className="absolute top-8 left-0 bg-[#033E4A] text-white px-3 py-1 rounded-r-md text-sm font-medium">
          {property.tag === "occupied" ? "Occupied" : "For Rent"}
        </span>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center ">
          <h3 className="text-lg font-semibold">{property.price}/month</h3>
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

const DashboardSearchPage = () => {
  const [activeTab, setActiveTab] = useState("Property");
  const [selected, setSelected] = useState("list");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  const [selectedHouseType, setSelectedHouseType] = useState("House");

  const optionss = [
    { id: "House", label: "House", icon: <HomeIcon className="w-6 h-6" /> },
    { id: "Multi Family", label: "Multi Family", icon: <BuildingOffice2Icon className="w-6 h-6" /> },
    { id: "Apartment", label: "Apartment", icon: <BuildingOffice2Icon className="w-6 h-6" /> },
  ];

  const STEP = 500;
  const MIN = 5000;
  const MAX = 15000;

  const [values, setValues] = useState([5000, 15000]);

  const histogramData = [
    2, 5, 8, 3, 1, 4, 6, 10, 15, 20, 18, 12, 8, 6, 3, 2, 5, 9, 7, 4, 6, 8, 11,
  ];

  const [selectedBed, setSelectedBed] = useState("Any");
  const [selectedBath, setSelectedBath] = useState("Any");

  const bedOptions = ["Any", "Studio", "1", "2", "3", "4", "5+"];
  const bathOptions = ["Any", "1", "1.5", "2", "2.5", "3", "3.5"];

  const ButtonGroup = ({ options, selected, setSelected }) => (
    <div className="flex border-2 border-[#E5E7EA] rounded-lg overflow-hidden">
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => setSelected(option)}
          className={`flex-1 px-8 py-2 text-sm border-r border-[#E5E7EA] last:border-r-0 
              ${selected === option
              ? "bg-black text-[#D7B56D] font-semibold"
              : "bg-white text-gray-700 hover:bg-gray-100"}`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  const [details, setDetails] = useState({
    sqftMin: "",
    sqftMax: "",
    lotMin: "",
    lotMax: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const [search, setSearch] = useState("");

  const filteredPeople = peopleData.filter(
    (person) =>
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.role.toLowerCase().includes(search.toLowerCase()) ||
      person.location.toLowerCase().includes(search.toLowerCase())
  );

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);   
  const [limit, setLimit] = useState(9); 

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await propertyApi.searchProperties({ page, limit });
         console.log(res);
        if (res?.status === "success") {
          // normalize API response to match your PropertyCard structure
          const formatted = res.data.map((prop) => ({
            id: prop.property_id,
            location: prop.location,
            price: `₹${prop.rent.toLocaleString()}`,
            img: prop.images || [],
            tag: prop.status,
            beds: prop.beds || "N/A",
            baths: prop.baths || "N/A",
            area: prop.area || "N/A",
            
          }));
          setProperties(formatted);
        }
      } catch (err) {
        console.error("Error fetching properties", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page, limit]); // re-run when page or limit changes

  
  return (
    <>
      <section className="bg-white p-4 sm:p-6 md:p-8 lg:px-14 rounded-2xl">
        {/* <div className="mb-6 sm:mb-8 mt-2 sm:mt-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#24292E]">
            Search Anything...
          </h2>
        </div> */}

        {/* Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 p-1 mt-6 border border-[#033E4A33] shadow-md mb-6 rounded-xl w-full sm:w-fit bg-white">
          {/* Property Tab */}
          <button
            onClick={() => setActiveTab("Property")}
            className={`flex items-center justify-center px-4 sm:px-6 py-2 rounded-xl transition-all duration-300 
      ${activeTab === "Property"
                ? "bg-[#033E4A] text-white shadow-md scale-105"
                : "bg-transparent text-gray-700 hover:bg-[#033E4A]/10"
              }`}
          >
            <IoHome className="text-xl" />
          </button>

          {/* People Tab */}
          <button
            onClick={() => setActiveTab("People")}
            className={`flex items-center justify-center px-4 sm:px-6 py-2 rounded-xl transition-all duration-300 
      ${activeTab === "People"
                ? "bg-[#033E4A] text-white shadow-md scale-105"
                : "bg-transparent text-gray-700 hover:bg-[#033E4A]/10"
              }`}
          >
            <BsFillPeopleFill className="text-xl" />
          </button>
        </div>

        {activeTab === "Property" &&
          <>
            <div className="flex flex-col gap-4 sm:flex-row mx-auto my-5 items-center max-w-7xl justify-between p-4">

              {/* Left Section - Location & Results */}
              {/* <div className="flex items-center w-80 justify-center space-x-2">
                    <MapPinIcon className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-800 font-medium">Vijay nagar, indore</span>
                    <span className="text-[#24292E] font-[600] ml-6 text-sm">1,341 Results</span>
                </div> */}

              {/* Middle Section - Search Bar */}
              <div className="flex items-center border-1 border-[#bbc4d2] rounded-full px-3 py-1 w-80 sm:w-100">
                <MagnifyingGlassIcon className="h-5 w-5 text-[#383F45]" />
                <input
                  type="text"
                  placeholder="Address, Neighborhood, city"
                  className="ml-2 py-1 w-full border-none focus:outline-none text-gray-700"
                />
              </div>

              {/* Right Section - Buttons */}
              <div className="flex justify-center items-center  space-x-2">
                {/* Filter Button */}
                <button onClick={() => setIsFilterOpen(true)} className="p-2 border-2 border-[#E5E7EA] rounded-md hover:bg-gray-100">
                  <FunnelIcon className="h-5 w-5 text-gray-600" />
                </button>

                {/* With Map Button */}
                <div className="inline-flex rounded-lg border-2 border-[#E5E7EA] overflow-hidden">
                  <button
                    onClick={() => setSelected("withMap")}
                    className={`px-5 py-1.5 m-0.5 text-sm font-medium ${selected === "withMap"
                      ? "bg-[#F6F7F9] text-black border-2 rounded-lg border-[#24292E]"
                      : "bg-white text-gray-600"
                      }`}
                  >
                    With Map
                  </button>

                  <button
                    onClick={() => setSelected("list")}
                    className={`px-5 py-1.5 m-0.5 text-sm font-medium ${selected === "list"
                      ? "bg-[#F6F7F9] text-black border-2 rounded-lg border-[#24292E] "
                      : "bg-white text-gray-600"
                      }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {isFilterOpen && (
              <div className="fixed inset-0 z-50  flex items-center justify-center bg-black/50">
                <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-6 relative overflow-y-scroll max-h-[90vh] no-scrollbar">
                  {/* Close Button */}
                  <button
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-600" />
                  </button>

                  {/* Filter Content */}
                  <h2 className="text-xl font-semibold mb-4">Filters</h2>

                  <div className="space-y-6">
                    {/* Price Range */}
                    <div className="w-full max-w-2xl mx-2">
                      <h2 className="text-lg font-semibold mb-4">Price range</h2>

                      {/* Slider */}
                      <Range
                        values={values}
                        step={STEP}
                        min={MIN}
                        max={MAX}
                        onChange={(vals) => setValues(vals)}
                        renderTrack={({ props, children }) => (
                          <div
                            {...props}
                            className="h-1 bg-gray-200 rounded-full relative"
                            style={props.style}
                          >
                            <div
                              className="absolute h-1 bg-[#D7B56D] rounded-full"
                              style={{
                                left: `${((values[0] - MIN) / (MAX - MIN)) * 100}%`,
                                width: `${((values[1] - values[0]) / (MAX - MIN)) * 100}%`,
                              }}
                            />
                            {children}
                          </div>
                        )}
                        renderThumb={({ props }) => (
                          <div
                            {...props}
                            className="h-6 w-6 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center"
                          />
                        )}
                      />

                      {/* Min / Max values */}
                      <div className="flex justify-between mt-4">
                        <div className="border border-[#E5E7EA] rounded-lg p-3 w-32 text-center">
                          <p className="text-xs text-gray-500">Minimum</p>
                          <p className="font-semibold">₹{values[0].toLocaleString()}</p>
                        </div>
                        <div className="border border-[#E5E7EA] rounded-lg p-3 w-32 text-center">
                          <p className="text-xs text-gray-500">Maximum</p>
                          <p className="font-semibold">₹{values[1].toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Rooms and Baths */}
                    <div className="space-y-4 mx-2">
                      {/* Beds */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Rooms and Baths</h3>
                        <div className="flex items-center gap-4 mb-3">
                          <span className="w-16 font-medium text-[#24292E] ">Bed</span>
                          <ButtonGroup
                            options={bedOptions}
                            selected={selectedBed}
                            setSelected={setSelectedBed}
                          />
                        </div>

                        {/* Baths */}
                        <div className="flex items-center gap-4">
                          <span className="w-16 font-medium text-[#24292E] ">Bath</span>
                          <ButtonGroup
                            options={bathOptions}
                            selected={selectedBath}
                            setSelected={setSelectedBath}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Home Type */}
                    <div className='mx-2'>
                      <h3 className="text-lg font-semibold  mb-4">Home Type</h3>
                      <div className="flex gap-3">
                        {optionss.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setSelectedHouseType(opt.id)}
                            className={`flex flex-col items-center justify-center w-32 h-24 border-2 rounded-lg transition 
              ${selectedHouseType === opt.id ? "border-black shadow-md" : "border-gray-300 hover:border-gray-500"}`}
                          >
                            {opt.icon}
                            <span className="mt-2 text-sm font-medium text-gray-700">
                              {opt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6 mx-2 mt-8">
                      <h3 className="text-lg font-semibold">Property Details</h3>

                      {/* Square Feet */}
                      <div>
                        <h4 className="font-medium text-[#24292E] mb-2">Square feet</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Minimum</label>
                            <input
                              type="number"
                              name="sqftMin"
                              value={details.sqftMin}
                              onChange={handleChange}
                              placeholder="e.g. 1000"
                              className="w-full border-2 border-[#E5E7EA] rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Maximum</label>
                            <input
                              type="number"
                              name="sqftMax"
                              value={details.sqftMax}
                              onChange={handleChange}
                              placeholder="e.g. 5000"
                              className="w-full border-2 border-[#E5E7EA] rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Lot Size */}
                      <div>
                        <h4 className="font-medium text-[#24292E] mb-2">Lot Size</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Minimum</label>
                            <input
                              type="number"
                              name="lotMin"
                              value={details.lotMin}
                              onChange={handleChange}
                              placeholder="e.g. 2000"
                              className="w-full border-2 border-[#E5E7EA] rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Maximum</label>
                            <input
                              type="number"
                              name="lotMax"
                              value={details.lotMax}
                              onChange={handleChange}
                              placeholder="e.g. 10000"
                              className="w-full border-2 border-[#E5E7EA] rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="bg-[#033E4A] text-white px-6 py-2 rounded-lg hover:bg-[#022f38] hover:scale-105 transition-all duration-300 ease-in-out "
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <section className="px-4 py-5">
              {(selected === "list") ? (
                // ✅ List View (your existing grid)
               <>
               {loading ? (
    <p className="text-center text-gray-500">Loading properties...</p>
  ) : properties.length > 0 ? (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>

    <div className="flex justify-center mt-6 space-x-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
</>
    
  ) : (
    <p className="text-center text-gray-500">No properties found</p>
  )}
               </>

              ) : (
                (selected === "withMap") ? (
                  // ✅ With Map View
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                    {/* Left: Property Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto pr-4">
                      {propertiesWithMap.map((property) => (
                        <div
                          key={property.id}
                          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-102 transition-all duration-300 ease-in-out "
                        >
                          <div className="relative">
                            <img
                              src={property.img}
                              alt={property.location}
                              className="w-full h-56 object-cover"
                            />
                            <span className="absolute top-4 left-0 bg-[#033E4A] text-white px-3 py-1 rounded-r-md text-sm font-medium">
                              {property.tag}
                            </span>
                          </div>
                          <div className="p-4">
                            <div className='flex justify-between items-center '>
                              <h3 className="text-lg font-semibold">{property.price}</h3>
                              <div className="flex gap-4 text-gray-500">
                                <FaShareAlt className="cursor-pointer hover:text-[#033E4A]" />
                                <FaHeart className="cursor-pointer hover:text-red-500" />
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{property.beds} • {property.baths} • {property.area}</p>
                            <p className="text-gray-700 text-sm mt-2">{property.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right: Map Placeholder */}
                    <div className="w-full h-[80vh] rounded-2xl shadow-lg">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14717.09614890894!2d75.88652044994416!3d22.755209269789884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396302af403406fb%3A0x5b50834b117f8bab!2sVijay%20Nagar%2C%20Scheme%20No%2054%2C%20Indore%2C%20Madhya%20Pradesh%20452010!5e0!3m2!1sen!2sin!4v1755768503769!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        className="rounded-2xl border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />

                    </div>
                  </div>
                ) : (<></>))}
            </section>
          </>}
        {activeTab === "People" &&
          <>
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative flex items-center border-1 border-[#bbc4d2] rounded-full px-3 py-1 w-80 sm:w-100">
                <IoSearch className="absolute left-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search people by name, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ml-7 py-1 w-full border-none focus:outline-none text-gray-700"
                />
              </div>
              {/* <div className="flex items-center border-1 border-[#bbc4d2] rounded-full px-3 py-1 w-80 sm:w-100">
                    <MagnifyingGlassIcon className="h-5 w-5 text-[#383F45]" />
                    <input
                        type="text"
                        placeholder="Address, Neighborhood, city"
                        className="ml-2 py-1 w-full border-none focus:outline-none text-gray-700"
                    />
                </div> */}

              {/* People List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filteredPeople.length > 0 ? (
                    filteredPeople.map((person, idx) => (
                      <motion.div
                        key={person.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col items-center text-center hover:shadow-md hover:scale-[1.02] transition"
                      >
                        {/* Avatar */}
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#D7B56D] mb-3"
                        />

                        {/* Name + Location */}
                        <h3 className="font-semibold text-gray-800">{person.name}</h3>
                        <p className="text-sm text-gray-500">{person.location}</p>
                        {/* <p className="text-xs mt-1 text-[#033E4A] font-medium">
                  {person.role}
                </p> */}

                        {/* Tenant Status */}
                        {person.isTenant && (
                          <span className="mt-2 inline-block text-xs px-3 font-semibold py-1 bg-gray-100 text-black rounded-full">
                            Tenant @ {person.property}
                          </span>
                        )}

                        {/* Rating */}
                        <div className="flex items-center justify-center gap-1 mt-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar
                              key={i}
                              className={`${i < Math.floor(person.rating)
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                                } w-4 h-4`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            {person.rating.toFixed(1)}
                          </span>
                        </div>

                        {/* Button */}
                        <button
                          onClick={() => navigate(`/dashboard-tenant/people-details/${person.id}`)}
                          className="mt-4 px-4 py-2 text-sm rounded-lg bg-[#033E4A] text-white shadow hover:bg-[#0e5361] transition"
                        >
                          View Profile
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-500 col-span-full text-center"
                    >
                      No people found.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>}
      </section>
    </>
  );
};

export default DashboardSearchPage;
