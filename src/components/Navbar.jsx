import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/images/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../utils/common.util"; // adjust path if needed
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// Variants for parent (container)
const navContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // delay between each link
    },
  },
};

// Variants for each link
const navItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,   // speed of each link animation (0.5s)
      ease: "easeOut", // easing curve
    },
  },
};



const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.reanent_user_info);
  const token = useSelector((state) => state.user.reanent_auth_token);

  const linkClasses = ({ isActive }) =>
    isActive
      ? "text-[#033E4A] font-semibold border-b-2 border-[#033E4A] pb-1 transition"
      : "text-[#171717] hover:text-gray-900 border-b-2 border-transparent hover:border-gray-400 pb-1 transition";

  const linkClassesMobile = ({ isActive }) =>
    isActive
      ? "text-[#033E4A] w-max font-semibold border-b-2 border-[#033E4A] pb-1 transition"
      : "text-[#171717] w-max hover:text-gray-900 border-b-2 border-transparent hover:border-gray-400 pb-1 transition";

  // Get initials
  // Get initials from fullName
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    logout(dispatch);
    toast.success("Logged out successfully 👋", { position: "top-right" });
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0 flex items-center space-x-2 cursor-pointer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link to={'/'}>
              <img className="h-8 w-auto"  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} src={logo} alt="Logo" />
            </Link>
          </motion.div>


          {/* Desktop Menu */}
          <motion.div
            className="hidden md:flex space-x-8"
            variants={navContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1, color: "#033E4A" }}
              variants={navItem}>
              <NavLink
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={linkClasses}
              >
                Home
              </NavLink>
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1, color: "#033E4A" }}
              variants={navItem}>
              <NavLink
                to="/about"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={linkClasses}
              >
                About
              </NavLink>
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1, color: "#033E4A" }}
              variants={navItem}>
              <NavLink
                to="/services"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={linkClasses}
              >
                Services
              </NavLink>
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1, color: "#033E4A" }}
              variants={navItem}>
              <NavLink
                to="/contact"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={linkClasses}
              >
                Contact
              </NavLink>
            </motion.div>
          </motion.div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user && token ? (
              <>
                
                <div ref={dropdownRef} className="relative p-1.5 rounded-3xl bg-[#033E4A]">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex cursor-pointer items-center space-x-2 focus:outline-none"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-white text-[#033E4A] flex items-center justify-center font-bold">
                      {getInitials(user.fullName)}
                    </div>
                    {/* Name */}
                    <span className="text-white font-medium">{user.fullName}</span>
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-2xl rounded-md py-2 z-50">
                      <NavLink
                        to="/dashboard-owner"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>

            ) : (
              <>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1, color: "#033E4A" }}
                  variants={navItem}>
                  <NavLink
                    to="/signup"
                    className="text-[#171717] hover:text-gray-900"
                  >
                    Sign Up
                  </NavLink>
                </motion.div>

                <motion.div
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1, color: "#033E4A" }}
                  variants={navItem}>
                  <NavLink
                    to="/login"
                    className="bg-[#033E4A] text-white px-4 py-1 rounded-full hover:bg-[#002f38] transition"
                  >
                    Login
                  </NavLink>
                </motion.div>

              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-800" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md flex flex-col px-4 pb-4 space-y-2 animate-slideDown z-50">
          <NavLink
            to="/"
            className={linkClassesMobile}
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={linkClassesMobile}
            onClick={() => setIsOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/services"
            className={linkClassesMobile}
            onClick={() => setIsOpen(false)}
          >
            Services
          </NavLink>
          <NavLink
            to="/contact"
            className={linkClassesMobile}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </NavLink>

          {user && token ? (
            <div className="flex items-center space-x-3 mt-3">
              <div className="w-10 h-10 rounded-full bg-[#033E4A] text-white flex items-center justify-center font-bold">
                {getInitials(user.fullName)}
              </div>
              <span className="text-[#171717] font-medium">
                {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/signup"
                className="block text-[#171717]"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </NavLink>
              <NavLink
                to="/login"
                className="block bg-[#033E4A] text-white px-4 py-1 w-max rounded-full"
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      )}

    </nav>
  );
};

export default Navbar;
