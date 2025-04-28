import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../assets/logo4.png";
import { IoMdSearch, IoMdCalendar } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuthStore } from "../../store/authStore";

const Navbar = ({ handleOrderPopup }) => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => handleOrderPopup();
  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate("/");
  };

  const profileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const mobileMenuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 }
  };

  const searchVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { width: "100%", opacity: 1 }
  };

  const renderProfileMenu = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={profileMenuVariants}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden"
    >
      {user?.role === "admin" && (
        <>
          <Link 
            to="/admin" 
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <IoMdCalendar /> Tableau Admin
          </Link>
          <Link 
            to="/gestionnaire" 
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <IoMdCalendar /> Tableau Gestionnaire
          </Link>
        </>
      )}
      {user?.role === "gestionnaire" && (
        <Link 
          to="/gestionnaire" 
          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <IoMdCalendar /> Tableau Gestionnaire
        </Link>
      )}
      <Link 
        to="/UpdateProfil" 
        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <CgProfile /> Mon Profil
      </Link>
      <button 
        onClick={handleLogout} 
        className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <IoMdCalendar /> Déconnexion
      </button>
    </motion.div>
  );

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      {/* Top Section */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500">
        <div className="container flex justify-between items-center px-4 sm:px-6 py-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-x-2 font-bold text-2xl sm:text-3xl">
            <img src={Logo} alt="Logo" className="w-12 sm:w-16 h-12 sm:h-16 object-contain" />
            <span className="text-white tracking-wide">EVENT</span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center gap-4">
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="text-white text-xl focus:outline-none"
            >
              <IoMdSearch />
            </button>
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="text-white text-xl focus:outline-none"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative group">
              <motion.input
                type="text"
                placeholder="Rechercher..."
                className="w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-4 py-2 focus:outline-none dark:border-gray-500 dark:bg-gray-800"
                initial={false}
                animate={{ width: searchOpen ? 300 : 200 }}
              />
              <IoMdSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 group-hover:text-orange-500" />
            </div>

            {/* Authentication / Profile */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                user?.isVerified ? (
                  <>
                    {/* All Events Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link 
                        to="/evenements" 
                        className="bg-white text-orange-600 px-4 py-2 rounded-full flex items-center gap-2 shadow-md hover:bg-orange-100 transition-all"
                      >
                        <IoMdCalendar className="text-xl" />
                        <span>Tous les événements</span>
                      </Link>
                    </motion.div>

                    {/* Profile Button */}
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        className="bg-white text-orange-600 px-4 py-2 rounded-full flex items-center gap-2 shadow-md hover:bg-orange-100 transition-all"
                      >
                        <CgProfile className="text-xl" />
                        <span>{user?.name}</span>
                      </motion.button>

                      <AnimatePresence>
                        {profileMenuOpen && renderProfileMenu()}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  // Email not verified
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-md shadow-md"
                  >
                    <p className="font-semibold">📩 Vérification de l'email requise</p>
                    <Link 
                      to="/verify-email" 
                      className="inline-block mt-1 text-sm text-blue-600 hover:underline"
                    >
                      ➤ Aller à la page de vérification
                    </Link>
                  </motion.div>
                )
              ) : (
                // Not logged in
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                  className="bg-white text-orange-600 px-4 py-2 rounded-full flex items-center gap-2 shadow-md hover:bg-orange-100 transition-all"
                >
                  <CgProfile className="text-xl" />
                  <span>Se Connecter</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={searchVariants}
            className="sm:hidden px-4 py-2 bg-white dark:bg-gray-800"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none dark:border-gray-500 dark:bg-gray-700"
              />
              <IoMdSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Profile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="sm:hidden bg-gray-100 dark:bg-gray-800 overflow-hidden"
          >
            <div className="flex flex-col space-y-2 p-4">
              {isAuthenticated ? (
                <>
                  <motion.div whileHover={{ x: 5 }} className="w-full">
                    <Link 
                      to="/evenements" 
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-orange-600"
                    >
                      <IoMdCalendar />
                      Tous les événements
                    </Link>
                  </motion.div>
                  {renderProfileMenu()}
                </>
              ) : (
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 text-left w-full"
                >
                  <CgProfile />
                  Se Connecter
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;