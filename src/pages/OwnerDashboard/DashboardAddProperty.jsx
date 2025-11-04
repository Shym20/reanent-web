import { Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import PropertyApi from '../../apis/property/property.api'
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { getTokenLocal } from "../../utils/localStorage.util";
import { useParams, useSearchParams } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const DashboardAddProperty = () => {
  const fileInputRef = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);


  const [form, setForm] = useState({
    name: "",
    address: "",
    state: "",
    city: "",
    bed_rooms: 0,
    living_rooms: 0,
    rent: "",
    description: "",
    type: "",
    size: "",
    unit: "sqm",
    kitchen: 0,
    baths: 0,
    condition: "",
    furnishing: "",
    status: "rent",
    location: "",
    images: [],
    imageFiles: [],
  });

  const { id: editId } = useParams();
  const isEditMode = Boolean(editId);


  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!isEditMode) return;

      try {
        const propertyApi = new PropertyApi();
        const res = await propertyApi.getPropertyDetail(editId);
        if (res?.data) {
          const p = res.data.propertyDetails;

          console.log("p is here :", p);

          // Prefill form
          setForm({
            name: p.name || "",
            address: p.address || "",
            state: p.location || "",
            city: p.city || "",
            bed_rooms: p.bed_rooms || 0,
            living_rooms: p.living_rooms || 0,
            rent: p.rent || "",
            description: p.description || "",
            type: p.type || "",
            size: p.sizeV2?.split(" ")[0] || 0,
            unit: p.sizeV2?.split(" ")[1] || "sqm",
            kitchen: p.kitchen || 0,
            baths: p.baths || 0,
            condition: p.condition || "",
            furnishing: p.furnishing || "",
            status: p.status || "rent",
            location: p.location || "",
            images: p.images || [],
            imageFiles: [],
          });

          // Set image previews
          setImagePreviews(p.images || []);
        }
      } catch (err) {
        console.error("Failed to fetch property details:", err);
        toast.error("Failed to load property for editing");
      }
    };

    fetchPropertyDetails();
  }, [isEditMode, editId]);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // handle checkbox / radio specially
    if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
      return;
    }
    if (type === "radio") {
      // radio value may be "true"/"false" strings
      if (value === "true" || value === "false") {
        setForm((p) => ({ ...p, [name]: value === "true" }));
      } else {
        setForm((p) => ({ ...p, [name]: value }));
      }
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const onAppliancesChange = (e) => {
    // appliances radio in your UI (yes/no) -> map to kitchen boolean
    const val = e.target.value === "yes";
    setForm((p) => ({ ...p, kitchen: val }));
  };

  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // show previews immediately
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // 🔹 Upload files to server as soon as selected
    try {
      const uploadedUrls = await uploadImagesToServer(files);

      // 🔹 Add URLs directly into form.images
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));

      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload images");
    } finally {
      // clear file input
      e.target.value = "";
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Helper: parse numeric string with currency/comma into number
  const parseNumber = (val) => {
    if (val === undefined || val === null || val === "") return null;
    if (typeof val === "number") return val;
    const onlyDigits = String(val).replace(/[^\d.-]/g, "");
    if (!onlyDigits) return null;
    return Number(onlyDigits);
  };

  const token = getTokenLocal();
  console.log("The token isss : ", token);


  const uploadImagesToServer = async (files) => {
    if (!files || !files.length) return [];

    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`${API_BASE_URL}/api/user/s3/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const data = await res.json();
        if (data?.data?.url) {
          uploadedUrls.push(data.data.url);
        }
      } catch (err) {
        console.error("Image upload failed", err);
        toast.error(`Failed to upload: ${file.name}`);
      }
    }

    return uploadedUrls;
  };

  const deleteImageFromServer = async (imageUrl) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/s3/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: imageUrl }),
      });

      if (!res.ok) throw new Error("Failed to delete image");
      const data = await res.json();

      if (data?.code === 201) {
        toast.success("Image deleted successfully");
      } else {
        toast.error("Failed to delete image");
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      toast.error("Error deleting image");
    }
  };


  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      if (!form.name || !form.address || !form.city || !form.type) {
        alert("Please fill required fields: name, address, city, property type");
        return;
      }



      const normalizeLocation = (city) =>
        city ? city.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") : "";

      const payload = {
        name: form.name,
        state: form.state,
        city: form.city,
        size: form.size,
        sizeV2: `${form.size} ${form.unit || "sqm"}`,
        kitchen: Number(form.kitchen) || 0,
        condition: form.condition,
        furnishing: form.furnishing,
        address: form.address,
        location: normalizeLocation(form.city),
        type: form.type,
        rent: Number(form.rent) || 0,
        living_rooms: Number(form.living_rooms) || 0,
        bed_rooms: Number(form.bed_rooms) || 0,
        baths: Number(form.baths) || 0,
        description: form.description,
        images: form.images,
        status: form.status,
      };

      const propertyApi = new PropertyApi();
      let res;

      if (isEditMode) {
        // 🔹 Update API
        res = await propertyApi.editProperty(editId, payload);
      } else {
        // 🔹 Create API
        res = await propertyApi.postProperty({
          ...payload,
          property_id: "PROP-" + Date.now(),
          owner: "68b945a33f4407e55853a9e9",
        });
      }

      if (res?.status === "success" || res?.status === 200 || res?.status === 201) {
        toast.success(isEditMode ? "Property updated successfully" : "Property added successfully");
        if (!isEditMode) {
          // reset only for new property
          setForm({
            name: "",
            address: "",
            state: "",
            city: "",
            rent: "",
            description: "",
            type: "",
            size: "",
            unit: "",
            kitchen: 0,
            baths: 0,
            condition: "",
            furnishing: "",
            status: "rent",
            location: "",
            images: [],
            imageFiles: [],
            rooms: "",
          });
          setImagePreviews([]);
        }
      } else {
        toast.error("Failed to save property");
      }
    } catch (err) {
      console.error("Error saving property:", err);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <>
      <section className="bg-white p-4 sm:p-6 md:p-8 lg:px-24 rounded-2xl">
        <div className="mb-10 mt-4">
          <h2 className="text-2xl font-bold text-[#24292E]">
            {isEditMode ? "Edit Property Details" : "Fill up the details to Add Property"}
          </h2>
        </div>

        <div className="flex  flex-col gap-6">
          {/* Top disabled address (kept as in your UI) */}

          {/* Google Map iframe (unchanged) */}
          {/* <div className="w-full h-96 rounded-xl overflow-hidden">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.1732057595226!2d75.78727087534477!3d26.91243387667133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db3a36e1f4d63%3A0xfbc93ef3db3e3f9!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1692878430234!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div> */}

          {/* Property Name */}
          <div>
            <label htmlFor="propertyName" className="text-md font-semibold text-gray-700">
              Property Name
            </label>
            <input
              id="propertyName"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Add Your Property Name"
              className="mt-2 w-full border border-gray-300 rounded-xl p-3 placeholder-black focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Property Address Textarea */}
          <div>
            <label htmlFor="propertyAddress" className="text-md font-semibold text-gray-700">
              Property Address
            </label>
            <textarea
              id="propertyAddress"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              placeholder="Property Address"
              className="mt-2 w-full border border-gray-300 rounded-xl p-3 placeholder-black focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* State & City */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label htmlFor="state" className="text-md font-semibold text-gray-700">
                State
              </label>
              <select
                id="state"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Select State</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="city" className="text-md font-semibold text-gray-700">
                City
              </label>
              <select
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Select City</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>
          </div>

          {/* Profile Pictures Upload */}
          <div className="flex flex-col gap-2 my-6">
            <label htmlFor="photos" className="text-md font-semibold text-gray-700">
              Property Photos
            </label>

            <div className="mt-1 flex flex-wrap gap-4">
              {/* Render previews dynamically */}
              {imagePreviews.map((preview, idx) => (
                <div
                  key={idx}
                  className="relative w-50 h-44 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={preview}
                    alt={`preview-${idx}`}
                    className="object-cover w-full h-full"
                  />
                  {/* delete button */}
                  <button
                    type="button"
                    onClick={async () => {
                      const imageUrl = form.images[idx]; // get actual S3 URL

                      // 1️⃣ Delete from server first
                      if (imageUrl) {
                        await deleteImageFromServer(imageUrl);
                      }

                      // 2️⃣ Then update local state
                      const newPreviews = [...imagePreviews];
                      const newImages = [...form.images];
                      newPreviews.splice(idx, 1);
                      newImages.splice(idx, 1);

                      setImagePreviews(newPreviews);
                      setForm((prev) => ({ ...prev, images: newImages }));
                    }}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-80"
                  >
                    ×
                  </button>

                </div>
              ))}

              {/* Add More Box */}
              <div
                onClick={openFilePicker}
                className="w-14 h-44 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50"
              >
                <Plus className="w-6 h-6 text-black" />
              </div>

              {/* hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesSelected}
                style={{ display: "none" }}
              />
            </div>

          </div>


          {/* Pricing (rent) */}

          <div>
            <label htmlFor="TotalPrice" className="text-md font-semibold text-gray-700">
              Rent per month
            </label>
            <input
              id="TotalPrice"
              name="rent"
              type="text"
              value={form.rent}
              onChange={handleChange}
              placeholder="₹18000/month"
              className="mt-2 w-full border border-gray-300 rounded-xl p-3 placeholder-black focus:outline-none focus:ring-2 text-bold text-xl focus:ring-gray-500"
            />
          </div>

          {/* Property Details (kept disabled like your UI) */}

          {/* Description */}
          <div>
            <label htmlFor="propertyDescription" className="text-md font-semibold text-gray-700">
              Description
            </label>
            <textarea
              id="propertyDescription"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Write Here"
              className="mt-2 w-full border border-gray-300 rounded-xl p-3 placeholder-black focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Property Type */}
          <div className="w-1/2">
            <label htmlFor="propertyType" className="text-md font-semibold text-gray-700">
              Property Type
            </label>
            <select
              id="propertyType"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select Property Type</option>
              <option value="apartment_flat">Apartment Flat</option>
              <option value="villa">Villa</option>
              <option value="house">House</option>
              <option value="studio_apartment">Studio Apartment</option>
              <option value="serviced_apartment">Serviced Apartment</option>
            </select>
          </div>

          {/* Property Size */}
          <div>
            <div className="w-full border border-gray-300 rounded-xl p-4">
              <p className="text-black font-bold text-lg mb-3">Property Size</p>


              <div className="relative mt-2">
                <input
                  id="size"
                  name="size"
                  type="number"
                  value={form.size}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-xl p-3 pr-28 placeholder-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className="absolute inset-y-1 right-2 border-l border-gray-300 bg-white rounded-r-xl px-3 focus:outline-none "
                >
                  <option value="sqm">sqm</option>
                  <option value="sqft">sq ft</option>
                  <option value="sqyard">sq yard</option>
                </select>
              </div>

            </div>
          </div>

          {/* Interior Block */}
          <div className="w-full border border-gray-300 rounded-xl p-4">
            <div>
              <p className="text-black font-bold text-md mb-6">Kitchen Information</p>

              <div className="flex items-center gap-4 mb-4">
                <label htmlFor="noOfKitchens" className="text-md font-semibold text-gray-700">
                  No. of Kitchens -
                </label>
                <input
                  id="noOfKitchens"
                  name="kitchen"
                  type="number"
                  value={form.kitchen}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-24 border border-gray-300 rounded-xl p-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-[#dbb96f]"
                />
              </div>

              <hr className="my-6 border-gray-300" />

              <p className="text-black font-bold text-md mb-6">Bathroom Information</p>

              <div className="flex items-center gap-4 mb-4">
                <label htmlFor="noOfBathrooms" className="text-md font-semibold text-gray-700">
                  No. of Bathrooms -
                </label>
                <input
                  id="noOfBathrooms"
                  name="baths"
                  type="number"
                  value={form.baths}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-24 border border-gray-300 rounded-xl p-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-[#dbb96f]"
                />
              </div>

              <hr className="my-6 border-gray-300" />

              <p className="text-black font-bold text-md mb-6">Living Room Information</p>

              <div className="flex items-center gap-4 mb-4">
                <label htmlFor="noOfLivingrooms" className="text-md font-semibold text-gray-700">
                  No. of Living Rooms -
                </label>
                <input
                  id="noOfLivingrooms"
                  name="living_rooms"  // ⬅️ updated
                  type="number"
                  value={form.living_rooms}
                  onChange={handleChange}
                  className="w-24 border border-gray-300 rounded-xl p-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-[#dbb96f]"
                />
              </div>

              <hr className="my-6 border-gray-300" />

              <p className="text-black font-bold text-md mb-6">Bedroom Information</p>

              <div className="flex items-center gap-4 mb-4">
                <label htmlFor="noOfBedrooms" className="text-md font-semibold text-gray-700">
                  No. of Bedrooms -
                </label>
                <input
                  id="noOfBedrooms"
                  name="bed_rooms"   // ⬅️ updated
                  type="number"
                  value={form.bed_rooms}
                  onChange={handleChange}
                  className="w-24 border border-gray-300 rounded-xl p-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-[#dbb96f]"
                />
              </div>
            </div>
          </div>

          {/* Condition & Furnishing */}
          <div>
            <div className="w-full border border-gray-300 rounded-xl p-4">
              <div className="flex gap-6">
                <div className="flex-1">
                  <label htmlFor="condition" className="text-md font-semibold text-gray-700 block mb-2">
                    Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#dbb96f]"
                  >
                    <option value="">Select Condition</option>
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Need Renovation">Needs Renovation</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label htmlFor="furnishing" className="text-md font-semibold text-gray-700 block mb-2">
                    Furnishing
                  </label>
                  <select
                    id="furnishing"
                    name="furnishing"
                    value={form.furnishing}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#dbb96f]"
                  >
                    <option value="">Select Furnishing</option>
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi Furnished">Semi-Furnished</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`bg-[#033e4a] text-white py-3 px-16 font-semibold rounded-lg ${submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {submitting ? "Saving..." : isEditMode ? "Update Property" : "Save"}
            </button>

          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardAddProperty;
