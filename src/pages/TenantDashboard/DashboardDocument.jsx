import { useState } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiFileText, FiTrash2, FiDownload, FiEye } from "react-icons/fi";

export default function DashboardTenantDocument() {
  const [category, setCategory] = useState("All");
  const [documents, setDocuments] = useState([
    {
      name: "Aadhar Card - 2BHK.pdf",
      type: "Aadhar Card",
      date: "2025-08-25",
      status: "Verified",
    },
    {
      name: "PAN Card - pdf",
      type: "PAN Card",
      date: "2025-08-10",
      status: "Pending",
    },
    {
      name: "Electricity Bill - Aug.pdf",
      type: "Miscellaneous",
      date: "2025-08-30",
      status: "Verified",
    },
  ]);

  const filteredDocs =
    category === "All"
      ? documents
      : documents.filter((doc) => doc.type === category);

  const handleFileUpload = (e, docType) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map((file) => ({
      name: file.name,
      type: docType,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    }));
    setDocuments((prev) => [...newDocs, ...prev]);
  };

  return (
   <div className="p-6 space-y-6">
  {/* Header */}
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-gradient-to-r from-[#033E4A] to-[#046C73] text-white rounded-2xl p-6 shadow-lg"
  >
    <h2 className="text-2xl font-bold">Documents</h2>
    <p className="text-sm opacity-90">
      Upload and manage your Aadhar Cards, PAN Cards, and more.
    </p>
  </motion.div>

  {/* Category Filters */}
  <div className="flex flex-wrap gap-3">
    {["All", "Aadhar Card", "PAN Card", "Miscellaneous"].map(
      (cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`px-4 py-2 rounded-xl text-sm font-medium shadow transition ${
            category === cat
              ? "bg-[#033E4A] text-white"
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
    {["Aadhar Card", "PAN Card", "Miscellaneous"].map(
      (docType, idx) => (
        <motion.label
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.2 }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-pointer hover:border-[#033E4A] hover:bg-[#F1FAFA] transition"
        >
          <FiUpload className="text-3xl text-gray-500 mb-2" />
          <p className="text-gray-700 font-medium">Upload {docType}</p>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e, docType)}
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
        <tr className="bg-[#F1FAFA] text-left text-sm text-gray-600">
          <th className="py-3 px-4">File Name</th>
          <th className="py-3 px-4">Type</th>
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
              <FiFileText className="text-[#033E4A]" /> {doc.name}
            </td>
            <td className="py-3 px-4">{doc.type}</td>
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
</div>

  );
}
