import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
// Components
import Navbar from "./components/Navbar/Navbar";
import Remise from "./components/Remise/Remise";
import EventsSection from "./components/Filtrer/EventsSection";
import Description from "./components/Description/TEAM";
import Footer from "./components/Footer/Footer";
import CardSection from "./components/lesPages/CardSection";
import CookieConsent from "./components/Cookie/CookieConsent";
import Popup from "./components/Popup/Popup";
import EmailVerificationPage from "./components/Popup/EmailVerificationPage";

// Dashboards & User Pages
import Admin from "./components/Dashbord/Admin";
import Gestionnaire from "./components/Dashbord/Gestionnaire";
import Utilisateurs from "./components/Utilisateur/Utilisateurs";

// Categories
import Education from "./components/Categorie/Education";
import Celebrations from "./components/Categorie/Celebrations";
import Culture from "./components/Categorie/Culture";
import Ecologie from "./components/Categorie/Ecologie";
import Sport from "./components/Categorie/Sport";
import Professionnel from "./components/Categorie/Professionnel";
import Marches from "./components/Categorie/Marches";
import Communautaire from "./components/Categorie/Communautaire";

// Card Pages
import Card1 from "./components/lesPages/Card1";
import Card2 from "./components/lesPages/Card2";
import Card3 from "./components/lesPages/Card3";
import Card4 from "./components/lesPages/Card4";
import Card5 from "./components/lesPages/Card5";
import ForgetPasswordPage from "./components/Popup/ForgetPasswordPage";
import ResetPasswordPage from "./components/Popup/ResetPasswordPage";
import EventDetails from "./components/lesPages/Card1";
import UpdateProfile from "./components/Utilisateur/UpdateProfil";
import Event from "./components/Utilisateur/Event";
import ProtectedRoute from "./utils/ProtectedRoute";

// Create query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/Utilisateurs" replace />;
  }
  return children;
};

const getContentReady = () => {
  // befor getting the content of the doom ready need loader
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");
  });
};
getContentReady();
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

const AppContent = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <>
      <div id="loader">
        <div class="spinner"></div>
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
        <Route path="/Education-et-Formation" element={<Education />} />
        <Route path="/Culture-et-Loisirs" element={<Culture />} />
        <Route path="/Celebrations-et-Fêtes" element={<Celebrations />} />
        <Route path="/Ecologie-et-Environnement" element={<Ecologie />} />
        <Route path="/Sport-et-Bien-être" element={<Sport />} />
        <Route path="/Professionnel" element={<Professionnel />} />
        <Route path="/Marches-et-Foires" element={<Marches />} />
        <Route path="/Communautaire-et-Caritatif" element={<Communautaire />} />

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
        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <EmailVerificationPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
