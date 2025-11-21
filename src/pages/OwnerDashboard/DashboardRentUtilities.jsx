import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCheckCircle, FiClock, FiXCircle, FiX, FiPlus } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import PropertyApi from "../../apis/property/property.api";
import PaymentApi from "../../apis/payment/payment.api";
import { toast } from "react-toastify";
import { getTokenLocal } from "../../utils/localStorage.util";

const propertyApi = new PropertyApi();
const paymentApi = new PaymentApi();

export default function DashboardRentUtilities() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState("");
  const [billerInputs, setBillerInputs] = useState([]);
  const [billerValues, setBillerValues] = useState({});
  const [billDetails, setBillDetails] = useState(null);
  const [loadingBill, setLoadingBill] = useState(false);
  const token = getTokenLocal();



  const [newPayment, setNewPayment] = useState({
    date: "",
    property: "",
    propertyId: "",
    tenant: "",
    phone: "",
    amount: "",
    type: "Rent",
    status: "Paid",
  });


  const filteredPayments = payments.filter(
    (p) =>
      (filter === "All" || p.status === filter) &&
      (p.tenant.toLowerCase().includes(search.toLowerCase()) ||
        p.property.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddPayment = async () => {
    try {
      // Basic validation
      if (!newPayment.propertyId || !newPayment.tenantId || !newPayment.amount || !newPayment.date) {
        toast.warn("Please fill all required fields.");
        return;
      }

      // Prepare request body (matching API schema)
      const reqBody = {
        tenantId: newPayment.tenantId,
        propertyId: newPayment.propertyId,
        amount: Number(newPayment.amount),
        dueDate: newPayment.date,
        type: newPayment.type,
        paymentMethod: "Cash",
        paymentStatus: newPayment.status.toLowerCase(),
      };

      // API call
      const res = await paymentApi.postProperty(reqBody);

      if (res?.status == "success") {
        toast.success("Manual payment added successfully!");

        setPayments((prev) => [...prev, newPayment]);
        setManualOpen(false);
        setNewPayment({
          date: "",
          property: "",
          propertyId: "",
          tenant: "",
          tenantId: "",
          phone: "",
          amount: "",
          type: "Rent",
          status: "Paid",
        });
      } else {
        toast.error(res?.message || "Failed to add payment.");
      }
    } catch (err) {
      console.error("Payment entry error:", err);
      toast.error("Something went wrong while adding payment.");
    }
  };


  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await propertyApi.getMyProperties();
        const allProps = res.data?.properties || [];

        const occupiedProps = allProps.filter(
          (p) => Array.isArray(p.tenants) && p.tenants.length > 0
        );

        setProperties(occupiedProps);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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

  const fetchOperators = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/property/payment/bbps/operators`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (data?.status === "success") {
        const allOps = data.data || [];

        // Define utility categories we care about
        const utilityCategories = [
          "Electricity",
          "Water",
          "GAS",
          "Broadband",
          "Landline Postpaid",
          "Municipal Services",
          "Municipal Taxes",
          "Housing Society",
          "LPG Gas",
        ];

        // Filter only the utility-related operators
        const utilityOps = allOps.filter((op) =>
          utilityCategories.includes(op.ServiceType)
        );

        // Group operators by ServiceType
        const grouped = utilityCategories
          .filter((cat) => utilityOps.some((op) => op.ServiceType === cat))
          .map((cat) => ({
            category: cat,
            operators: utilityOps
              .filter((op) => op.ServiceType === cat)
              .sort((a, b) => a.OperatorName.localeCompare(b.OperatorName)),
          }));

        setOperators(grouped);

        console.log("✅ Grouped Operators:", grouped);
      } else {
        toast.error("Failed to fetch operators.");
      }
    } catch (err) {
      console.error("Error fetching operators:", err);
      toast.error("Error fetching operators.");
    }
  };


  const fetchBillerInfo = async (operatorCode) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/property/payment/bbps/get-billerinfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ operator: operatorCode }),
      });

      const data = await res.json();
      if (data?.status === "success") {
        setBillerInputs(data.data.Request || []);
      } else {
        toast.error("Failed to get biller info.");
      }
    } catch (err) {
      console.error("Error fetching biller info:", err);
    }
  };

  const fetchBill = async () => {
    if (!selectedOperator || Object.keys(billerValues).length === 0) {
      toast.warn("Please fill all biller fields first.");
      return;
    }

    setLoadingBill(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/property/payment/bbps/fetch-bill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
       body: JSON.stringify({
  operator: selectedOperator,
  requestData: billerValues, 
}),
      });

      const data = await res.json();
      if (data?.status === "success") {
        setBillDetails(data.data);
        setNewPayment({
          ...newPayment,
          amount: data.data.amount,
          date: data.data.dueDate,
        });
      } else {
        toast.warn("No bill found or invalid details.");
        setBillDetails(null);
      }
    } catch (err) {
      console.error("Fetch bill error:", err);
      toast.error("Error fetching bill.");
    } finally {
      setLoadingBill(false);
    }
  };


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-[#D7B56D] to-[#c09d4f] text-white rounded-2xl p-6 shadow-lg"
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
          <button
            onClick={() => setManualOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#D7B56D] to-[#B28C3F] text-white px-4 py-2 rounded-xl text-sm shadow-md hover:scale-105 transition-transform"
          >
            <FiPlus /> Create Manually
          </button>
        </div>

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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
            <tr className="bg-[#F9F5EC] text-left text-sm text-gray-600">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Property</th>
              <th className="py-3 px-4">Tenant</th>
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
                <td className="py-3 px-4">{p.date}</td>
                <td className="py-3 px-4 font-medium text-gray-800">
                  {p.property}
                </td>
                <td className="py-3 px-4">{p.tenant}</td>
                <td className="py-3 px-4">{p.type}</td>
                <td className="py-3 px-4 font-semibold text-gray-700">
                  ₹{p.amount}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm w-fit ${p.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : p.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {p.status === "Paid" && <FiCheckCircle />}
                    {p.status === "Pending" && <FiClock />}
                    {p.status === "Overdue" && <FiXCircle />}
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="bg-[#D7B56D] text-white px-3 py-1 rounded-xl text-xs shadow hover:bg-[#c09d4f] transition">
                    View
                  </button>
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white/95 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Add Manual Payment
                </h3>
                <button
                  onClick={() => setManualOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Payment Date */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={newPayment.date}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, date: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm  transition"
                  />
                </div>

                {/* Property */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property
                  </label>
                  <select
                    value={newPayment.propertyId} // 👈 Now bound to ID, not name
                    onChange={(e) => {
                      const selectedPropertyId = e.target.value;
                      const selectedProp = properties.find(
                        (p) => p.property_id === selectedPropertyId
                      );

                      if (selectedProp && selectedProp.tenants.length > 0) {
                        const tenant = selectedProp.tenants[0]; // assuming one active tenant
                        setNewPayment({
                          ...newPayment,
                          propertyId: selectedPropertyId,  // 👈 Save ID
                          property: selectedProp.name,     // 👈 For display later
                          tenant: tenant.fullName,
                          phone: tenant.mobileNumber,
                          tenantId: tenant.userId, // optional for API
                        });
                      } else {
                        setNewPayment({
                          ...newPayment,
                          propertyId: "",
                          property: "",
                          tenant: "",
                          phone: "",
                        });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm transition"
                  >
                    <option value="">Select Property</option>
                    {properties.map((p) => (
                      <option key={p.property_id} value={p.property_id}>
                        {p.name}
                      </option>
                    ))}
                  </select>


                </div>


                {/* Tenant Name */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tenant Name
                  </label>
                  <input
                    type="text"
                    placeholder="Select Property for Tenant name"
                    value={newPayment.tenant}
                    readOnly
                    className="w-full border border-gray-300 bg-gray-100 rounded-lg px-3 py-2 text-sm shadow-sm cursor-not-allowed"
                  />

                </div>

                {/* Type */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newPayment.type}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewPayment({ ...newPayment, type: val });

                      // 👇 when type is Utility, trigger operator list
                      if (val === "Utility") {
                        fetchOperators();
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm transition"
                  >
                    <option value="">Select Type</option>
                    <option value="Rent">Rent</option>
                    <option value="Utility">Utilities</option>
                  </select>

                </div>

                {/* If type === Utility, show BBPS UI */}
                {newPayment.type === "Utility" && (
                  <>
                    {/* Operator Dropdown */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operator
                      </label>
                      <select
                        value={selectedOperator}
                        onChange={(e) => {
                          const op = e.target.value;
                          setSelectedOperator(op);
                          fetchBillerInfo(op);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm transition"
                      >
                        <option value="">Select Operator</option>
                        {operators.map((group) => (
                          <optgroup key={group.category} label={group.category}>
                            {group.operators.map((op) => (
                              <option key={op.OperatorCode} value={op.OperatorCode}>
                                {op.OperatorName}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>

                    </div>

                    {/* Dynamic Biller Input Fields */}
                    {billerInputs.map((input, idx) => (
                      <div key={idx} className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {input.Key}
                        </label>
                        <input
                          type="text"
                          placeholder={input.Value}
                          value={billerValues[input.Key] || ""}
                          onChange={(e) =>
                            setBillerValues({ ...billerValues, [input.Key]: e.target.value })
                          }

                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm transition"
                        />

                      </div>
                    ))}

                    {/* Fetch Bill Button */}
                    {billerInputs.length > 0 && (
                      <div className="col-span-2 flex justify-end">
                        <button
                          onClick={fetchBill}
                          disabled={loadingBill}
                          className="px-4 py-2 bg-[#D7B56D] text-white rounded-lg shadow hover:bg-[#b28c3f] transition"
                        >
                          {loadingBill ? "Fetching Bill..." : "Fetch Bill"}
                        </button>
                      </div>
                    )}

                    {/* Bill Details Display */}
                    {billDetails && (
                      <div className="col-span-2 bg-gray-50 p-3 rounded-lg text-sm text-gray-700 space-y-1">
                        <p><b>Customer:</b> {billDetails.customerName}</p>
                        <p><b>Due Date:</b> {billDetails.dueDate}</p>
                        <p><b>Amount:</b> ₹{billDetails.amount}</p>
                      </div>
                    )}
                  </>
                )}


                {/* Amount */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={newPayment.amount}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, amount: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm transition"
                  />
                </div>

                {/* Payment Status */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={newPayment.status}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, status: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm transition"
                  >
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Overdue</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setManualOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddPayment}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#D7B56D] to-[#B28C3F] text-white font-semibold shadow-md hover:shadow-lg transition"
                >
                  Add Payment
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
