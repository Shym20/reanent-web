import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import { FiEdit2, FiHeart, FiHome, FiKey, FiX } from "react-icons/fi";
import { IoBookmarksOutline, IoChatbubblesOutline, IoDocumentOutline, IoSearch } from "react-icons/io5";
import { FaRegStarHalf } from "react-icons/fa6";
import { MdOutlineAddHome } from "react-icons/md";
import { TbLayoutDashboard } from "react-icons/tb";
import { TbHomeCheck } from "react-icons/tb";
import { getUserLocal } from "../utils/localStorage.util";
import { useSelector } from "react-redux";
import ProfilePhoto from '../assets/images/profile-user.png'
import { useEffect, useState } from "react";
import ProfileApi from "../apis/profile/profile.api";

const DashSidebar = ({ isOpen, onClose, role }) => {

  const reduxUser = useSelector((state) => state.user.user);

  // Fallback to local storage if redux is empty
  const localUser = getUserLocal();
  const user = reduxUser || localUser;

  const handleNavClick = () => {
  if (window.innerWidth < 1024) {
    onClose();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const [profile, setProfile] = useState({
  fullName: user?.fullName || "Guest User",
  profilePicture: user?.profilePicture || ProfilePhoto,
});

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const profileApi = new ProfileApi();
      const res = await profileApi.getProfile();
      if (res?.data?.user) {
        setProfile(res.data.user);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  fetchProfile();
}, []);

const userName = profile?.fullName || "Guest User";
const userPhoto = profile?.profilePicture || ProfilePhoto;




  
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity hide-scrollbar duration-300
    ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white flex flex-col overflow-y-auto transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={onClose}>
            <FiX className="text-2xl text-gray-700" />
          </button>
        </div>

        {/* Logo */}
        <div className="hidden md:flex mt-7 mx-auto items-center space-x-2">
          <Link to={"/"}>
            <div className="logopanel">
              <img src={Logo} alt="Logo" className="h-7 md:h-8 pl-1" />
            </div>
          </Link>
        </div>

        {/* Profile */}
        <div className="flex flex-col mt-14 items-center space-y-3">
          <Link to={'/dashboard/profile'}>
            <div className="relative">
              <img
                src={userPhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <button
                className={`absolute bottom-1 right-1 text-white p-1 rounded-full shadow-md ${role === "tenant" ? "bg-teal-600" : "bg-yellow-600"
                  }`}
              >
                <FiEdit2 className="w-3 h-3" />
              </button>
            </div>
          </Link>
          <p className="text-lg font-semibold text-gray-800">{userName}</p>

          <div className="w-48 flex gap-4 items-center">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${role === "tenant" ? "bg-teal-700" : "bg-yellow-500"
                  }`}
                style={{ width: "70%" }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 text-right">70%</p>
          </div>
        </div>

        {/* Navigation */}
        {role === "owner" ? (
          <nav className="flex-1 p-4 space-y-2">
            <NavLink
              to="/dashboard-owner"
              end
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#D7B56D] text-white"
                  : "bg-white text-black"
                } hover:bg-[#D7B56D] hover:text-white`
              }
            >
              <TbLayoutDashboard className="text-lg" /> Dashboard
            </NavLink>
            <NavLink
              to="/dashboard-owner/my-properties"
             onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#D7B56D] text-white"
                  : "bg-white text-black"
                } hover:bg-[#D7B56D] hover:text-white`
              }
            >
              <FiHome className="text-lg" /> My Properties
            </NavLink>

            <NavLink
              to="/dashboard-owner/tenant-interest"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#D7B56D] text-white"
                  : "bg-white text-black"
                } hover:bg-[#D7B56D] hover:text-white`
              }
            >
              <IoBookmarksOutline className="text-lg" /> Tenant Interests
            </NavLink>

            <NavLink
              to="/dashboard-owner/channel"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#D7B56D] text-white"
                  : "bg-white text-black"
                } hover:bg-[#D7B56D] hover:text-white`
              }
            >
              <IoChatbubblesOutline className="text-lg" /> Properties Channels
            </NavLink>

            <NavLink
              to="/dashboard-owner/rent-utilities"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#D7B56D] text-white"
                  : "bg-white text-black"
                } hover:bg-[#D7B56D] hover:text-white`
              }
            >
              <FiKey className="text-lg" /> Rent & Utilities
            </NavLink>

            <NavLink
              to="/dashboard-owner/documents"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#D7B56D] text-white"
                  : "bg-white text-black"
                } hover:bg-[#D7B56D] hover:text-white`
              }
            >
              <IoDocumentOutline className="text-lg" /> Documents
            </NavLink>

            <NavLink
              to="/dashboard-owner/rating"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#D7B56D] text-white"
                  : "bg-white text-black"
                } hover:bg-[#D7B56D] hover:text-white`
              }
            >
              <FaRegStarHalf className="text-lg" /> Rating & Reputation
            </NavLink>

            <NavLink
              to="/dashboard-owner/add-property"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#D7B56D] text-white"
                  : "bg-white text-black"
                } hover:bg-[#D7B56D] hover:text-white`
              }
            >
              <MdOutlineAddHome className="text-lg" /> Add Property
            </NavLink>
          </nav>
        ) : (
          <nav className="flex-1 p-4 space-y-2">
            <NavLink
              to="/dashboard-tenant"
              onClick={handleNavClick}
              end
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#033E4A] text-white"
                  : "bg-white text-black"
                } hover:bg-[#033E4A] hover:text-white`
              }
            >
              <TbLayoutDashboard className="text-lg" /> Dashboard
            </NavLink>
            <NavLink
              to="/dashboard-tenant/your-stay"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#033E4A] text-white"
                  : "bg-white text-black"
                } hover:bg-[#033E4A] hover:text-white`
              }
            >
              <TbHomeCheck className="text-lg" /> My Stay
            </NavLink>

            {/* <NavLink
              to="/dashboard-tenant/search"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#033E4A] text-white"
                  : "bg-white text-black"
                } hover:bg-[#033E4A] hover:text-white`
              }
            >
              <IoSearch className="text-lg" /> Search
            </NavLink> */}

            <NavLink
              to="/dashboard-tenant/my-interest"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#033E4A] text-white"
                  : "bg-white text-black"
                } hover:bg-[#033E4A] hover:text-white`
              }
            >
              <IoBookmarksOutline className="text-lg" /> My Interests
            </NavLink>

            <NavLink
              to="/dashboard-tenant/rent-utilities"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#033E4A] text-white"
                  : "bg-white text-black"
                } hover:bg-[#033E4A] hover:text-white`
              }
            >
              <FiKey className="text-lg" /> Rent & Utilities
            </NavLink>

            <NavLink
              to="/dashboard-tenant/documents"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#033E4A] text-white"
                  : "bg-white text-black"
                } hover:bg-[#033E4A] hover:text-white`
              }
            >
              <IoDocumentOutline className="text-lg" /> Documents
            </NavLink>

            <NavLink
              to="/dashboard-tenant/rating"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#033E4A] text-white"
                  : "bg-white text-black"
                } hover:bg-[#033E4A] hover:text-white`
              }
            >
              <FaRegStarHalf className="text-lg" /> Ratings & Badges
            </NavLink>

            <NavLink
              to="/dashboard-tenant/saved-properties"
             onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 rounded-lg ${isActive
                  ? "bg-[#033E4A] text-white"
                  : "bg-white text-black"
                } hover:bg-[#033E4A] hover:text-white`
              }
            >
              <FiHeart className="text-lg" /> Saved/Shortlisted Properties
            </NavLink>
          </nav>
        )}
      </aside>
    </>
  );
};

export default DashSidebar;
