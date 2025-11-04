"use client";

import React, { useEffect, useState } from "react";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import TenantApi from "../../apis/tenant/tenant.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const tenantApi = new TenantApi();

const DashboardLikedPage = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  const fetchSavedProperties = async () => {
    try {
      const response = await tenantApi.getAllSavedProperty();
      if (response?.status === "success") {
        setSavedProperties(response.data);
      } else {
        toast.error(response?.data?.message || "Failed to load saved properties.");
      }
    } catch (error) {
      console.error("Error fetching saved properties:", error);
      toast.error("Something went wrong while fetching saved properties.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (propertyId) => {
    navigate(`/dashboard-tenant/property-details/${propertyId}`);
  };

  if (loading) {
    return (
      <section className="bg-white p-6 rounded-2xl text-center text-gray-500">
        Loading your saved properties...
      </section>
    );
  }

  if (!savedProperties.length) {
    return (
      <section className="bg-white p-6 rounded-2xl text-center text-gray-500">
        You haven’t saved any properties yet.
      </section>
    );
  }

  return (
    <section className="bg-white p-4 sm:p-6 md:p-8 lg:px-10 rounded-2xl">
      <div className="mb-6 sm:mb-10 mt-2 sm:mt-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#24292E]">
          Liked/Shortlisted Properties
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4 lg:gap-4 max-w-7xl mx-auto">
        {savedProperties.map((property) => (
          <div
            key={property._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
            onClick={() => handleCardClick(property.property_id)}
          >
            <div className="relative">
              <img
                src={property.images?.[0] || "/default-property.jpg"}
                alt={property.name}
                className="w-full h-64 object-cover"
              />
              <span className="absolute top-4 left-0 bg-[#033E4A] text-white px-3 py-1 rounded-r-md text-xs sm:text-sm font-medium">
                {property.status === "rent" ? "For Rent" : "Occupied"}
              </span>
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-semibold">
                  ₹{property.rent?.toLocaleString()}/month
                </h3>
                <div className="flex gap-4 text-gray-500">
                  <FaShareAlt className="cursor-pointer hover:text-[#033E4A]" />
                  <FaHeart className="cursor-pointer text-red-500" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#383F45] mt-2">
                <span>{property.rooms || 0} Rooms</span>
                <span className="text-[#D7B56D] text-lg">•</span>
                <span>{property.baths || 0} Baths</span>
                <span className="text-[#D7B56D] text-lg">•</span>
                <span>{property.sizeV2 || property.size + " sqft"}</span>
              </div>

              <p className="text-[#404040] font-medium text-xs sm:text-sm mt-3">
                {property.city}, {property.state}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardLikedPage;
