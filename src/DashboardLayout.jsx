// src/layouts/DashboardLayout.jsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "./utils/common.util";
import DashNav from "./components/DashboardNavbar";
import DashSidebar from "./components/DashboardSidebar";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [role, setRole] = useState("owner");

  const handleLogout = () => {
    logout(dispatch);
    navigate("/login");
  };

  useEffect(() => {
  if (sidebarOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - fixed width */}
      <DashSidebar isOpen={sidebarOpen} role={role}
        onClose={() => setSidebarOpen(false)} />

      {/* Main area - takes the rest */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <DashNav onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} role={role}  setRole={setRole} sidebarOpen={sidebarOpen}/>

        {/* Page content */}
        <main className="flex-1 bg-white overflow-y-auto overflow-x-hidden ">
          <div className="bg-gray-100 rounded-3xl shadow-md p-0 md:p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
