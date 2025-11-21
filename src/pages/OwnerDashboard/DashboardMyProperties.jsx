import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import PropertyApi from '../../apis/property/property.api'
import OwnerApi from "../../apis/owner/owner.api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const propertyApi = new PropertyApi();
const ownerApi = new OwnerApi();

const DashboardMyProperties = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [listedStatus, setListedStatus] = useState({});
  const [expandedProperties, setExpandedProperties] = useState({});
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [showStartTenancyModal, setShowStartTenancyModal] = useState(false);
  const [selectedTenantForTenancy, setSelectedTenantForTenancy] = useState(null);
  const [selectedPropertyForTenancy, setSelectedPropertyForTenancy] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


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
          <p className="text-gray-600 text-sm md:text-[18px] mt-1">
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
                  placeholder="Search by property name"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 bg-transparent outline-none text-gray-700 text-[14px] "
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
        ) : (filteredProperties.map((property) => (

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

                {/* Tenant Selection (Dropdown triggers tenancy modal) */}
                <div>
                  <label className="text-md font-bold text-gray-800">Assign Tenant:</label>
                  <select
                    className="ml-2 border border-gray-300 rounded-lg px-3 py-1.5 text-md"
                    value={property.tenants?.[0]?.userId || "none"}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Remove current tenant
                      if (value === "remove") {
                        navigate("/dashboard-owner", {
                          state: {
                            autoRemove: {
                              propertyId: property.id,
                              tenant: property.tenants?.[0]
                            }
                          }
                        });
                        return;
                      }


                      // Start tenancy for selected tenant
                      if (value && value !== "none") {
                        const selectedTenant = property.tenantsInterests?.find(
                          (t) => t.tenant?.userId === value
                        )?.tenant;

                        if (selectedTenant) {
                          setSelectedTenantForTenancy(selectedTenant);
                          setSelectedPropertyForTenancy(property);
                          setShowStartTenancyModal(true);
                        }
                      }
                    }}
                  >
                    {property.tenants?.length > 0 ? (
                      <>
                        {/* Current tenant shown as selected value */}
                        <option value={property.tenants[0].userId}>
                          {property.tenants[0].fullName || "Assigned Tenant"}
                        </option>

                        {/* List all interested tenants EXCEPT the current tenant */}
                        {property.tenantsInterests?.length > 0 ? (
                          property.tenantsInterests
                            .filter(
                              (interest) => interest.tenant?.userId !== property.tenants[0].userId
                            )
                            .map((interest) => (
                              <option key={interest.interestId} value={interest.tenant?.userId}>
                                {interest.tenant?.fullName || interest.tenant?.userId}
                              </option>
                            ))
                        ) : (
                          <option disabled>No interested tenants</option>
                        )}

                        {/* Remove option at bottom */}
                        <option value="remove" className="text-red-600">
                          Remove Tenant
                        </option>
                      </>
                    ) : (
                      // No tenant assigned yet — show normal dropdown
                      <>
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
                      </>
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
    </div>
  );
};

export default DashboardMyProperties;