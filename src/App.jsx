// 📦 Imports
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

// 🧩 Importing Components
import Navbar from "./components/Navbar/Navbar";
import Remise from "./components/Remise/Remise";
import EventsSection from "./components/Filtrer/EventsSection";
import Inscrire from "./components/Inscrire/Inscrire";
import Description from "./components/Description/TEAM";
import Footer from "./components/Footer/Footer";
import CardSection from "./components/lesPages/CardSection";
import CookieConsent from "./components/Cookie/CookieConsent";
import Popup from "./components/Popup/Popup";
import EmailVerificationPage from "./components/Popup/EmailVerificationPage";

// 🧑‍💼 Dashboards & User Pages
import Admin from "./components/Dashbord/Admin";
import Gestionnaire from "./components/Dashbord/Gestionnaire";
import Utilisateurs from "./components/Utilisateur/Utilisateurs";
import UpdateProfil from "./components/Utilisateur/updateProfil";

// 🏷️ Categories
import Education from "./components/Categorie/Education";
import Celebrations from "./components/Categorie/Celebrations";
import Culture from "./components/Categorie/Culture";
import Ecologie from "./components/Categorie/Ecologie";
import Sport from "./components/Categorie/Sport";
import Professionnel from "./components/Categorie/Professionnel";
import Marches from "./components/Categorie/Marches";
import Communautaire from "./components/Categorie/Communautaire";

// 🃏 Card Pages
import Card1 from "./components/lesPages/Card1";
import Card2 from "./components/lesPages/Card2";
import Card3 from "./components/lesPages/Card3";
import Card4 from "./components/lesPages/Card4";
import Card5 from "./components/lesPages/Card5";
import ForgetPasswordPage from "./components/Popup/ForgetPasswordPage";
import ResetPasswordPage from "./components/Popup/ResetPasswordPage";

// protected  used to protect pages like /Utilisateurs, /Admin, etc.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 🛡️ This component redirects logged-in users to home
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/Utilisateurs" replace />;
  }
  return children;
};

// 🏠 Home Page Structure
const Home = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Toggle login popup visibility
  const toggleLoginPopup = () => setShowLoginPopup(!showLoginPopup);

  return (
    <>
      <Navbar handleOrderPopup={toggleLoginPopup} />
      <Remise handleOrderPopup={toggleLoginPopup} />
      <CardSection />
      <EventsSection />
      <Inscrire />
      <Description />
      <Footer />
      <Popup orderPopup={showLoginPopup} setOrderPopup={setShowLoginPopup} />
      <CookieConsent />
    </>
  );
};

// 📱 Main App
const App = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  // Check if user is logged in when app starts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  

  // Setup scroll animation library
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
    <Router>
      <Toaster position="top-right" />

      <Routes>
        {/* 🌍 Home */}
        <Route path="/" element={<Home />} />

        {/* 🃏 Cards */}
        <Route path="/Card1" element={<Card1 />} />
        <Route path="/Card2" element={<Card2 />} />
        <Route path="/Card3" element={<Card3 />} />
        <Route path="/Card4" element={<Card4 />} />
        <Route path="/Card5" element={<Card5 />} />

        {/* 🏷️ Categories */}
        <Route path="/Education-et-Formation" element={<Education />} />
        <Route path="/Culture-et-Loisirs" element={<Culture />} />
        <Route path="/Celebrations-et-Fêtes" element={<Celebrations />} />
        <Route path="/Ecologie-et-Environnement" element={<Ecologie />} />
        <Route path="/Sport-et-Bien-être" element={<Sport />} />
        <Route path="/Professionnel" element={<Professionnel />} />
        <Route path="/Marches-et-Foires" element={<Marches />} />
        <Route path="/Communautaire-et-Caritatif" element={<Communautaire />} />

        {/* 👥 User Dashboards */}
        <Route
          path="/Utilisateurs"
          element={
            <ProtectedRoute>
              <Utilisateurs />
            </ProtectedRoute>
          }
        />

        <Route path="/Admin" element={<Admin />} />
        <Route path="/Gestionnaire" element={<Gestionnaire />} />
        <Route path="/UpdateProfil" element={<UpdateProfil />} />

        {/* ✉️ Email Verification */}
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
    </Router>
  );
};

export default App;
