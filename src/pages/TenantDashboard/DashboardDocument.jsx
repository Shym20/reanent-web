import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiFileText, FiTrash2, FiDownload, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";
import TenantApi from "../../apis/tenant/tenant.api";
import { getTokenLocal, getUserLocal } from "../../utils/localStorage.util";
import DocumentApi from "../../apis/document/document.api";
import { useLocation } from "react-router-dom";

export default function DashboardTenantDocument() {
  const [properties, setProperties] = useState([]);
  const [category, setCategory] = useState("All");
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const initialPropertyId = location.state?.propertyId || "";
  const [selectedProperty, setSelectedProperty] = useState(initialPropertyId);

  const token = getTokenLocal();
  const tenantApi = new TenantApi();
  const documentApi = new DocumentApi();
  const user = getUserLocal();

  const userId = user?.userId;

  // ------------------------------
  // Fetch tenant's current stays
  // ------------------------------
  useEffect(() => {
    const fetchCurrentStay = async () => {
      try {
        const res = await tenantApi.getMyCurrentStay();
        if (res?.status === "success") {
          const formattedData = res.data.map((item) => ({
            id: item.property.property_id,
            title: item.property.name,
            address: item.property.address,
          }));
          setProperties(formattedData);
        } else {
          toast.error(res?.message || "Failed to fetch current stays");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong while fetching properties");
      }
    };
    fetchCurrentStay();
  }, []);

  const fetchDocuments = async () => {
    if (!selectedProperty) return;
    try {
      setLoading(true);
      const res = await documentApi.getDocument(selectedProperty);

      if (res?.status === "success" && Array.isArray(res.data)) {
        const prop = properties.find((p) => p.id === selectedProperty);
        const ownerDocs = res.data.filter(
          (doc) => doc.uploadedBy?.userId === userId
        );

        const formattedDocs = ownerDocs.map((doc) => ({
          name: doc.name,
          type: doc.type || "N/A",
          propertyName: prop?.title || "N/A",
          propertyId: selectedProperty,
          date: new Date(doc.uploadedAt).toLocaleDateString("en-IN"),
          url: doc.url,
          id: doc._id,
        }));

        setDocuments(formattedDocs);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (selectedProperty) fetchDocuments(); }, [selectedProperty]);

  // ------------------------------
  // Upload file to S3
  // ------------------------------
  const uploadFilesToS3 = async (files) => {
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/s3/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) throw new Error(`Upload failed for ${file.name}`);

        const data = await res.json();
        const url = data?.data?.url;
        if (url) uploadedUrls.push({ name: file.name, url });
      } catch (err) {
        console.error("S3 upload failed:", err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    return uploadedUrls;
  };

  // ------------------------------
  // Handle file selection
  // ------------------------------
  const handleFileSelection = (e, docType) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setSelectedFiles(files);
    setSelectedDocType(docType);
    setShowModal(true);
  };

  // ------------------------------
  // Confirm upload
  // ------------------------------
  const handleUploadConfirm = async () => {
    if (!selectedProperty) return toast.warn("Please select a property");

    try {
      setLoading(true);
      toast.info("Uploading documents...");

      const uploaded = await uploadFilesToS3(selectedFiles);
      for (const file of uploaded) {
        const body = {
          propertyId: selectedProperty,
          name: file.name,
          type: selectedDocType,
          url: file.url,
        };

        const res = await documentApi.uploadDocument(body);
        if (res?.status === "success") {
          setDocuments((prev) => [
            {
              name: file.name,
              type: selectedDocType,
              propertyName:
                properties.find((p) => p.id === selectedProperty)?.title || "",
              date: new Date().toISOString().split("T")[0],
              status: "Pending",
            },
            ...prev,
          ]);
        }
      }

      toast.success("Documents uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload documents");
    } finally {
      setShowModal(false);
      setSelectedFiles([]);
      setSelectedProperty("");
      setLoading(false);
    }
  };

  const filteredDocs =
    category === "All"
      ? documents
      : documents.filter((doc) => doc.type === category);

  // ------------------------------
  // UI Rendering
  // ------------------------------
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
          Upload and manage your Aadhar Cards, PAN Cards, and other documents.
        </p>
      </motion.div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Aadhar Card", "PAN Card", "Miscellaneous"].map((docType, idx) => (
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
              onChange={(e) => handleFileSelection(e, docType)}
            />
          </motion.label>
        ))}
      </div>

      {/* Property Selector + Category Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
        {/* Property Selector */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Property
          </label>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="border rounded-lg px-3 py-2 w-64  outline-none"
          >
            <option value="">-- Choose Property --</option>
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.title}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3">
          {["All", "Rent Agreement", "Property Document", "Miscellaneous"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium shadow transition ${category === cat
                    ? "bg-[#033E4A] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
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
              <th className="py-3 px-4">Property</th>
              <th className="py-3 px-4">Upload date</th>
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
                <td className="py-3 px-4">{doc.propertyName}</td>
                <td className="py-3 px-4">{doc.date}</td>
                <td className="py-3 px-4 flex gap-3">
                  {/* View File */}
                  <button
                    onClick={() => window.open(doc.url, "_blank")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEye />
                  </button>

                  {/* Delete File */}

                  <button
                    onClick={async () => {
                      try {
                        const res = await documentApi.deleteDocument(doc.id);
                        if (res?.status === "success") {
                          setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
                          toast.success("Document deleted");
                        } else {
                          toast.error(res?.message || "Delete failed");
                        }
                      } catch (err) {
                        console.error(err);
                        toast.error("Error deleting document");
                      }
                    }}
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
              className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-[#046C73] outline-none"
            >
              <option value="">-- Choose a Property --</option>
              {properties.map((prop, idx) => (
                <option key={idx} value={prop.id}>
                  {prop.title} — {prop.address}
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
                disabled={!selectedProperty || loading}
                className={`px-4 py-2 rounded-lg ${selectedProperty
                    ? "bg-[#046C73] text-white hover:bg-[#03525C]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
