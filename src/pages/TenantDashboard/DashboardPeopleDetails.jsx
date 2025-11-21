import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  User,
  Utensils,
  Wine,
  Briefcase,
  Home,
  Wallet,
} from "lucide-react";
import { MdOutlineEmail, MdOutlinePhoneInTalk } from "react-icons/md";
import { useEffect, useState } from "react";
import ProfileApi from "../../apis/profile/profile.api";
import defaultImg from "../../assets/images/profile-user.png"


export default function DashboardPeopleDetails() {
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTenantTab, setActiveTenantTab] = useState("current");
  const { id: userId } = useParams();
  const profileApi = new ProfileApi();

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        setLoading(true);
        const res = await profileApi.searchPeopleDetail(userId);

        if (res?.status === "success") {
          const apiData = res.data;

          const formatted = {
            id: userId,
            name: apiData.name,
            email: apiData?.email,
            phone: apiData?.phone,
            avatar: apiData?.profilePicture || defaultImg,
            cover:
              "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1200&q=80",
            rating: 4.3,
            isTenant: true,
            isOwner: true,
            surveyAnswers:
              apiData.questionaire?.map((q) => ({
                question: q.question,
                answer: q.answer,
              })) || [],
            ownedProperties:
              apiData.properties?.map((p) => ({
                id: p.property_id,
                name: p.name,
                location: `${p.city}, ${p.state}`,
                photo: p.images?.[0] || "https://picsum.photos/300/200",
              })) || [],
            transactions: [
              {
                id: 1,
                propertyName: "Greenwood Apartments",
                date: "10 Oct 2025",
                amount: 15000,
                status: "Paid",
                mode: "UPI",
              },
            ],
            reviews: [
              {
                name: "Amit Verma",
                avatar: "https://randomuser.me/api/portraits/men/45.jpg",
                rating: 5,
                comment: "Rahul is a very polite tenant. Always paid rent on time!",
                date: "Aug 2025",
              },
            ],
          };

          setPerson(formatted);
        } else {
          console.error("API failed:", res);
        }
      } catch (err) {
        console.error("Error fetching person details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchPersonDetails();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">No user found.</p>
      </div>
    );
  }



  return (
    <div className="min-h-screen rounded-2xl bg-white flex flex-col items-center">
      {/* Cover Banner */}
      <div className="relative w-full sm:h-36">
        <img
          src={person.cover}
          alt="Cover"
          className="w-full h-full rounded-t-2xl object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 rounded-2xl bg-black/40"></div>

        {/* Profile Avatar */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <img
            src={person.avatar}
            alt={person.name}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800">{person.name}</h2>
        {person.email && <p className="text-gray-600 text-md flex gap-2 justify-center items-center"><MdOutlineEmail className="" />
          {person.email}</p>}
        {person.phone && <p className="text-gray-600 text-md flex gap-2 justify-center items-center"><MdOutlinePhoneInTalk />{person.phone}</p>}

        {/* Rating */}
        <div className="flex justify-center items-center gap-1 mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={`${i < Math.floor(person.rating)
                ? "text-yellow-400"
                : "text-gray-300"
                } w-5 h-5`}
            />
          ))}
          <span className="ml-2 text-gray-700 font-medium">
            {person.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Sections */}
      <div className="w-full max-w-6xl mt-10 space-y-8 px-4 sm:px-0">

        {/* Survey Preferences */}
        {person.surveyAnswers?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              About
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {person.surveyAnswers.map((ans, i) => {
                // icon mapping
                const iconMap = {
                  "Are you living with family or as an individual?": Home,
                  "Do you consume alcohol?": Wine,
                  "What is your food preference?": Utensils,
                  "What is your profession?": Briefcase,
                  "What is your income range?": Wallet,
                };


                const Icon = iconMap[ans.question] || User;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex flex-col items-center justify-center p-6 py-10 rounded-2xl bg-gray-50 shadow hover:shadow-md transition"
                  >
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#033E4A]/10 text-[#033E4A] mb-3">
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* <p className="text-sm text-gray-500 text-center">{ans.question}</p> */}
                    <p className="text-lg font-semibold text-gray-800 mt-1">{ans.answer}</p>

                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
        {/* Tenant Info */}
        {person.isTenant && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50/80 backdrop-blur-lg rounded-2xl p-6 shadow hover:shadow-xl transition"
          >
            {/* Tabs */}
            <div className="flex mb-4">
              <button
                onClick={() => setActiveTenantTab("current")}
                className={`px-4 py-2 font-semibold ${activeTenantTab === "current"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500"
                  }`}
              >
                Currently Tenant At
              </button>
              <button
                onClick={() => setActiveTenantTab("previous")}
                className={`px-4 py-2 font-semibold ${activeTenantTab === "previous"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500"
                  }`}
              >
                Previously Tenant At
              </button>
            </div>

            {/* Tab Content */}
            {activeTenantTab === "current" && person.property && (
              <div className="flex items-center gap-5">
                <img
                  src={person.property.photo}
                  alt={person.property.name}
                  className="w-24 h-24 rounded-xl object-cover shadow"
                />
                <div>
                  <p className="font-bold text-lg text-gray-800">
                    {person.property.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Owner:{" "}
                    <span className="font-medium">{person.property.ownerName}</span>
                  </p>
                </div>
              </div>
            )}

            {activeTenantTab === "previous" && person.previousProperties?.length > 0 && (
              <div className="grid sm:grid-cols-4 gap-6">
                {person.previousProperties.map((prop, idx) => (
                  <motion.div
                    key={prop.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * idx }}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                  >
                    <img
                      src={prop.photo}
                      alt={prop.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <p className="font-bold text-lg text-gray-800">{prop.name}</p>
                      <p className="text-sm text-gray-600">
                        Owner: <span className="font-medium">{prop.ownerName}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Tenant Transactions */}
        {/* {person.transactions?.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.6 }}
    className="bg-gray-50/80 backdrop-blur-lg rounded-2xl p-6 shadow hover:shadow-xl transition"
  >
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      Transaction History
    </h3>

    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#033E4A] text-white">
            <th className="py-3 px-4 text-left rounded-l-xl">Date</th>
            <th className="py-3 px-4 text-left">Property</th>
            <th className="py-3 px-4 text-left">Mode</th>
            <th className="py-3 px-4 text-left">Amount (₹)</th>
            <th className="py-3 px-4 text-left rounded-r-xl">Status</th>
          </tr>
        </thead>
        <tbody>
          {person.transactions.map((txn, idx) => (
            <tr
              key={txn.id}
              className="border-b hover:bg-gray-100 transition"
            >
              <td className="py-3 px-4 text-gray-700">{txn.date}</td>
              <td className="py-3 px-4 text-gray-700">{txn.propertyName}</td>
              <td className="py-3 px-4 text-gray-700">{txn.mode}</td>
              <td className="py-3 px-4 font-semibold text-gray-800">
                ₹{txn.amount.toLocaleString()}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    txn.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {txn.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
)} */}



        {/* Owned Properties */}
        {person.isOwner && person.ownedProperties?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-gray-50/80 backdrop-blur-lg rounded-2xl p-6 shadow hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Owned Properties
            </h3>
            <div className="grid sm:grid-cols-4 gap-6">
              {person.ownedProperties.map((prop, idx) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                >
                  <img
                    src={prop.photo}
                    alt={prop.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <p className="font-bold text-lg text-gray-800">
                      {prop.name}
                    </p>
                    <p className="text-sm text-gray-600">{prop.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}


        {person.reviews?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow hover:shadow-xl transition mt-8"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Reviews
            </h3>

            <div className="space-y-4">
              {person.reviews.map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition flex gap-4"
                >
                  {/* Reviewer Avatar */}
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-800">{review.name}</h4>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 my-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <FaStar
                          key={idx}
                          className={`${idx < review.rating ? "text-yellow-500" : "text-gray-300"
                            } w-4 h-4`}
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>

      {/* Back Button */}
      <div className="mt-10 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 rounded-full bg-[#033E4A] text-white font-semibold shadow-lg hover:bg-[#055564] hover:scale-105 transition transform"
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
}
