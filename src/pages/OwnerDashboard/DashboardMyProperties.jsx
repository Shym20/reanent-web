import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { FiX, FiStar } from "react-icons/fi";
import PropertyApi from '../../apis/property/property.api'
import OwnerApi from "../../apis/owner/owner.api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { Bell } from "lucide-react";

const propertyApi = new PropertyApi();
const ownerApi = new OwnerApi();


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






const DashboardMyProperties = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [assignedTenants, setAssignedTenants] = useState({});
  const [listedStatus, setListedStatus] = useState({});
  const [expandedProperties, setExpandedProperties] = useState({});
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [tenantToRate, setTenantToRate] = useState(null);
  const [propertyForRating, setPropertyForRating] = useState(null);
  const [showConfirmRemoveModal, setShowConfirmRemoveModal] = useState(false);
  const [showStartTenancyModal, setShowStartTenancyModal] = useState(false);
const [selectedTenantForTenancy, setSelectedTenantForTenancy] = useState(null);
const [selectedPropertyForTenancy, setSelectedPropertyForTenancy] = useState(null);

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



  // const handleAssignTenant = async (propertyId, tenantId) => {
  //   try {
  //     if (!tenantId) {
  //       // 🚫 Remove tenant flow
  //       const currentTenant = properties.find((p) => p.id === propertyId)?.tenants[0];

  //       if (!currentTenant) return;

  //       const payload = {
  //         userId: currentTenant.userId,
  //         propertyId: propertyId,
  //         status: "rent",
  //       };

  //       const res = await propertyApi.deAssociateTenant(payload);

  //       if (res?.status === 200 || res?.status === "success") {
  //         console.log("Tenant de-associated successfully", res.data);
  //         toast.success("Tenant Removed Successfully");

  //         // Update UI
  //         setAssignedTenants((prev) => ({
  //           ...prev,
  //           [propertyId]: null,
  //         }));

  //         // Also clear from properties state so dropdown resets
  //         setProperties((prev) =>
  //           prev.map((p) =>
  //             p.id === propertyId ? { ...p, tenants: [] } : p
  //           )
  //         );
  //       } else {
  //         toast.error("Failed to remove tenant");
  //       }
  //     } else {
  //       // ✅ Assign tenant flow
  //       const selectedTenant = properties
  //         .find((p) => p.id === propertyId)
  //         .tenantsInterests.find((t) => t.tenantId === tenantId);

  //       setAssignedTenants((prev) => ({
  //         ...prev,
  //         [propertyId]: selectedTenant,
  //       }));

  //       const payload = {
  //         userId: tenantId,
  //         propertyId: propertyId,
  //       };

  //       const res = await propertyApi.associateTenant(payload);

  //       if (res?.status === 200 || res?.status === "success") {
  //         console.log("Tenant associated successfully", res.data);
  //         toast.success("Tenant Associated Successfully");

  //         // Update properties state
  //         setProperties((prev) =>
  //           prev.map((p) =>
  //             p.id === propertyId ? { ...p, tenants: [selectedTenant] } : p
  //           )
  //         );
  //       } else {
  //         toast.error("Failed to associate tenant");
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error in tenant assign/remove:", err);
  //     toast.error("Something went wrong");
  //   }
  // };



  const handleToggleList = async (propertyId) => {
    try {
      // Call API
      const res = await propertyApi.togglePropertyVisibilty(propertyId);

      if (res?.status === 200 || res?.status === "success") {
        toast.success("Property visibility updated successfully");

        // Update UI after success
        setListedStatus((prev) => ({
          ...prev,
          [propertyId]: !prev[propertyId],
        }));
      } else {
        toast.error("Failed to update property visibility");
      }
    } catch (err) {
      console.error("Error toggling property visibility:", err);
      toast.error("Something went wrong");
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
        Loading <span className="text-[#B28C3F]">Your Listed Properties</span>...
      </p>

      <p className="text-sm text-gray-500 mt-2">
        Please wait while we fetch your properties.
      </p>
    </div>
  );
}


  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;

    try {
      const res = await propertyApi.deleteProperty(propertyToDelete);

      if (res?.status === 200 || res?.status === "success") {
        toast.success("Property deleted successfully");
        setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete));
      } else {
        toast.error("Failed to delete property");
      }
    } catch (err) {
      console.error("Error deleting property:", err);
      toast.error("Something went wrong");
    } finally {
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    }
  };

  // New dedicated function to wrap the existing removal logic
  const handleRemoveTenantClick = (propertyId, tenant) => {
    if (tenant) {
      setPendingRemoval({ propertyId, tenant });
      setShowConfirmRemoveModal(true);
    } else {
      toast.warn("No tenant is currently assigned to remove.");
    }
  };


  const handleEditProperty = (propertyId) => {
    navigate(`/dashboard-owner/add-property/${propertyId}`);
  };
  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl">
      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        {/* Tabs */}
       <div>
  <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#B28C3F] to-[#D7B56D] tracking-wide">
    My Listed Properties
  </h2>
  <p className="text-gray-600 text-sm md:text-base mt-1">
     View, edit, and manage all the properties you’ve listed for rent.
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

      {/* MyProperty Tab */}
     
        <div className="space-y-6">
          {properties.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              You don’t have any properties listed yet.
            </p>
          ) : (properties.map((property) => (

            <div key={property.id} className="flex flex-col md:flex-row bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 gap-6 relative">
              {/* Image */}
              <div className="relative w-full md:w-56 h-44 flex-shrink-0">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover rounded-xl"
                />
                <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full shadow">
                  {property.totalImages - 1}+
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 gap-2">
                <Link key={property.id}
                  to={`${property.id}`}>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {property.title}
                  </h2></Link>
                <p className="text-md text-gray-800">
                  <span className="font-bold text-gray-800">Address: </span>
                  {property.address}
                </p>

                <div className="flex flex-wrap gap-3 text-gray-800 text-md">
                  <span><span className="font-bold">Type:</span> {property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
                  <span><span className="font-bold">Size:</span> {property.sizeV2}</span>
                  <span>
                    <span className="font-bold">Price:</span> ₹
                    {Number(property.price).toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="text-md">
                  <span className="font-bold text-gray-800">Status: </span>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold ${property.status === "rent"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {property.status === "rent" ? "Active" : "Inactive"}
                  </span>
                </p>

                <p className="text-md text-gray-800">
                  <span className="font-bold">About Place: </span>
                  {property.aboutPlace}
                </p>

                <p className="text-md text-gray-800">
                  <span className="font-bold">Description: </span>
                  <span
                    className={`${expandedProperties[property.id] ? "" : "line-clamp-2"}`}
                  >
                    {property.description}
                  </span>
                  {property.description.length > 80 && (
                    <button
                      onClick={() =>
                        setExpandedProperties((prev) => ({
                          ...prev,
                          [property.id]: !prev[property.id],
                        }))
                      }
                      className={`${expandedProperties[property.id] ? "ml-2" : ""} text-[#033E4A] font-semibold hover:underline`}
                    >
                      {expandedProperties[property.id] ? "Read less" : "...Read more"}
                    </button>
                  )}
                </p>


                {/* Action Section */}
                <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  {/* Tenant Selection */}
                  {/* <div>
                    <label className="text-md font-bold text-gray-800">
                      Assign Tenant:
                    </label>
                    <select
                      className="ml-2 border border-gray-300 rounded-lg px-3 py-1.5 text-md"
                      onChange={(e) => {
                        if (e.target.value === "remove") {
                          handleRemoveTenantClick(property.id, property.tenants[0])
                        } else {
                          handleAssignTenant(property.id, e.target.value);
                        }
                      }}
                      value={property.tenants[0]?.tenantId || ""} 
                    >
                    
                      {!property.tenants[0] && <option value="">-- Select Tenant --</option>}

                      {property.tenants[0] && (
                        <option value={property.tenants[0].tenantId}>
                          {property.tenants[0].fullName || property.tenants[0].tenantId}
                        </option>
                      )}

                      {property.tenantsInterests.length === 0 ? (
                        <option disabled>No interests yet</option>
                      ) : (
                        property.tenantsInterests
                          .filter(
                            (interest) => interest.tenant?.userId !== property.tenants[0]?.userId
                          )
                          .map((interest) => (

                            <option
                              key={interest.interestId}
                              value={interest.tenant?.userId}
                            >
                              {interest.tenant?.fullName || interest.tenant?.userId}
                            </option>
                          ))

                      )}

                   
                      {property.tenants[0] && (
                        <option value="remove" className="text-red-500">
                          Remove Tenant
                        </option>
                      )}
                    </select>


                  </div> */}
                  {/* Tenant List (Clickable) */}
{/* Tenant Selection (Dropdown triggers tenancy modal) */}
<div>
  <label className="text-md font-bold text-gray-800">Assign Tenant:</label>
  <select
    className="ml-2 border border-gray-300 rounded-lg px-3 py-1.5 text-md"
    onChange={(e) => {
      const tenantId = e.target.value;
      if (tenantId && tenantId !== "none") {
        const selectedTenant = property.tenantsInterests?.find(
          (t) => t.tenant?.userId === tenantId
        )?.tenant;
        if (selectedTenant) {
          setSelectedTenantForTenancy(selectedTenant);
          setSelectedPropertyForTenancy(property);
          setShowStartTenancyModal(true);
        }
      }
    }}
    defaultValue="none"
  >
    <option value="none" disabled>
      Select Tenant
    </option>
    {property.tenantsInterests?.length > 0 ? (
      property.tenantsInterests.map((interest) => (
        <option key={interest.interestId} value={interest.tenant?.userId}>
          {interest.tenant?.fullName || interest.tenant?.userId}
        </option>
      ))
    ) : (
      <option disabled>No interested tenants</option>
    )}
  </select>
</div>





                  {/* Toggle Listing */}
                  <div className="flex items-center gap-3">
                    <span className="text-md font-medium text-gray-700">Listed:</span>
                    <button
                      onClick={() => handleToggleList(property.id)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${listedStatus[property.id]
                        ? "bg-green-500 justify-end"
                        : "bg-gray-400 justify-start"
                        }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3 md:mt-0 md:absolute md:top-5 md:right-5">
                <button onClick={() => handleEditProperty(property.id)} className="p-2 rounded-lg bg-[#033E4A] text-white hover:bg-teal-800 shadow">
                  <FaEdit size={16} />
                </button>
                {/* {property.tenantsInterests?.length > 0 && (
  <button
    onClick={() => {
      const tenant = property.tenantsInterests[0]?.tenant?.userId
        ? property.tenantsInterests[0]?.tenant
        : null;
      setSelectedTenantForTenancy(tenant);
      setSelectedPropertyForTenancy(property);
      setShowStartTenancyModal(true);
    }}
    className="p-2 rounded-lg bg-[#B28C3F] text-white hover:bg-[#D7B56D] shadow"
  >
    Start Tenancy
  </button>
)} */}

                <button
                  onClick={() => {
                    setPropertyToDelete(property.id);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 rounded-lg bg-[#FF3B30] text-white hover:bg-red-700 shadow"
                >
                  <FaTrash size={16} />
                </button>

              </div>
            </div>
          )))}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
                <h2 className="text-lg font-bold text-gray-800">Confirm Delete</h2>
                <p className="text-gray-600 mt-2">
                  Are you sure you want to delete this property? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteProperty}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
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

     {showStartTenancyModal && selectedTenantForTenancy && selectedPropertyForTenancy && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Start Tenancy</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);

          const tenancyPayload = {
            propertyId: selectedPropertyForTenancy.id,
            tenantUserId: selectedTenantForTenancy.userId,
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            donePrice: formData.get("rent"),
            securityDeposit: formData.get("securityDeposit"),
          };

          try {
            toast.info("Sending tenancy approval...");

            const res = await ownerApi.submitFormStartTenancyFromOwner(tenancyPayload);

            if (res?.status === 200 || res?.status === "success") {
              toast.success("Tenancy approval sent successfully!");
              setShowStartTenancyModal(false);
            } else {
              toast.error(res?.data?.message || "Failed to send approval");
            }
          } catch (err) {
            console.error("Error submitting tenancy:", err);
            toast.error("Something went wrong while starting tenancy");
          }
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Tenant Name</label>
          <input
            type="text"
            value={selectedTenantForTenancy.fullName}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rent Amount (₹)</label>
          <input
            type="number"
            name="rent"
            required
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Security Deposit (₹)</label>
          <input
            type="number"
            name="securityDeposit"
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowStartTenancyModal(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#B28C3F] text-white hover:bg-[#D7B56D] transition shadow-md"
          >
            Send Approval
          </button>
        </div>
      </form>
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

export default DashboardMyProperties;