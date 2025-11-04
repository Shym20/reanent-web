import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthenticated } from "./hooks/useAuthenticated.hook";
import { useEffect } from "react";
import { messaging } from "./configs/firebase.config"; // your firebase.js config
import { onMessage } from "firebase/messaging";
import { toast } from "react-toastify";



import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ForgetPassword from "./pages/ForgetPassword";
import OtpPage from "./pages/OtpPage";
import ResetPassword from "./pages/ResetPassword";
import PropertiesList from "./pages/PropertiesList";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Notifications from "./pages/TenantDashboard/DashboardNotification";
import Survey from "./pages/Survey";

import DashboardLayout from "./DashboardLayout";
import Dashboard from "./pages/OwnerDashboard/Dashboard";
import DashboardLikedPage from "./pages/TenantDashboard/DashboardLikedPage";
import DashboardHistoryPage from "./pages/OwnerDashboard/DashboardHistoryPage";
import DashboardSearchPage from "./pages/TenantDashboard/DashboardSearchPage";
import DashboardAddProperty from "./pages/OwnerDashboard/DashboardAddProperty";
import DashboardProfilePage from "./pages/OwnerDashboard/DashboardProfilePage";
import PropertyDetail from "./pages/PropertyDetail";
import OwnerPropertyReviewDetail from "./pages/OwnerPropertyReviewDetail";
import TenantDashboard from "./pages/TenantDashboard/Dashboard";
import OwnerDashboard from "./pages/OwnerDashboard/Dashboard";
import DashboardMyProperties from "./pages/OwnerDashboard/DashboardMyProperties";
import DashboardTenantInterest from "./pages/OwnerDashboard/DashboardTenantInterest";
import DashboardRentUtilities from "./pages/OwnerDashboard/DashboardRentUtilities";
import DashboardDocument from "./pages/OwnerDashboard/DashboardDocument";
import DashboardChannel from "./pages/OwnerDashboard/DashboardChannel";
import DashboardRating from "./pages/OwnerDashboard/DashboardRating";
import DashboardYourStay from "./pages/TenantDashboard/DashboardYourStay";
import DashboardMyInterest from "./pages/TenantDashboard/DashboardMyInterest";
import DashboardTenantRentUtilities from "./pages/TenantDashboard/DashboardRentUtilities";
import DashboardTenantDocument from "./pages/TenantDashboard/DashboardDocument";
import DashboardTenantRating from "./pages/TenantDashboard/DashboardRating";
import DashboardPropertyDetail from "./pages/TenantDashboard/DashboardPropertyDetails";
import DashboardPeopleDetails from "./pages/TenantDashboard/DashboardPeopleDetails";
import DashboardPropertyDetailToOwner from "./pages/OwnerDashboard/DashboardPropertyDetailToOwner";
import DashboardTenantChannel from "./pages/TenantDashboard/DashboardChannel";
import DashboardCurrentTenants from "./pages/OwnerDashboard/DashboardCurrentTenants";

function AppContent() {
  const location = useLocation();
  const isAuthenticated = useAuthenticated();

  // Hide Navbar & Footer on dashboard and auth/survey pages
  const hideNavbarFooter =
    location.pathname.startsWith("/dashboard") ||
    ["/login", "/signup", "/forget-password", "/otp", "/survey", "/reset-password"].includes(location.pathname);

  useEffect(() => {

  // Listen for foreground messages
  onMessage(messaging, (payload) => {
    console.log("Message received in foreground: ", payload);
    toast.info(`${payload.notification?.title}: ${payload.notification?.body}`);
  });
}, []);


  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/properties-list" element={<PropertiesList />} />
        <Route path="/property-details" element={<PropertyDetail />} />
        <Route path="/owner-property-review" element={<OwnerPropertyReviewDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Protected Dashboard routes */}
        <Route
          path="/dashboard-owner/*"
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
          }
        >
          <Route index element={<DashboardCurrentTenants />} /> 
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="history" element={<DashboardHistoryPage />} />
          <Route path="search" element={<DashboardSearchPage />} />
          <Route path="my-properties" element={<DashboardMyProperties />} />
          <Route path="my-properties/:id" element={<DashboardPropertyDetailToOwner />} />
          <Route path="tenant-interest" element={<DashboardTenantInterest />} />
          <Route path="rent-utilities" element={<DashboardRentUtilities />} />
          <Route path="add-property" element={<DashboardAddProperty />} />
          <Route path="add-property/:id?" element={<DashboardAddProperty />} />
          <Route path="documents" element={<DashboardDocument />} />
          <Route path="channel" element={<DashboardChannel />} />
          <Route path="rating" element={<DashboardRating />} />
        </Route>

        <Route
          path="/dashboard-tenant/*"
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
          }
        >
          <Route index element={<TenantDashboard />} />
          <Route path="your-stay" element={<DashboardYourStay />} />
          <Route path="channel" element={<DashboardTenantChannel />} />
          <Route path="saved-properties" element={<DashboardLikedPage />} />
          <Route path="my-interest" element={<DashboardMyInterest />} />
          <Route path="rent-utilities" element={<DashboardTenantRentUtilities />} />
          <Route path="documents" element={<DashboardTenantDocument />} />
          <Route path="rating" element={<DashboardTenantRating />} />
          <Route path="property-details/:id" element={<DashboardPropertyDetail />} />
          <Route path="people-details/:id" element={<DashboardPeopleDetails />} />
          <Route path="history" element={<DashboardHistoryPage />} />
          <Route path="search" element={<DashboardSearchPage />} />
          <Route path="notifications" element={<Notifications />} />
          
        </Route>

         <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
          }
        >
          <Route path="profile" element={<DashboardProfilePage/>} />
        </Route>
      </Routes>

      
      {!hideNavbarFooter && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
