import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import ProfileApi from "../../apis/profile/profile.api";
import { motion } from "framer-motion";
import { FiEdit2, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/redux-slice/user.slice";
import { getTokenLocal } from "../../utils/localStorage.util";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const DashboardProfilePage = () => {
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");
  const token = getTokenLocal();

  const profileApi = new ProfileApi();

  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileApi.getProfile();
        setProfile(res?.data?.user || {});
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchSurveyAnswers = async () => {
      try {
        const res = await profileApi.getSurveyAnswers();
        if (res?.status === "success") {
          const surveyData = Array.isArray(res.data?.questions) ? res.data.questions : [];
          setQuestions(surveyData);

          // Map answers using _id
          const mappedAnswers = {};
          surveyData.forEach((q) => {
            mappedAnswers[q._id] = q.answer || "";
          });
          setAnswers(mappedAnswers);
        }
      } catch (err) {
        console.error("Error fetching survey answers:", err);
      }
    };
    fetchSurveyAnswers();
  }, []);

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`${API_BASE_URL}api/user/s3/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) throw new Error(`Upload failed for ${file.name}`);
        const data = await res.json();
        if (data?.data?.url) {
          setImage(data.data.url);
          setProfile((prev) => ({ ...prev, profilePicture: data.data.url }));
          toast.success("Image uploaded successfully");
        }
      } catch (err) {
        console.error("Image upload failed", err);
        toast.error(`Failed to upload: ${file.name}`);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await profileApi.updateProfile(profile);
      if (res?.status === "success") {
        toast.success("Profile updated successfully");
        dispatch(updateUser(profile));
      } else {
        toast.error(res.data?.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Error updating profile");
    }
  };

  const handleSurveyChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <section className="bg-white p-4 sm:p-6 md:p-8 lg:px-24 rounded-2xl">
      {/* Tabs Header */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("basic")}
          className={`pb-2  ${activeTab === "basic"
            ? "border-b-2 font-bold border-teal-700 text-teal-700"
            : "text-gray-500"
            }`}
        >
          Basic Info
        </button>
        <button
          onClick={() => setActiveTab("survey")}
          className={`pb-2 ${activeTab === "survey"
            ? "border-b-2 font-bold border-teal-700 text-teal-700"
            : "text-gray-500"
            }`}
        >
          Likes / Dislikes
        </button>
      </div>

      {/* Basic Info Tab */}
      {activeTab === "basic" && (
        <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg">
          {/* Profile Picture */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="relative">
              <img
                src={image || profile?.profilePicture || "https://via.placeholder.com/80"}
                alt="profile"
                className="w-20 h-20 rounded-full border border-gray-300 object-cover"
              />
              <label
                htmlFor="upload"
                className="absolute bottom-0 right-0 bg-teal-900 p-1.5 rounded-full cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-white" />
                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <p className="mt-2 text-blue-600 text-sm cursor-pointer">
              Upload Picture
            </p>
            <p className="text-gray-400 text-xs">Size: less than 3MB</p>
          </div>

          <hr className="my-6 text-[#E5E7EA]" />

          {/* Profile Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#24292E]">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={profile?.fullName || ""}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-700 focus:outline-none text-sm"
              />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#24292E]">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile?.email || ""}
                  onChange={handleChange}
                  placeholder="abc@gmail.com"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-700 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#24292E]">
                  Phone
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={profile?.mobileNumber || ""}
                  onChange={handleChange}
                  placeholder="9912345678"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-700 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* State + City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#24292E]">
                  Regional State
                </label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-teal-700 focus:outline-none text-sm">
                  <option>Select</option>
                  <option>California</option>
                  <option>Texas</option>
                  <option>New York</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#24292E]">
                  City
                </label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-teal-700 focus:outline-none text-sm">
                  <option>Select</option>
                  <option>Los Angeles</option>
                  <option>Houston</option>
                  <option>New York City</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 rounded-md bg-teal-900 text-white hover:bg-teal-800 text-sm"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Survey Tab */}
      {activeTab === "survey" && (
        <div className="max-w-7xl mx-auto p-6 space-y-3">
          {Array.isArray(questions) && questions.length > 0 ? (
            questions.map((q) => (
              <motion.div
                key={q._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-2xl shadow bg-white border border-gray-200"
              >
                <h3 className="font-semibold text-lg mb-2">{q.question}</h3>

                {editingId === q._id ? (
                  <div className="space-y-1">
                    {q.options?.map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center p-2 rounded-lg cursor-pointer border ${
                          answers[q._id] === opt
                            ? "bg-[#033E4A] text-white border-[#033E4A]"
                            : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${q._id}`}
                          checked={answers[q._id] === opt}
                          onChange={() => handleSurveyChange(q._id, opt)}
                          className="hidden"
                        />
                        <span className="ml-2">{opt}</span>
                      </label>
                    ))}
                    <button
                      onClick={async () => {
                        try {
                          const res = await profileApi.updateSurveyAnswer(
                            q._id,
                            answers[q._id]
                          );
                          if (res?.status === "success") {
                            toast.success("Survey answer updated");
                            setEditingId(null);
                          } else {
                            toast.error(res?.data?.message || "Failed to update answer");
                          }
                        } catch (err) {
                          console.error(err);
                          toast.error("Error updating answer");
                        }
                      }}
                      className="mt-3 flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-300 text-black hover:bg-gray-400 transition"
                    >
                      <FiCheckCircle /> Save
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">{answers[q._id] || "No answer yet"}</span>
                    <button
                      onClick={() => setEditingId(q._id)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FiEdit2 /> Edit
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500">No survey questions found.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default DashboardProfilePage;
