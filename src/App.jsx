import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


import "./index.css";

// Layout Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import CookieConsent from "./components/Cookie/CookieConsent";
import Popup from "./components/Popup/Popup";
import AboutPage from "./components/AboutPage";

// Sections
import Remise from "./components/Remise/Remise";
import CardSection from "./components/lesPages/CardSection";
import EventsSection from "./components/Filtrer/EventsSection";
import Description from "./components/Description/TEAM";

// Auth & Verification
import EmailVerificationPage from "./components/Popup/EmailVerificationPage";
import ForgetPasswordPage from "./components/Popup/ForgetPasswordPage";
import ResetPasswordPage from "./components/Popup/ResetPasswordPage";

// Dashboards & User Pages
import Admin from "./components/Dashbord/Admin";
import Gestionnaire from "./components/Dashbord/Gestionnaire";
import Utilisateurs from "./components/Utilisateur/Utilisateurs";
import UpdateProfile from "./components/Utilisateur/UpdateProfil";
import Event from "./components/Utilisateur/Event";

// Categories

// Card Pages
import EventDetails from "./components/lesPages/EventDetails";

import ProtectedRoute from "./utils/ProtectedRoute";
import PaiementPage from "./components/Popup/PaiementPage";

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Auth Redirect Logic
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  // Check that the user is not authenticated or is not verified
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/Utilisateurs" replace />;
  }

  return children;
};

const getContentReady = () => {
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });
};
getContentReady();

// Home Page
const Home = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const toggleLoginPopup = () => setShowLoginPopup(!showLoginPopup);

  return (
    <>
      <Navbar handleOrderPopup={toggleLoginPopup} />
      <Remise handleOrderPopup={toggleLoginPopup} />
      <CardSection />
      <EventsSection />
      <Description />
      <Footer />
      <Popup orderPopup={showLoginPopup} setOrderPopup={setShowLoginPopup} />
      <CookieConsent />
    </>
  );
};

const About =()=>{
 const [showLoginPopup, setShowLoginPopup] = useState(false);
  const toggleLoginPopup = () => setShowLoginPopup(!showLoginPopup);

  return (
    <>
      <Navbar handleOrderPopup={toggleLoginPopup} />
      <AboutPage />
      <Footer />
      <Popup orderPopup={showLoginPopup} setOrderPopup={setShowLoginPopup} />
      {/* <CookieConsent /> */}
    </>
  );
}



// Main Application Content
const AppContent = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, [checkAuth]);

  return (
    <>
      <div id="loader">
        <div className="spinner"></div>
      </div>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={
            <RedirectAuthenticatedUser>
              <Home />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/paiement/:inscriptionId"
          element={
            <ProtectedRoute allowedRoles={["participant"]}>
              <PaiementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:id"
          element={
            <ProtectedRoute
              allowedRoles={["participant", "admin", "gestionnaire"]}
            >
              <EventDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evenements"
          element={
            <ProtectedRoute
              allowedRoles={["participant", "admin", "gestionnaire"]}
            >
              <Event />
            </ProtectedRoute>
          }
        />

        {/* Categories */}

        <Route path="/about" element={<About />} />

        {/* User Dashboards */}
        <Route
          path="/Utilisateurs"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "gestionnaire", "participant"]}
            >
              <Utilisateurs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Gestionnaire"
          element={
            <ProtectedRoute allowedRoles={["gestionnaire", "admin"]}>
              <Gestionnaire />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UpdateProfil"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "gestionnaire", "participant"]}
            >
              <UpdateProfile />
            </ProtectedRoute>
          }
        />

        {/* Auth Routes */}
        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <EmailVerificationPage  />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </>
  );
};

// Main App Component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
