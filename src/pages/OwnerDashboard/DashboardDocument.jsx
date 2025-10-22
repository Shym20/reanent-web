import { useState } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiFileText, FiTrash2, FiDownload, FiEye } from "react-icons/fi";

export default function DashboardDocument() {
  const [category, setCategory] = useState("All");
  const [documents, setDocuments] = useState([
    {
      name: "Rent Agreement - 2BHK.pdf",
      type: "Rent Agreement",
      propertyName: "2BHK Apartment",
      date: "2025-08-25",
      status: "Verified",
    },
    {
      name: "Property Deed - Villa.pdf",
      type: "Property Document",
      propertyName: "Luxury Villa",
      date: "2025-08-10",
      status: "Pending",
    },
  ]);

  // ✅ This should ideally come from backend API
  const [properties] = useState([
    "2BHK Apartment",
    "Luxury Villa",
    "Greenwood Residency",
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");

  const filteredDocs =
    category === "All"
      ? documents
      : documents.filter((doc) => doc.type === category);

  const handleFileSelection = (e, docType) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setSelectedFiles(files);
    setSelectedDocType(docType);
    setShowModal(true); // open modal for selecting property
  };

  const handleUploadConfirm = () => {
    if (!selectedProperty) return;

    const newDocs = selectedFiles.map((file) => ({
      name: file.name,
      type: selectedDocType,
      propertyName: selectedProperty,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    }));

    setDocuments((prev) => [...newDocs, ...prev]);
    setShowModal(false);
    setSelectedFiles([]);
    setSelectedProperty("");
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
        <h2 className="text-2xl font-bold">Documents</h2>
        <p className="text-sm opacity-90">
          Upload and manage your Rent Agreements, Property Documents, and more.
        </p>
      </motion.div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3">
        {["All", "Rent Agreement", "Property Document", "Miscellaneous"].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium shadow transition ${
                category === cat
                  ? "bg-[#D7B56D] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Rent Agreement", "Property Document", "Miscellaneous"].map(
          (docType, idx) => (
            <motion.label
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-pointer hover:border-[#D7B56D] hover:bg-[#FDF8EE] transition"
            >
              <FiUpload className="text-3xl text-gray-500 mb-2" />
              <p className="text-gray-700 font-medium">Upload {docType}</p>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelection(e, docType)}
              />
            </motion.label>
          )
        )}
      </div>

      {/* Document List */}
      <div className="overflow-x-auto">
        <motion.table
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full border-collapse bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <thead>
            <tr className="bg-[#F9F5EC] text-left text-sm text-gray-600">
              <th className="py-3 px-4">File Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Property Name</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border-b text-sm hover:bg-gray-50"
              >
                <td className="py-3 px-4 flex items-center gap-2">
                  <FiFileText className="text-[#D7B56D]" /> {doc.name}
                </td>
                <td className="py-3 px-4">{doc.type}</td>
                <td className="py-3 px-4">{doc.propertyName}</td>
                <td className="py-3 px-4">{doc.date}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      doc.status === "Verified"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {doc.status}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FiEye />
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    <FiDownload />
                  </button>
                  <button
                    onClick={() =>
                      setDocuments((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 mt-6"
        >
          No documents found in this category.
        </motion.p>
      )}

      {/* Modal for property selection */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 shadow-xl w-96"
          >
            <h3 className="text-lg font-semibold mb-4">Select Property</h3>

            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-[#D7B56D] outline-none"
            >
              <option value="">-- Choose a Property --</option>
              {properties.map((prop, idx) => (
                <option key={idx} value={prop}>
                  {prop}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedFiles([]);
                  setSelectedProperty("");
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadConfirm}
                disabled={!selectedProperty}
                className={`px-4 py-2 rounded-lg ${
                  selectedProperty
                    ? "bg-[#D7B56D] text-white hover:bg-[#c09d4f]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Upload
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
