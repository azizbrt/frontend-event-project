import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdSearch, IoMdCalendar } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "../../assets/logo4.png";
import { useAuthStore } from "../../store/authStore";

const Navbar = ({ handleOrderPopup }) => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-40">
      {/* Top Nav */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-xl text-orange-600">EVENT</span>
        </Link>

        {/* Search - Desktop only */}
        <div className="hidden sm:flex items-center relative w-64">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none"
          />
          <IoMdSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Right buttons */}
        <div className="hidden sm:flex items-center gap-4">
          {isAuthenticated && user?.isVerified ? (
            <>
              <Link
                to="/evenements"
                className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-all flex items-center gap-2"
              >
                <IoMdCalendar />
                <span>Événements</span>
              </Link>

              {/* Profile Button */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="bg-white text-orange-600 border border-orange-500 px-4 py-2 rounded-full hover:bg-orange-50 transition-all flex items-center gap-2"
                >
                  <CgProfile />
                  <span>{user?.name}</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50"
                    >
                      <ul className="text-sm">
                        {user?.role === "admin" && (
                          <li>
                            <Link
                              to="/admin"
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              🛠️ Tableau Admin
                            </Link>
                          </li>
                        )}
                        {[ "gestionnaire"].includes(user?.role) && (
                          <li>
                            <Link
                              to="/gestionnaire"
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              🗂️ Tableau Gestionnaire
                            </Link>
                          </li>
                        )}
                        <li>
                          <Link
                            to="/UpdateProfil"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            👤 Mon Profil
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            🚪 Déconnexion
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : isAuthenticated && !user?.isVerified ? (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md">
              📩 Vérifiez votre email.
              <Link to="/verify-email" className="text-blue-600 underline ml-2">
                Cliquez ici
              </Link>
            </div>
          ) : (
            <button
              onClick={handleOrderPopup}
              className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-all flex items-center gap-2"
            >
              <CgProfile />
              <span>S'authentifier</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-2xl text-orange-600"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden bg-white dark:bg-gray-900 px-4 py-3 space-y-3 shadow-md"
          >
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
            />
            {isAuthenticated ? (
              <>
                <Link
                  to="/evenements"
                  className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🗓️ Tous les événements
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    🛠️ Tableau Admin
                  </Link>
                )}
                {[ "gestionnaire"].includes(user?.role) && (
                  <Link
                    to="/gestionnaire"
                    className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    🗂️ Tableau Gestionnaire
                  </Link>
                )}
                <Link
                  to="/UpdateProfil"
                  className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  👤 Mon Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🚪 Déconnexion
                </button>
              </>
            ) : (
              <button
                onClick={handleOrderPopup}
                className="block px-4 py-2 rounded bg-orange-500 text-white w-full text-left"
              >
                🔐 S'authentifier
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
