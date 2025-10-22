import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../utils/common.util";
import { toast } from "react-toastify";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import logo from '../assets/images/logo.png'
import { IoSearch } from "react-icons/io5";

export default function DashNav({ onToggleSidebar, role, setRole, sidebarOpen }) {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const handleLogoutConfirm = () => {
    logout(dispatch);
    toast.success("Logged out successfully 👋", { position: "top-right" });
    navigate("/");
  };

  const handleNavClick = () => {
  if (window.innerWidth < 1024) {
    onClose();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  return (
    <>
      <header className="sticky top-0 z-50 bg-white px-4 py-5">
        <div className="flex items-center justify-between md:justify-end  md:mr-10">

          <button
            onClick={onToggleSidebar}
            className="md:hidden text-2xl text-gray-700 transition-transform duration-300"
          >
            {sidebarOpen ? (
              <FiX className="transform rotate-90" />
            ) : (
              <FiMenu className="transform rotate-0" />
            )}
          </button>


          <Link to={'/'}

            className="md:hidden  text-gray-700"
          >
            <img src={logo} className="w-40 " alt="" />
          </Link>

          <NavLink
              to="/dashboard-tenant/search"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex gap-2 items-center px-2 py-2 mr-4 rounded-full ${isActive
                  ? "bg-[#033E4A] text-white"
                  : "bg-gray-100 text-black"
                } hover:bg-[#033E4A] hover:text-white`
              }
            >
              <IoSearch className="text-xl" />
            </NavLink>

          <div className="flex items-center border border-[#033E4A33] shadow rounded-full p-1 gap-2 md:mr-6">
            <Link to={'/dashboard-owner'}>
              <button
                onClick={() => setRole("owner")}
                className={`px-1 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium ${role === "owner"
                  ? "bg-[#D7B56D] text-white"
                  : "bg-white text-gray-700"
                  } transition`}

              >
                Owner
              </button></Link>
            <Link to={'/dashboard-tenant'}>
              <button
                onClick={() => setRole("tenant")}
                className={`px-1 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium ${role === "tenant"
                  ? "bg-[#033E4A] text-white"
                  : "bg-white text-gray-700"
                  } transition`}
              >
                Tenant
              </button></Link>
          </div>

          {/* Right side links */}
          <div className="relative">
            {/* Large screen links */}
            <div className="hidden md:flex items-center gap-10 text-md">

              <button
                onClick={() => setShowModal(true)}
                className="text-red-600 hover:text-red-800"
              >
                <FiLogOut className="text-xl" />
              </button>
            </div>

            {/* Small screen "Menu" */}

          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out? You’ll need to log in again to
              access your dashboard.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
