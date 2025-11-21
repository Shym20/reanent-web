import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCheckCircle, FiClock, FiXCircle, FiX, FiHome, FiZap, FiPlus } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import PaymentApi from "../../apis/payment/payment.api";
import TenantApi from "../../apis/tenant/tenant.api";
import { getTokenLocal } from "../../utils/localStorage.util";
import { toast } from "react-toastify";

const paymentApi = new PaymentApi();
const tenantApi = new TenantApi();


export default function DashboardTenantRentUtilities() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [bbpsOpen, setBbpsOpen] = useState(false);
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState("");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [utilityAmount, setUtilityAmount] = useState("");
  const [currentUtilityPayment, setCurrentUtilityPayment] = useState(null);
  const [operatorSearch, setOperatorSearch] = useState("");
  const [billDetails, setBillDetails] = useState(null);
  const [loadingBill, setLoadingBill] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState("");




  const token = getTokenLocal();

  useEffect(() => {
    const fetchCurrentStay = async () => {
      try {
        const res = await tenantApi.getMyCurrentStay();
        if (res?.status === "success") {
          const formattedData = res.data.map((item) => ({
            id: item.stayDetails.propertyId,
            title: item.property.name,
            address: item.property.address,
            owner: item.owner.fullName,
            phone: item.owner.email, // or owner contact if available
          }));
          setProperties(formattedData);
        }
      } catch (err) {
        console.error("Error fetching tenant properties:", err);
      }
    };

    fetchCurrentStay();
  }, []);



  useEffect(() => {
    const fetchPayments = async () => {
      if (!selectedProperty) return; // skip until property is chosen
      try {
        const res = await paymentApi.getPaymentHistoryForProperty(selectedProperty, "");
        if (res?.status === "success") {
          setPayments(res?.data || []);
        } else {
          setPayments([]);
        }
      } catch (err) {
        console.error("Error fetching tenant payments:", err);
        setPayments([]);
      }
    };

    fetchPayments();
  }, [selectedProperty]);




  const [newPayment, setNewPayment] = useState({
    date: "",
    property: "",
    tenant: "",
    phone: "",
    amount: "",
    type: "Rent",
    status: "Paid",
  });

  const filteredPayments = payments.filter(
    (p) =>
      (filter === "All" || p.status === filter) &&
      ((p.tenant?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (p.property?.toLowerCase() || "").includes(search.toLowerCase()))
  );


  const handleAddPayment = () => {
    setPayments([...payments, newPayment]);
    setNewPayment({
      date: "",
      property: "",
      tenant: "",
      phone: "",
      amount: "",
      type: "Rent",
      status: "Paid",
    });
    setManualOpen(false);
  };

  const [isOpenn, setIsOpenn] = useState(false);
  const [payment, setPayment] = useState({
    property: "",
    type: "Rent",
    amount: "",
    method: "UPI",
  });

  const handlePay = async (p) => {
    try {
      if (p.type?.toLowerCase() === "utility") {
        // 🧾 Handle BBPS Utility Payment
        await handleUtilityPayment(p);
        return;
      }

      // 🏠 Otherwise, continue existing Rent Razorpay logic
      const res = await paymentApi.createPayment({ paymentId: p._id });
      if (res?.status !== "success") {
        alert("Failed to create order. Please try again.");
        return;
      }

      const orderData = res.data;
      const options = {
        key: orderData.key,
        amount: orderData.amount * 100,
        currency: orderData.currency || "INR",
        name: orderData.name || "Rent Payment",
        description: orderData.description || `Payment for ${p.property}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(
              `${import.meta.env.VITE_API_URL}/api/user/property/payment/razorpay/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  paymentId: p._id,
                }),
              }
            );

            const verifyData = await verifyRes.json();
            if (verifyData.status === "success") {
              alert("✅ Payment successful!");
              const updated = await paymentApi.getPaymentHistoryForProperty(selectedProperty, "");
              if (updated?.status === "success") setPayments(updated.data);
            } else {
              alert("⚠️ Payment verification failed!");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Error verifying payment.");
          }
        },
        prefill: { name: p.tenant || "Tenant", email: p.email || "tenant@example.com" },
        theme: { color: "#046E6E" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", () => alert("❌ Payment failed. Try again later."));
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong while initiating payment.");
    }
  };

  const handleUtilityPayment = async (p) => {
    try {
      setCurrentUtilityPayment(p);
      setBbpsOpen(true);

      // Fetch operator list once modal opens
      const operatorsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/property/payment/bbps/operators`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const operatorsData = await operatorsRes.json();

      const uniqueTypes = [...new Set(operatorsData.data.map(op => op.ServiceType))];



      if (operatorsData?.status === "success") {
        const allOps = operatorsData.data;

        const utilityCategories = [
          "Electricity",
          "Water",
          "GAS",
          "Broadband",
          "Landline Postpaid",
          "Municipal Services",
          "Municipal Taxes",
          "Housing Society",
          "LPG Gas"
        ];

        const utilityOps = allOps.filter(op =>
          utilityCategories.includes(op.ServiceType)
        );

        setOperators(utilityOps);
        console.log("Filtered Utility Operators:", utilityOps.length, utilityOps);
      }
      else {
        alert("Failed to load operators.");
      }
    } catch (err) {
      console.error("Utility Payment Init Error:", err);
    }
  };

  const fetchBillInfo = async () => {
    if (!selectedOperator || !consumerNumber) return;

    setLoadingBill(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/property/payment/bbps/get-billerinfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          operator: selectedOperator,
          number: consumerNumber,
        }),
      });

      const data = await res.json();
      console.log("data status : ",data.data.status);

      if (data?.data?.statuscode === "TXN") {
        const info = data.data.data;
        setUtilityAmount(info?.DueAmount || "");
        setBillDetails({
          name: info.CustomerName || "",
          billNumber: info.BillNumber || "",
          dueDate: info.DueDate || "",
        });
      } else {
        setBillDetails(null);
        alert("Invalid details or no due bill found.");
      }
    } catch (err) {
      console.error("Bill info fetch error:", err);
      alert("Error fetching bill info");
    } finally {
      setLoadingBill(false);
    }
  };

  useEffect(() => {
    if (selectedOperator && consumerNumber.length > 3) {
      const timeout = setTimeout(fetchBillInfo, 800);
      return () => clearTimeout(timeout);
    }
  }, [selectedOperator, consumerNumber]);


  const submitUtilityPayment = async () => {
    if (!selectedOperator || !consumerNumber || !utilityAmount) {
      toast.err("Please fill all required fields.");
      return;
    }

    try {
      const payRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/property/payment/bbps/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          operator: selectedOperator,
          number: consumerNumber,
          amount: utilityAmount,
          circle: "1",
          usertx: `REN-${Date.now()}`,
          propertyId: currentUtilityPayment?.propertyId || selectedProperty,
        }),
      });

      const payData = await payRes.json();
      if (payData.status === "success") {
        alert(`✅ Utility payment successful! Ref: ${payData.data.RefId}`);
        setBbpsOpen(false);
        // Refresh payment list
        const updated = await paymentApi.getPaymentHistoryForProperty(selectedProperty, "");
        if (updated?.status === "success") setPayments(updated.data);
      } else {
        alert("⚠️ Utility payment failed: " + payData.message);
      }
    } catch (err) {
      console.error("Utility Payment Error:", err);
      alert("Error processing utility payment.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-[#033E4A] to-[#046E6E] text-white rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold">Rent & Utilities</h2>
        <p className="text-sm opacity-90">
          Track rental and utility payments across all your properties.
        </p>
      </motion.div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm focus:outline-none"
          >
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
          </select>

          {/* Create Manually Button */}
          <motion.button
            onClick={() => setIsOpenn(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#033E4A] to-[#046E6E] text-white px-6 py-2 rounded-xl shadow-lg font-medium"
          >
            Make a Payment
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative flex items-center justify-end w-full sm:w-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-full bg-gradient-to-r from-[#033E4A] to-[#046E6E] text-white shadow-md hover:scale-110 transition-transform"
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-3">
        <label className="text-[16px] text-gray-600 font-medium">Select Property:</label>
        <select
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
          className="border rounded-xl w-[300px] px-3 py-2 text-sm focus:outline-none"
        >
          <option value="">-- Choose Property --</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} - {p.address}
            </option>
          ))}
        </select>
      </div>


      {/* Payments Table */}
      <div className="overflow-x-auto">
        <motion.table
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full border-collapse bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <thead>
            <tr className="bg-[#E6F3F4] text-left text-sm text-gray-600">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Property</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border-b text-sm hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  {new Date(p.paidDate || p.dueDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td className="py-3 px-4 font-medium text-gray-800">{p.property}</td>
                <td className="py-3 px-4">{p.tenant}</td>
                <td className="py-3 px-4">{p.type}</td>
                <td className="py-3 px-4 font-semibold text-gray-700">₹{p.amount}</td>
                <td className="py-3 px-4">
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm w-fit ${p.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : p.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {p.paymentStatus === "Paid" && <FiCheckCircle />}
                    {p.paymentStatus === "Pending" && <FiClock />}
                    {p.paymentStatus === "Overdue" && <FiXCircle />}
                    {p.paymentStatus}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {p.paymentStatus === "pending" || p.paymentStatus === "overdue" ? (
                    <button
                      onClick={() => handlePay(p)}
                      className="bg-[#046E6E] text-white px-3 py-1 rounded-xl text-xs shadow hover:bg-[#055E5E] transition"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <button className="bg-[#033E4A] text-white px-3 py-1 rounded-xl text-xs shadow hover:bg-[#046E6E] transition">
                      View
                    </button>
                  )}
                </td>

              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 mt-6"
        >
          No payment records found.
        </motion.p>
      )}

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {manualOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md"
            >
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Add Manual Payment
              </h3>

              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={newPayment.date}
                    onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Property
                  </label>
                  <select
                    value={newPayment.property}
                    onChange={(e) => setNewPayment({ ...newPayment, property: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
                  >
                    <option value="">Select Property</option>
                    <option>2BHK Apartment</option>
                    <option>Luxury Villa</option>
                    <option>Studio Flat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Type
                  </label>
                  <select
                    value={newPayment.type}
                    onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
                  >
                    <option value="">Select Type</option>
                    <option>Rent</option>
                    <option>Utilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Tenant Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tenant name"
                    value={newPayment.tenant}
                    onChange={(e) => setNewPayment({ ...newPayment, tenant: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Tenant Phone
                  </label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    value={newPayment.phone}
                    onChange={(e) => setNewPayment({ ...newPayment, phone: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={newPayment.status}
                    onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
                  >
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Overdue</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setManualOpen(false)}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPayment}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#033E4A] to-[#046E6E] text-white shadow hover:scale-105 transition-transform"
                >
                  Add Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10">
        {/* Trigger Button */}


        {/* Modal */}
        <AnimatePresence>
          {isOpenn && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Pay Rent / Utilities
                  </h3>
                  <button
                    onClick={() => setIsOpenn(false)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {/* Property */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Select Property
                    </label>
                    <select
                      value={payment.property}
                      onChange={(e) =>
                        setPayment({ ...payment, property: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
                    >
                      <option value="">Choose property</option>
                      <option>2BHK Apartment</option>
                      <option>Luxury Villa</option>
                      <option>Studio Flat</option>
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Payment Type
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setPayment({ ...payment, type: "Rent" })}
                        className={`flex-1 px-4 py-2 rounded-lg border flex items-center justify-center gap-2 transition ${payment.type === "Rent"
                          ? "bg-[#033E4A] text-white"
                          : "bg-white text-gray-600"
                          }`}
                      >
                        <FiHome /> Rent
                      </button>
                      <button
                        onClick={() =>
                          setPayment({ ...payment, type: "Utilities" })
                        }
                        className={`flex-1 px-4 py-2 rounded-lg border flex items-center justify-center gap-2 transition ${payment.type === "Utilities"
                          ? "bg-[#046E6E] text-white"
                          : "bg-white text-gray-600"
                          }`}
                      >
                        <FiZap /> Utilities
                      </button>
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={payment.amount}
                      onChange={(e) =>
                        setPayment({ ...payment, amount: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
                    />
                  </div>

                  {/* Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={payment.method}
                      onChange={(e) =>
                        setPayment({ ...payment, method: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#033E4A] outline-none"
                    >
                      <option>UPI</option>
                      <option>Credit Card</option>
                      <option>Debit Card</option>
                      <option>Net Banking</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setIsOpenn(false)}
                    className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePay}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#033E4A] to-[#046E6E] text-white shadow hover:scale-105 transition-transform"
                  >
                    Pay Now
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {bbpsOpen && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Utility Bill Payment
                </h2>

                <div className="space-y-3">
                 {/* 🔹 Service Type Selection */}
<div>
  <label className="text-sm font-medium text-gray-600">Service Type</label>
  <select
    value={selectedServiceType}
    onChange={(e) => {
      setSelectedServiceType(e.target.value);
      setSelectedOperator("");
    }}
    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none"
  >
    <option value="">-- Select Service Type --</option>
    {[...new Set(operators.map((op) => op.ServiceType))].map((type, idx) => (
      <option key={idx} value={type}>
        {type}
      </option>
    ))}
  </select>
</div>

{/* 🔹 Operator Selection */}
<div className="mb-3">
  <label className="text-sm font-medium text-gray-600">Operator</label>
  <select
    value={selectedOperator}
    onChange={(e) => setSelectedOperator(e.target.value)}
    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none"
    disabled={!selectedServiceType}
  >
    <option value="">-- Select Operator --</option>
    {operators
      .filter((op) => op.ServiceType === selectedServiceType)
      .map((op, idx) => (
        <option key={idx} value={op.OperatorCode}>
          {op.OperatorName}
        </option>
      ))}
  </select>
</div>


                  {/* 🔹 Consumer Number */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Consumer / Account Number
                    </label>
                    <input
                      type="text"
                      value={consumerNumber}
                      onChange={(e) => setConsumerNumber(e.target.value)}
                      placeholder="Enter consumer number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none"
                    />
                  </div>

                  {/* 🔹 Amount Field */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Amount</label>
                    <input
                      type="number"
                      value={utilityAmount}
                      onChange={(e) => setUtilityAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none"
                      disabled={!!billDetails} // lock amount if auto-fetched
                    />
                  </div>

                  {/* 🔹 Bill Info (Auto fetched) */}
                  {loadingBill ? (
                    <p className="text-sm text-gray-500 mt-2">
                      Fetching bill details...
                    </p>
                  ) : billDetails ? (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border">
                      <p>
                        <strong>Customer:</strong> {billDetails.name}
                      </p>
                      <p>
                        <strong>Bill No:</strong> {billDetails.billNumber}
                      </p>
                      <p>
                        <strong>Due Date:</strong> {billDetails.dueDate}
                      </p>
                      <p>
                        <strong>Amount:</strong> ₹{utilityAmount}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* 🔹 Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setBbpsOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitUtilityPayment}
                    disabled={loadingBill}
                    className="px-5 py-2 bg-gradient-to-r from-[#033E4A] to-[#046E6E] text-white rounded-lg shadow hover:scale-105 transition disabled:opacity-60"
                  >
                    {loadingBill ? "Please wait..." : "Pay Now"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </div>

  );
}
