import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { FiX, FiStar } from "react-icons/fi";
import PropertyApi from '../../apis/property/property.api'
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { Bell } from "lucide-react";

const propertyApi = new PropertyApi();

const TenantRatingModal = ({ isOpen, onClose, onRateAndRemove, tenant, property }) => {
  // 5-point scale for each parameter
  const initialRating = {
    behaviour: 3,
    billPayment: 3,
    roomCondition: 3,
    noiseNuisance: 3,
    propertyUse: 3,
    comments: "", // For additional comments
  };

  const [ratingData, setRatingData] = useState(initialRating);

  useEffect(() => {
    // Reset state when modal opens for a new tenant
    if (isOpen) {
      setRatingData(initialRating);
    }
  }, [isOpen, tenant]); // Depend on isOpen and tenant change

  if (!isOpen || !tenant || !property) return null;

  const handleRatingChange = (field, value) => {
    setRatingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ratingPayload = {
      propertyId: property.id,
      tenantId: tenant.userId, // Assuming userId is the tenant ID
      ...ratingData
    };
    onRateAndRemove(ratingPayload);
  };

  // Rating labels for user-friendly display
  const ratingLabels = [
    "Very Poor 😠",
    "Poor 🙁",
    "Average 😐",
    "Good 🙂",
    "Excellent! 😄",
  ];

  const ratingFields = [
    { key: "behaviour", label: "Tenant's Behaviour" },
    { key: "billPayment", label: "Bill/Rent Payment" },
    { key: "roomCondition", label: "Room Condition while Leaving" },
    { key: "noiseNuisance", label: "Peace and Quiet while stay" },
    { key: "propertyUse", label: "Respectful Property Use" },
  ];

  const StarRating = ({ value, onChange, max = 5 }) => (
    <div className="flex space-x-1">
      {[...Array(max)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(ratingValue)}
            className={`transition-colors ${ratingValue <= value ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
              }`}
          >
            <FiStar size={24} fill={ratingValue <= value ? 'currentColor' : 'none'} />
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#033E4A]">Before Removing {tenant.fullName || 'Tenant'}, Rate him/her</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {ratingFields.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}: <span className="font-bold text-[#B28C3F] ml-2">{ratingLabels[ratingData[key] - 1]}</span>
              </label>
              <CircleRating
                value={ratingData[key]}
                onChange={(value) => handleRatingChange(key, value)}
              />
            </div>
          ))}

          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments (Optional):
            </label>
            <textarea
              id="comments"
              rows="3"
              value={ratingData.comments}
              onChange={(e) => handleRatingChange('comments', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#B28C3F] focus:border-[#B28C3F]"
              placeholder="e.g., Left a few minor items, but overall great tenant."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-md"
            >
              Submit Rating & Remove Tenant
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CircleRating = ({ value, onChange, max = 5 }) => {
  // gradient shades from red → green
  const gradientShades = [
    "#ef4444", // 1 - Red
    "#f97316", // 2 - Orange-red
    "#facc15", // 3 - Yellow
    "#84cc16", // 4 - Yellow-green
    "#16a34a", // 5 - Green
  ];

  return (
    <div className="flex space-x-2">
      {[...Array(max)].map((_, index) => {
        const ratingValue = index + 1;
        const isFilled = ratingValue <= value; // fill up to selected value
        const color = gradientShades[index];

        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(ratingValue)}
            style={{
              backgroundColor: isFilled ? color : "transparent",
              borderColor: isFilled ? color : "#d1d5db", // gray-300
              transform: isFilled ? "scale(1.15)" : "scale(1)",
            }}
            className="w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110"
          />
        );
      })}
    </div>
  );
};

const DashboardCurrentTenants = () => {
  const [activeTab, setActiveTab] = useState("AsTenant");
  const [isOpen, setIsOpen] = useState(false);
  const [assignedTenants, setAssignedTenants] = useState({});
  const [listedStatus, setListedStatus] = useState({});
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [tenantToRate, setTenantToRate] = useState(null);
  const [propertyForRating, setPropertyForRating] = useState(null);
  const [showConfirmRemoveModal, setShowConfirmRemoveModal] = useState(false);
  const navigate = useNavigate();
  const [pendingRemoval, setPendingRemoval] = useState(null);



  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await propertyApi.getMyProperties();
        console.log("API response:", res.data);

        const rawProps = res.data?.properties || [];

        const apiProperties = await Promise.all(
          rawProps.map(async (p) => {
            // fetch tenant interests for this property
            const interestsRes = await propertyApi.getTenantInterestsOfProperty(p.property_id);
            const tenantInterests = interestsRes?.data || [];

            return {
              id: p.property_id,
              title: p.name,
              address: p.address,
              status: p.status,
              type: p.type,
              sizeV2: p.sizeV2,
              price: p.rent,
              aboutPlace: `${p.rooms} Rooms • ${p.kitchen} Kitchen • ${p.baths} Baths • ${p.bed_rooms} Beds`,
              description: p.description,
              image: p.images?.[0] || "https://via.placeholder.com/200",
              totalImages: p.images?.length || 0,
              visibility: p.visibility,
              tenants: p.tenants,
              tenantsInterests: tenantInterests,
            };
          })
        );

        setProperties(apiProperties);

        // Initialize toggle state
        const initialListed = {};
        apiProperties.forEach((p) => {
          initialListed[p.id] = p.visibility === "list";
        });
        setListedStatus(initialListed);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleRateAndRemoveTenant = async (ratingPayload) => {
    setShowRatingModal(false);

    try {
      // 1. Send the Rating to the API (Simulated)
      console.log("Submitting Tenant Rating:", ratingPayload);
      // NOTE: You'll need to create a new API endpoint for this:
      // const ratingRes = await propertyApi.submitTenantRating(ratingPayload);
      // if (ratingRes?.status !== 200) { toast.error("Failed to submit rating"); }

      toast.info("Tenant rating submitted! Now removing tenant...");

      // 2. Proceed with Tenant De-association (Existing Logic from handleAssignTenant - only the removal part)
      const payload = {
        userId: ratingPayload.tenantId, // Use tenantId from the payload
        propertyId: ratingPayload.propertyId, // Use propertyId from the payload
        status: "rent", // Status should be 'rent' for removal logic, or adjust as per your API
      };

      const res = await propertyApi.deAssociateTenant(payload);

      if (res?.status === 200 || res?.status === "success") {
        console.log("Tenant de-associated successfully", res.data);
        toast.success("Tenant Removed Successfully");

        // Update UI to remove tenant from property
        setProperties((prev) =>
          prev.map((p) =>
            p.id === ratingPayload.propertyId ? { ...p, tenants: [] } : p
          )
        );
      } else {
        toast.error("Failed to remove tenant");
      }
    } catch (err) {
      console.error("Error in tenant rate/remove:", err);
      toast.error("Something went wrong during removal");
    }
  };

  if (loading) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-14 h-14 border-4 border-[#D7B56D] border-t-transparent rounded-full"
      ></motion.div>

      <p className="mt-6 text-lg font-semibold text-gray-700">
        Loading <span className="text-[#B28C3F]">current tenants</span>...
      </p>

      <p className="text-sm text-gray-500 mt-2">
        Please wait while we fetch your tenant details.
      </p>
    </div>
  );
}


  // New dedicated function to wrap the existing removal logic
  const handleRemoveTenantClick = (propertyId, tenant) => {
    if (tenant) {
      setPendingRemoval({ propertyId, tenant });
      setShowConfirmRemoveModal(true);
    } else {
      toast.warn("No tenant is currently assigned to remove.");
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl">
      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        {/* Tabs */}
        

       <div>
  <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#B28C3F] to-[#D7B56D] tracking-wide">
    Current Tenants
  </h2>
  <p className="text-gray-600 text-sm md:text-base mt-1">
    Manage and view all your currently rented properties here.
  </p>
</div>



        

        {/* Search Button + Bar */}
        <div className="relative flex items-center justify-end w-full sm:w-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-full bg-gradient-to-r from-[#D7B56D] to-[#B28C3F] text-white shadow-md hover:scale-110 transition-transform"
          >
            {isOpen ? <FiX size={18} /> : <IoSearch size={18} />}
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute right-14 bg-white border border-gray-200 shadow-md rounded-full flex items-center px-3 overflow-hidden"
              >
                <IoSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  autoFocus
                  className="w-full py-2 bg-transparent outline-none text-gray-700 text-sm"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

        <div className="space-y-6">
          {properties.filter((property) => property.tenants && property.tenants.length > 0).length === 0 ? (
            <p className="text-center text-gray-500 py-6 text-base font-medium">
              No tenants assigned to your properties yet.
            </p>
          ) : (
            properties
              .filter((property) => property.tenants && property.tenants.length > 0)
              .map((property) => (
                <div
                  key={property.id}
                  className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Tenant Info */}
                  <div className="w-full md:w-80 flex flex-col items-center md:items-start md:pl-4 bg-gradient-to-b from-gray-50 to-white rounded-xl p-4 shadow-inner">
                    <div className="relative">
                      <div className="flex gap-3 items-center">
                        <img
                          src={
                            property.tenants[0].profilePicture ||
                            "https://via.placeholder.com/100?text=Tenant"
                          }
                          alt="Tenant"
                          className="w-12 h-12 rounded-full object-cover shadow-md"
                        />

                        <div className="flex flex-col">
                          <p className="text-base font-semibold text-gray-900">
                            {property.tenants[0].fullName}
                          </p>
                          <p className="text-[12px] text-gray-500">Property Tenant</p>
                        </div>
                      </div>

                    </div>

                    <div className="mt-1 text-center md:text-left w-full">

                      {property.tenants[0].mobileNumber && (
                        <p className="text-sm mt-3 text-gray-700 flex items-center gap-2">
                          <span className="font-medium text-md text-gray-900"><FaPhone /></span>
                          {property.tenants[0].mobileNumber}
                        </p>
                      )}

                      {property.tenants[0].email && (
                        <p className="text-sm mt-2 text-gray-700 flex items-center gap-2">
                          <span className="font-medium text-md text-gray-900"><MdEmail /></span>
                          {property.tenants[0].email}
                        </p>
                      )}

                      {/* --- REMOVE TENANT BUTTON ADDED HERE --- */}
                      <button
                        onClick={() => handleRemoveTenantClick(property.id, property.tenants[0])}
                        className="mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                      >
                        Remove Tenant
                      </button>
                      {/* ------------------------------------- */}
                      <div className="flex items-center justify-between mt-3 w-full bg-red-50 border border-red-200 rounded-md p-3">
                        <span className="text-[14px] font-medium text-red-800">
                          Payment due on <span className="font-semibold">7 Nov 2025</span>
                        </span>

                        <button
                          className="flex items-center gap-2 py-1.5 px-3 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                        >
                          <Bell className="h-4 w-4" />
                          ₹9,000
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Property Info (unchanged) */}
                  <div className="flex-1 max-w-fit">
                    <h2 className="text-lg font-semibold">{property.title}</h2>

                    <div className="relative mt-2">
                      <img
                        src={property.image}
                        alt="Property"
                        className="w-full md:w-30 h-22 object-cover rounded-md"
                      />
                      <span className="absolute bottom-2 left-2 bg-black text-white text-sm px-2 py-1 rounded-md">
                        {property.totalImages}+
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col mt-4 gap-2">
                      <p className="text-sm text-[#24292E]">
                        <span className="font-semibold text-[#171717]">Address: </span>
                        {property.address}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-[#171717]">Status: </span>
                        <span className="text-green-600 rounded-xl py-1 px-2 bg-[#34C7591F] font-medium capitalize">
                          {property.status}
                        </span>
                      </p>
                      <p className="text-sm text-[#24292E]">
                        <span className="font-semibold text-[#171717]">Type: </span>
                        {property.type.charAt(0).toUpperCase() + property.type.slice(1)} &nbsp;
                        <span className="font-semibold text-[#171717]">Size: </span>
                        {property.sizeV2} &nbsp;
                        <span className="font-semibold text-[#171717]">Price: </span>
                        ₹{Number(property.price).toLocaleString("en-IN")}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-[#171717]">About Place: </span>
                        {property.aboutPlace}
                      </p>
                      <p className="text-sm w-full md:w-[80%] text-[#24292E]">
                        <span className="font-semibold text-[#171717]">Description: </span>
                        <div className="line-clamp-2">
                          {property.description}
                        </div>
                      </p>
                    </div>

                    {/* Documents Button */}
<div className="mt-4">
  <button
    onClick={() => handleViewDocuments(property.id)} // <-- Add your handler
    className="px-4 py-2 bg-[#033E4A] text-white text-sm font-medium rounded-lg hover:bg-[#045C6A] shadow-md transition duration-150 ease-in-out"
  >
    View Documents
  </button>
</div>

                  </div>

                  <div className="w-full md:w-[34%] pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200 md:pl-6">
                    <h3 className="text-base font-bold text-gray-700 mb-3">Transaction History</h3>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
                      {/* Transaction Item */}
                      {[
                        {
                          date: "07 Oct 2025",
                          amount: 15000,
                          status: "Paid",
                          mode: "UPI",
                        },
                        {
                          date: "07 Sep 2025",
                          amount: 15000,
                          status: "Paid",
                          mode: "Bank Transfer",
                        },
                        {
                          date: "07 Aug 2025",
                          amount: 15000,
                          status: "Pending",
                          mode: "UPI",
                        },
                      ].map((txn, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-lg px-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              ₹{txn.amount.toLocaleString("en-IN")}
                            </p>
                            <p className="text-xs text-gray-500">{txn.date}</p>
                          </div>

                          <div className="text-right">
                            <span
                              className={`px-2 py-1 rounded-full text-[11px] font-semibold ${txn.status === "Paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                              {txn.status}
                            </span>
                            <p className="text-[11px] text-gray-500 mt-1">{txn.mode}</p>
                          </div>
                        </div>
                      ))}

                      {/* Show more button */}
                      <button className="w-full mt-3 py-2 text-sm font-medium text-[#033E4A] border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        View All Transactions
                      </button>
                    </div>
                  </div>



                </div>
              ))
          )}
        </div>

      {showConfirmRemoveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h2 className="text-lg font-bold text-gray-800">Confirm Removal</h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-[#B28C3F]">
                {pendingRemoval?.tenant?.fullName || "this tenant"}
              </span>
              ?
            </p>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmRemoveModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmRemoveModal(false);
                  // open rating modal next
                  setTenantToRate(pendingRemoval.tenant);
                  const property = properties.find(
                    (p) => p.id === pendingRemoval.propertyId
                  );
                  setPropertyForRating(property);
                  setShowRatingModal(true);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}


      <AnimatePresence>
        {showRatingModal && (
          <TenantRatingModal
            isOpen={showRatingModal}
            onClose={() => setShowRatingModal(false)}
            onRateAndRemove={handleRateAndRemoveTenant}
            tenant={tenantToRate}
            property={propertyForRating}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default DashboardCurrentTenants;