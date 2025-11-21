import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiFileText, FiTrash2, FiDownload, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";
import PropertyApi from "../../apis/property/property.api";
import DocumentApi from "../../apis/document/document.api";
import { getTokenLocal, getUserLocal } from "../../utils/localStorage.util";
import { useLocation } from "react-router-dom";


export default function DashboardDocument() {
  const [category, setCategory] = useState("All");
  const [documents, setDocuments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState("");
  const token = getTokenLocal();
  const user = getUserLocal();
  const location = useLocation();
  const initialPropertyId = location.state?.propertyId || "";
  const [selectedProperty, setSelectedProperty] = useState(initialPropertyId);


  const userId = user?.userId;


  console.log("Myy user : ", user.userId);

  const documentApi = new DocumentApi();
  const propertyApi = new PropertyApi();

  // ------------------------------
  // Fetch only properties that have tenants
  // ------------------------------
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await propertyApi.getMyProperties();
        const rawProps = res?.data?.properties || [];

        // Filter only occupied properties having tenants
        const activeProps = rawProps.filter(
          (p) => p?.tenants && p.tenants.length > 0
        );

        const formatted = activeProps.map((p) => ({
          id: p.property_id,
          name: p.name,
          tenants: p.tenants,
        }));

        setProperties(formatted);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);


  const fetchDocuments = async () => {
    if (!selectedProperty) return; // Only run if property selected
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
          propertyName: prop?.name || "N/A",
          propertyId: selectedProperty,
          date: new Date(doc.uploadedAt).toLocaleDateString("en-IN"),
          url: doc.url,
          id: doc.id,
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
  // Upload files to S3
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
  // Confirm upload (send to backend)
  // ------------------------------
  const handleUploadConfirm = async () => {
    if (!selectedProperty) return toast.warn("Please select a property");

    try {
      toast.info("Uploading documents...");
      const uploaded = await uploadFilesToS3(selectedFiles);

      // For each file uploaded to S3, call document upload API
      for (const file of uploaded) {
        const body = {
          propertyId: selectedProperty,
          name: file.name,
          type: selectedDocType,
          url: file.url,
        };

        const res = await documentApi.uploadDocument(body);
        if (res?.data?.status === "success") {
          setDocuments((prev) => [
            {
              name: file.name,
              type: selectedDocType,
              propertyName:
                properties.find((p) => p.id === selectedProperty)?.name || "",
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
      toast.error("Failed to upload document");
    } finally {
      setShowModal(false);
      setSelectedFiles([]);
      setSelectedProperty("");
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
        className="bg-gradient-to-r from-[#D7B56D] to-[#c09d4f] text-white rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold">Documents</h2>
        <p className="text-sm opacity-90">
          Upload and manage your Rent Agreements, Property Documents, and more.
        </p>
      </motion.div>

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
                {prop.name}
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
                  ? "bg-[#D7B56D] text-white"
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
            <tr className="bg-[#F9F5EC] text-left text-sm text-gray-600">
              <th className="py-3 px-4">File Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Property Name</th>
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
                  <FiFileText className="text-[#D7B56D]" /> {doc.name}
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
          No documents found.
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

            {loading ? (
              <p className="text-sm text-gray-500">Loading properties...</p>
            ) : (
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-[#D7B56D] outline-none"
              >
                <option value="">-- Choose a Property --</option>
                {properties.map((prop, idx) => (
                  <option key={idx} value={prop.id}>
                    {prop.name}
                  </option>
                ))}
              </select>
            )}

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
                className={`px-4 py-2 rounded-lg ${selectedProperty
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
