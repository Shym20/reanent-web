import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import TenantApi from "../../apis/tenant/tenant.api";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import DocumentApi from "../../apis/document/document.api";
import { FiX } from "react-icons/fi";
import PaymentApi from "../../apis/payment/payment.api";
import { useNavigate } from "react-router-dom";
import RatingAndRemovalApi from "../../apis/ratingAndRemoval/ratingAndRemoval.api";

const tenantApi = new TenantApi();
const documentApi = new DocumentApi();
const paymentApi = new PaymentApi();

export function TenantRateOwnerPropertyModal({ isOpen, onClose, onSubmit, owner, property }) {
  if (!isOpen || !owner || !property) return null;

  const initialRating = {
    helpfulness: 3,
    restrictions: 3,
    strictness: 3,
    politeness: 3,
    depositReturn: 3,
    femaleBehaviour: 3,

    featuresAccuracy: 3,
    localitySafety: 3,
    neighbours: 3,
    propertyCondition: 3,

    ownerComments: "",
    propertyComments: "",
  };


  const [ratings, setRatings] = useState(initialRating);

  useEffect(() => {
    if (isOpen) setRatings(initialRating);
  }, [isOpen]);

  const handleRatingChange = (field, value) => {
    setRatings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      tenantStayId: property.tenantStayId,

      ownerRatings: {
        helpfulness: ratings.helpfulness,
        freedom: ratings.restrictions,
        rentStrictness: ratings.strictness,
        politeness: ratings.politeness,
        depositReturn: ratings.depositReturn,
        behaviourToFemale: ratings.femaleBehaviour,
        ownerComments: ratings.ownerComments,
      },

      propertyRatings: {
        asDescribed: ratings.featuresAccuracy,
        safety: ratings.localitySafety,
        neighbourBehaviour: ratings.neighbours,
        condition: ratings.propertyCondition,
        propertyComments: ratings.propertyComments,
      },
    };

    onSubmit(payload);
  };


  const ratingLabels = ["Very Poor 😠", "Poor 🙁", "Average 😐", "Good 🙂", "Excellent! 😄"];

  const ownerFields = [
    { key: "helpfulness", label: "Helpfulness during problems" },
    { key: "restrictions", label: "Freedom from unnecessary restrictions" },
    { key: "strictness", label: "Strictness regarding rent" },
    { key: "politeness", label: "Politeness & behaviour" },
    { key: "depositReturn", label: "Return of deposit (if applicable)" },
    { key: "femaleBehaviour", label: "Behaviour with female tenants" },
  ];

  const propertyFields = [
    { key: "featuresAccuracy", label: "Property as described in listing" },
    { key: "localitySafety", label: "Safety & security of locality" },
    { key: "neighbours", label: "Behaviour of neighbours / surroundings" },
    { key: "propertyCondition", label: "Property condition (leakage, walls, bathroom, etc.)" },
  ];

  // 🟢 Gradient Circle Rating Component
  const CircleRating = ({ value, onChange, max = 5 }) => {
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
          const isFilled = ratingValue <= value;
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#033E4A]">
            Rate Owner & Property ({property.title || "Your Stay"})
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OWNER SECTION */}
          <div>
            <h3 className="text-lg font-semibold text-[#033E4A] mb-2">Owner Rating</h3>
            <div className="space-y-3">
              {ownerFields.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}:{" "}
                    <span className="font-semibold text-[#B28C3F]">
                      {ratingLabels[ratings[key] - 1]}
                    </span>
                  </label>
                  <CircleRating
                    value={ratings[key]}
                    onChange={(val) => handleRatingChange(key, val)}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* COMMENTS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments for Owner (Optional)
            </label>
            <textarea
              rows="3"
              value={ratings.ownerComments}
              onChange={(e) => handleRatingChange("ownerComments", e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Comment about owner..."
            ></textarea>

          </div>

          {/* PROPERTY SECTION */}
          <div>
            <h3 className="text-lg font-semibold text-[#033E4A] mb-2">Property Rating</h3>
            <div className="space-y-3">
              {propertyFields.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}:{" "}
                    <span className="font-semibold text-[#B28C3F]">
                      {ratingLabels[ratings[key] - 1]}
                    </span>
                  </label>
                  <CircleRating
                    value={ratings[key]}
                    onChange={(val) => handleRatingChange(key, val)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* COMMENTS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments for Property (Optional)
            </label>
            <textarea
              rows="3"
              value={ratings.propertyComments}
              onChange={(e) => handleRatingChange("propertyComments", e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Comment about property..."
            ></textarea>

          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#033E4A] text-white hover:bg-[#045364] transition shadow-md"
            >
              Submit Rating
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

const DashboardYourStay = () => {
  const [activeTab, setActiveTab] = useState("CurrentStay");
  const [properties, setProperties] = useState([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState({});
  const [showTxnModal, setShowTxnModal] = useState(false);
  const [selectedPropertyTxns, setSelectedPropertyTxns] = useState([]);
  const navigate = useNavigate();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const ratingApi = new RatingAndRemovalApi();

  const handleRateOwner = (owner, property) => {
    setSelectedOwner(owner);
    setSelectedProperty(property);
    setShowRatingModal(true);
  };


  const handleSubmitRating = async (payload) => {
    try {
      const res = await ratingApi.initiateRemovalByTenant(payload);

      if (res?.status === "success") {
        toast.success("Leave request submitted successfully!");
        setShowRatingModal(false);
      } else {
        toast.error(res?.data?.message || "Failed to submit leave request");
      }

    } catch (error) {
      console.error("Error submitting leave request:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleViewDocuments = async (propertyId) => {
    setSelectedPropertyId(propertyId);
    setShowDocModal(true);

    try {
      const res = await documentApi.getDocument(propertyId);
      if (res?.status === "success") {
        setDocuments(res.data);
      } else {
        toast.warn("No documents found for this property");
        setDocuments([]);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
      toast.error("Failed to fetch documents");
    }
  };

  const fetchPaymentHistory = async (propertyId) => {
    try {
      const res = await paymentApi.getPaymentHistoryForProperty(propertyId, "paid");
      if (res?.status === "success") {
        setPaymentHistory((prev) => ({
          ...prev,
          [propertyId]: res?.data,
        }));
        console.log("myProp history is here : ", res.data);
      } else {
        setPaymentHistory((prev) => ({ ...prev, [propertyId]: [] }));
      }
    } catch (err) {
      console.error("Error fetching payment history:", err);
      setPaymentHistory((prev) => ({ ...prev, [propertyId]: [] }));
    }
  };

  useEffect(() => {
    const fetchCurrentStay = async () => {
      try {
        const res = await tenantApi.getMyCurrentStay();
        console.log("res here : ", res.status);
        if (res?.status === "success") {
          const formattedData = res.data.map((item) => ({
            id: item.stayDetails.propertyId,
            tenantStayId: item.stayDetails.tenantStayId,
            title: item.property.name,
            address: item.property.address,
            type: item.property.type,
            startDate: item.stayDetails.startDate,
            endDate: item.stayDetails.endDate,
            price: item?.stayDetails?.donePrice || "NA",
            securityDeposit: item?.stayDetails?.securityDeposit || "NA",
            aboutPlace: `${item.property.bed_rooms} BHK • ${item.property.baths} Baths • ${item.property.kitchen} Kitchen`,
            description: item.property.description,
            image: item.property.images?.[0],
            owner: item.owner,
            leaveRequestGiven: item.leaveRequestGiven,
          }));
          setProperties(formattedData);
          formattedData.forEach((p) => fetchPaymentHistory(p.id));
        } else {
          toast.error(res?.message || "Failed to fetch current stays");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong while fetching data");
      }
    };

    fetchCurrentStay();
  }, []);


  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl">
      {/* Header Tabs */}
      <div className="flex flex-wrap p-1 border border-[#033E4A33] shadow rounded-xl overflow-hidden w-full sm:w-fit">
        {["CurrentStay", "PreviousStay"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 md:px-16 py-2 rounded-xl font-medium transition ${activeTab === tab
              ? "bg-[#033E4A] text-white"
              : "bg-white text-gray-700 hover:bg-[#033E4A]/5"
              }`}
          >
            {tab === "CurrentStay" ? "Current Stay" : "Previous Stay"}
          </button>
        ))}
      </div>

      {/* Your Current Stay */}
      <div className="space-y-6 mt-8">
        {properties.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">No current stays found.</p>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300"
            >
              {/* Responsive 3-column layout */}
              <div className="flex flex-col lg:flex-row gap-6">

                {/* Owner Info */}
                <div className="bg-gray-50 rounded-xl p-4 flex-1">
                  <div className="flex gap-3 items-center">
                    <img
                      src={property.owner?.profilePicture}
                      className="w-12 h-12 rounded-full object-cover"
                      alt="owner"
                    />
                    <div>
                      <p className="font-semibold">{property.owner?.fullName}</p>
                      <p className="text-xs text-gray-500">Property Owner</p>
                    </div>
                  </div>

                  <p className="text-sm mt-3 flex items-center gap-2 text-gray-700">
                    <MdEmail /> {property.owner?.email}
                  </p>

                  <button
                    disabled={property.leaveRequestGiven}
                    className={`mt-5 w-full text-white text-sm py-2 rounded-md transition
    ${property.leaveRequestGiven
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#033E4A] hover:bg-[#055b68]"
                      }`}
                    onClick={() => !property.leaveRequestGiven && handleRateOwner(property.owner, property)}
                  >
                    {property.leaveRequestGiven ? "Waiting for Approval" : "Leave Request"}
                  </button>


                </div>


                {/* Property Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  <img
                    src={property.image}
                    className="w-full h-40 object-cover rounded-lg mt-2"
                    alt={property.title}
                  />
                  <div className="mt-3 space-y-1 text-sm text-gray-700">
                    <p>
                      <strong>Stay Duration:</strong>{" "}
                      {property.startDate
                        ? new Date(property.startDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        : "-"}{" "}
                      to{" "}
                      {property.endDate
                        ? new Date(property.endDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        : "-"}
                    </p>


                    <p>
                      <strong>Address:</strong> {property.address}
                    </p>
                    <p>
                      <strong>Final Price:</strong> ₹{property.price.toLocaleString("en-IN")}
                    </p>
                    <p>
                      <strong>Security Deposit:</strong> ₹{property.securityDeposit.toLocaleString("en-IN")}
                    </p>
                    <p>
                      <strong>About:</strong> {property.aboutPlace}
                    </p>
                    <p className="text-gray-600 line-clamp-2">
                      <strong>Description:</strong> {property.description}
                    </p>
                  </div>
                  <button onClick={() => handleViewDocuments(property.id)} className="mt-3 w-full border bg-[#033E4A] text-white hover:bg-[#055b68] text-sm py-2 rounded-md shadow-sm transition">
                    View Document
                  </button>

                </div>

                {/* Transaction History */}
                <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
                  <h3 className="text-base font-bold text-gray-700 mb-3">Transaction History</h3>

                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
                    {paymentHistory[property.id]?.length > 0 ? (
                      <>
                        {paymentHistory[property.id]
                          .slice(0, 3)
                          .map((txn, index) => (
                            <div
                              key={txn._id || index}
                              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-lg px-3 py-2"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  ₹{txn.amount.toLocaleString("en-IN")}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(txn.dueDate).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>

                              <div className="text-right">
                                <span
                                  className={`px-2 py-1 rounded-full text-[11px] font-semibold ${txn.paymentStatus === "paid"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                  {txn.paymentStatus.charAt(0).toUpperCase() +
                                    txn.paymentStatus.slice(1)}
                                </span>
                                <p className="text-[11px] text-gray-500 mt-1">
                                  {txn.paymentMethod}
                                </p>
                              </div>
                            </div>
                          ))}

                        <button
                          className="w-full mt-3 py-2 text-sm font-medium text-[#033E4A] border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          onClick={() => {
                            setSelectedPropertyTxns(paymentHistory[property.id] || []);
                            setShowTxnModal(true);
                          }}
                        >
                          View All Transactions
                        </button>

                      </>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No transactions found
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {showDocModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
          >
            <button
              onClick={() => setShowDocModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <FiX size={22} />
            </button>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#033E4A]">Property Documents</h2>

              {/* Show Upload Button only when there are no documents */}
              <button
                onClick={() => {
                  if (!selectedPropertyId) return toast.warn("No property selected");
                  setShowDocModal(false);
                  navigate("/dashboard-tenant/documents", { state: { propertyId: selectedPropertyId } });
                }}

                className="px-3 py-2 mr-3 text-sm bg-[#033E4A] text-white rounded-md hover:bg-[#033E4A] transition"
              >
                Upload Document
              </button>


            </div>

            {documents.length === 0 ? (
              <p className="text-gray-500 text-center">No documents uploaded yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                {documents.map((doc) => (
                  <li key={doc.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold max-w-[200px] truncate text-gray-800">{doc.name}</p>
                      <p className="text-[14px] text-gray-500">{doc.type}</p>
                      <p className="text-[12px] text-gray-400">Uploaded by : {doc?.uploadedBy.fullName}</p>
                      <p className="text-[12px] text-gray-400">
                        Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-sm bg-[#033E4A] text-white rounded-md hover:bg-[#045C6A] transition"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {showTxnModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowTxnModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <FiX size={22} />
              </button>

              <h2 className="text-lg font-bold text-[#033E4A] mb-4 text-center">
                All Transactions
              </h2>

              {selectedPropertyTxns.length > 0 ? (
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                  {selectedPropertyTxns.map((txn, idx) => (
                    <div
                      key={txn._id || idx}
                      className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-lg px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          ₹{txn.amount.toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(txn.dueDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-[11px] font-semibold ${txn.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : txn.paymentStatus === "overdue"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {txn.paymentStatus.charAt(0).toUpperCase() +
                            txn.paymentStatus.slice(1)}
                        </span>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {txn.paymentMethod || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-6">
                  No transactions available.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TenantRateOwnerPropertyModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
        owner={selectedOwner}
        property={selectedProperty}
      />

    </div>
  );
};

export default DashboardYourStay;
