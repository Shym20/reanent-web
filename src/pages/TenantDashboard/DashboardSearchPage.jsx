import { Mail, Phone, Search, Star } from "lucide-react";
import React, { useState, useEffect, useRef, } from "react";
import { IoHome, IoSearch } from "react-icons/io5";
import { BsFillPeopleFill } from "react-icons/bs";
import { MapPinIcon, MagnifyingGlassIcon, FunnelIcon, XMarkIcon, HomeIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { FaHeart, FaLandmark, FaShareAlt, FaStar, FaRegHeart } from 'react-icons/fa';
import { Range } from "react-range";
import { FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropertyApi from "../../apis/property/property.api";
import TenantApi from "../../apis/tenant/tenant.api";
import ProfileApi from "../../apis/profile/profile.api";
import defaultImg from "../../assets/images/profile-user.png"
import defaultPropertyImage from "../../assets/images/property-default-image.jpg"


const propertyApi = new PropertyApi();
const tenantApi = new TenantApi();
const profileApi = new ProfileApi();

const PropertyCard = ({ property }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [hovering, setHovering] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(property.isSaved || false);


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

  const handleSaveToggle = async (e) => {
    e.stopPropagation(); // prevent navigating to property details when heart is clicked

    if (!isLoggedIn) {
      toast.warn("Please login to save properties.");
      navigate("/login");
      return;
    }

    try {
      if (isSaved) {
        // Unsave Property
        await tenantApi.unsaveProperty(property.id);
        setIsSaved(false);
        toast.success("Property removed from saved list.");
      } else {
        // Save Property
        await tenantApi.saveProperty(property.id);
        setIsSaved(true);
        toast.success("Property saved successfully!");
      }
    } catch (error) {
      console.error("Error saving/unsaving property:", error);
      toast.error("Something went wrong. Please try again.");
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
          src={property.img[currentImage] || defaultPropertyImage}
          alt={property.location}
          className="w-full h-70 object-cover transition-opacity duration-700"
        />
        <span className="absolute top-8 left-0 bg-[#033E4A] text-white px-3 py-1 rounded-r-md text-sm font-medium">
          {property.tag === "occupied" ? "Occupied" : "For Rent"}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-medium">{property.name}</h3>
        <div className="flex justify-between items-center ">

          <h3 className="text-lg font-semibold">{property.price}/month</h3>
          <div className="flex gap-4 text-gray-500">
            <FaShareAlt className="cursor-pointer hover:text-[#033E4A]" />
            {isSaved ? (
              <FaHeart
                className="cursor-pointer text-red-500 hover:scale-110 transition-transform"
                onClick={handleSaveToggle}
              />
            ) : (
              <FaRegHeart
                className="cursor-pointer text-gray-500 hover:text-red-500 hover:scale-110 transition-transform"
                onClick={handleSaveToggle}
              />
            )}

          </div>
        </div>
        <div className="flex items-center gap-2 text-[14px] text-[#383F45] mt-2">
          <span>{property.beds} Bed rooms</span>
          <span className="text-[#D7B56D] text-lg">•</span>
          <span>{property.type?.charAt(0).toUpperCase() + property.type?.slice(1)}</span>
          <span className="text-[#D7B56D] text-lg">•</span>
          <span>{property.area}</span>
        </div>
        <p className="text-[#404040] font-[500] text-[14px] mt-3">
          {property.city}, {property.location}
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
  const [hasMore, setHasMore] = useState(true);
  const [searchPeople, setSearchPeople] = useState("");
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  const applyFilters = async () => {
    try {
      setLoading(true);
      setIsFilterOpen(false);

      const res = await propertyApi.searchProperties({
        rent_min: values[0],
        rent_max: values[1],
        bed_min: selectedBed !== "Any" ? selectedBed.replace("+", "") : undefined,
        bath_min: selectedBath !== "Any" ? selectedBath.replace("+", "") : undefined,
        page: 1,
        limit: limit,
      });

      if (res?.status === "success") {
        const savedIds = savedProperties.map((p) => p.property_id);

        const formatted = res.data.map((prop) => ({
          id: prop.property_id,
          city: prop.city,
          name: prop.name,
          location: prop.location,
          price: `₹${prop.rent.toLocaleString()}`,
          img: prop.images || [],
          tag: prop.status,
          beds: prop.bed_rooms || "0",
          baths: prop.baths || "0",
          type: prop.type || "N/A",
          area: prop.sizeV2 || "N/A",
          isSaved: savedIds.includes(prop.property_id),
        }));

        setProperties(formatted);
        setFilteredProperties(formatted);
        setPage(1);
        setHasMore(formatted.length === limit);
      } else {
        toast.info("No properties found for selected filters.");
        setFilteredProperties([]);
      }
    } catch (error) {
      console.error("Filter fetch error:", error);
      toast.error("Something went wrong while applying filters.");
    } finally {
      setLoading(false);
    }
  };

  const [selectedHouseType, setSelectedHouseType] = useState("House");

  const optionss = [
    { id: "House", label: "House", icon: <HomeIcon className="w-6 h-6" /> },
    { id: "Multi Family", label: "Multi Family", icon: <BuildingOffice2Icon className="w-6 h-6" /> },
    { id: "Apartment", label: "Apartment", icon: <BuildingOffice2Icon className="w-6 h-6" /> },
  ];

  const STEP = 500;
  const MIN = 500;
  const MAX = 200000;

  const [values, setValues] = useState([500, 200000]);

  const histogramData = [
    2, 5, 8, 3, 1, 4, 6, 10, 15, 20, 18, 12, 8, 6, 3, 2, 5, 9, 7, 4, 6, 8, 11,
  ];

  const [selectedBed, setSelectedBed] = useState("Any");
  const [selectedBath, setSelectedBath] = useState("Any");

  const bedOptions = ["Any", "1", "2", "3", "4", "5+"];
  const bathOptions = ["Any", "1", "2", "3", "4", "5+"];

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

  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch both APIs in parallel
        const [savedRes, propertyRes] = await Promise.all([
          tenantApi.getAllSavedProperty(),
          propertyApi.searchProperties({
            page,
            limit,
            rent_min: values[0],
            rent_max: values[1],
            beds_min: selectedBed !== "Any" ? selectedBed.replace("+", "") : undefined,
            baths_min: selectedBath !== "Any" ? selectedBath.replace("+", "") : undefined,
          }),
        ]);

        const savedData = savedRes?.status === "success" ? savedRes.data : [];
        setSavedProperties(savedData);

        if (propertyRes?.status === "success") {
          const savedIds = savedData.map((p) => p.property_id);

          const formatted = propertyRes.data.map((prop) => ({
            id: prop.property_id,
            city: prop.city,
            name: prop.name,
            location: prop.location,
            price: `₹${prop.rent.toLocaleString()}`,
            img: prop.images || [],
            tag: prop.status,
            beds: prop.bed_rooms || "0",
            baths: prop.baths || "0",
            type: prop.type || "N/A",
            area: prop.sizeV2 || "N/A",
            isSaved: savedIds.includes(prop.property_id),
          }));

          setProperties(formatted);
          setHasMore(formatted.length === limit);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [page, limit, selectedBed, selectedBath, values]);


  useEffect(() => {

    setFilteredProperties(properties);
  }, [properties]);


  const handleSearchPeople = async (query) => {
    try {
      setLoading(true);
      const res = await profileApi.searchPeople(query); // ✅ pass query param

      if (res?.status === "success") {
        const userData = res.data;
        const users = Array.isArray(userData) ? userData : [userData];

        const formatted = users.map((user) => ({
          id: user.userId,
          name: user.fullName,
          avatar: user?.profilePicture || defaultImg,
          location: "-", // can replace later if you have address
          rating: 4.5,
          isTenant: user.role?.toLowerCase() === "tenant",
          property: null,
          email: user.email,
          mobile: user.mobileNumber,
        }));

        setFilteredPeople(formatted);
        console.log("filtered people:", formatted);
      } else {
        setFilteredPeople([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setFilteredPeople([]);
    } finally {
      setLoading(false);
    }
  };

  const [searchProperty, setSearchProperty] = useState("");


  const handleSearchProperty = (query) => {
  setSearchProperty(query);

  const lower = query.toLowerCase();

  const filtered = properties.filter((p) =>
    p.city?.toLowerCase().includes(lower) ||
    p.location?.toLowerCase().includes(lower) ||
    p.state?.toLowerCase().includes(lower) ||     // if state exists
    p.type?.toLowerCase().includes(lower) ||
    p.name?.toLowerCase().includes(lower)
  );

  setFilteredProperties(filtered);
};


  useEffect(() => {
    // Only trigger search if "People" tab is active
    if (activeTab !== "People") return;

    const delayDebounce = setTimeout(() => {
      const query = search.trim() === "" ? "_" : search.trim(); // ✅ blank → all users
      handleSearchPeople(query);
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [search, activeTab]);

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
                  value={searchProperty}
                  onChange={(e) => handleSearchProperty(e.target.value)}
                />

              </div>

              {/* Right Section - Buttons */}
              <div className="flex justify-center items-center  space-x-2">
                {/* Filter Button */}
                <button onClick={() => setIsFilterOpen(true)} className="p-2 border-2 border-[#E5E7EA] rounded-md hover:bg-gray-100">
                  <FunnelIcon className="h-5 w-5 text-gray-600" />
                </button>


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
                        <h3 className="text-lg font-semibold mb-4">Min Rooms and Baths</h3>
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
                    {/* <div className='mx-2'>
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
                    </div> */}

                    {/* Apply Button */}
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedBed("Any");
                          setSelectedBath("Any");
                          setValues([MIN, MAX]);
                          setFilteredProperties(properties);
                        }}
                        className="mr-3 cursor-pointer text-gray-600 hover:text-black"
                      >
                        Reset
                      </button>
                      <button
                        onClick={applyFilters}
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
                  ) : filteredProperties.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {filteredProperties.map((property) => (
                          <PropertyCard key={property.id} property={property} />
                        ))}
                      </div>

                      <div className="flex justify-center items-center mt-8 space-x-6">
                        <button
                          disabled={page === 1}
                          onClick={() => setPage((p) => p - 1)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 
      ${page === 1
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-white hover:bg-[#033E4A] hover:text-white border-gray-300 text-gray-700 shadow-sm hover:shadow-md"
                            }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                          Previous
                        </button>

                        <span className="text-gray-500 font-medium select-none">Page {page}</span>

                        <button
                          disabled={!hasMore}
                          onClick={() => setPage((p) => p + 1)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 
      ${!hasMore
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-white hover:bg-[#033E4A] hover:text-white border-gray-300 text-gray-700 shadow-sm hover:shadow-md"
                            }`}
                        >
                          Next
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      </div>


                    </>

                  ) : (
                    <p className="text-center text-gray-500">No properties found</p>
                  )}
                </>

              ) : (<></>
              )}
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
                  placeholder="Search people by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ml-7 py-1 w-full border-none focus:outline-none text-gray-700"
                />
              </div>


              {/* People List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                  {loading ? (
                    <motion.p className="text-gray-500 col-span-full text-center">
                      Searching...
                    </motion.p>
                  ) : filteredPeople.length > 0 ? (
                    filteredPeople.map((person, idx) => (
                      <motion.div
                        key={person.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                      >
                        {/* Avatar */}
                        <div className="relative mb-3">
                          <img
                            src={person.avatar}
                            alt={person.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-[#D7B56D] shadow-sm"
                          />
                          <div className="absolute bottom-1 right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                        </div>

                        {/* Name */}
                        <h3 className="font-semibold text-lg text-gray-900">{person.name}</h3>

                        {/* Contact info */}
                        <div className="flex flex-col gap-1 mt-1 w-full">
                          {person.email && (
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                              <Mail className="w-4 h-4 text-[#033E4A]" />
                              <span className="truncate">{person.email}</span>
                            </div>
                          )}
                          {person.mobile && (
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                              <Phone className="w-4 h-4 text-[#033E4A]" />
                              <span>{person.mobile}</span>
                            </div>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center justify-center gap-1 mt-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`${i < Math.floor(person.rating) ? "text-yellow-500" : "text-gray-300"} w-4 h-4`}
                              fill={i < Math.floor(person.rating) ? "#FACC15" : "none"}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">{person.rating.toFixed(1)}</span>
                        </div>

                        {/* Button */}
                        <button
                          onClick={() => navigate(`/dashboard-tenant/people-details/${person.id}`)}
                          className="mt-5 px-5 py-2 text-sm font-medium rounded-lg bg-[#033E4A] text-white shadow hover:bg-[#0e5361] transition-all duration-200"
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
