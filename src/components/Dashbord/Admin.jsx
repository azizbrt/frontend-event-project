import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { FaUsers, FaTags, FaCalendarAlt, FaChartBar } from "react-icons/fa";
import { motion } from "framer-motion";
import CRUDuser from "./CRUDuser";
import CRUDcategorie from "./CRUDcategorie";
import CRUDevenement from "./CRUDevenement";
import { useAuthStore } from "../../store/authStore";
import AddEvent from "./AddEvent";
import AdminEvents from "./AdminEvents";
import Statistique from "./Statestique";

const Admin = () => {
  const [selectedFeature, setSelectedFeature] = useState("users");
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleFeatureSelection = (feature) => {
    setSelectedFeature(feature);
  };

  const sidebarItems = [
    { key: "users", label: "Gérer les utilisateurs", icon: <FaUsers /> },
    { key: "categorie", label: "Gérer les Catégories", icon: <FaTags /> },
    { key: "events", label: "Gérer les événements", icon: <FaCalendarAlt /> },
    { key: "statistics", label: "Statistiques globales", icon: <FaChartBar /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-gradient-to-b from-orange-400 to-orange-500 text-white h-screen p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin</h2>
        <nav>
          <ul className="space-y-4">
            {sidebarItems.map((item) => (
              <li
                key={item.key}
                onClick={() => handleFeatureSelection(item.key)}
                className={`cursor-pointer flex items-center gap-3 p-2 rounded-lg transition duration-300 ${
                  selectedFeature === item.key
                    ? "bg-orange-600"
                    : "hover:bg-orange-400"
                }`}
              >
                {item.icon} {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white shadow-md p-4 flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">{user?.name}</span>
          </div>
          <div className="relative group hidden sm:block">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-3 py-1 focus:outline-none hover:border-orange-500"
            />
            <IoMdSearch className="text-gray-500 group-hover:text-orange-500 absolute top-1/2 -translate-y-1/2 right-3" />
          </div>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 overflow-y-auto p-6"
        >
          {selectedFeature === "users" && <CRUDuser />}
          {selectedFeature === "categorie" && <CRUDcategorie />}
          {selectedFeature === "events" && <AdminEvents />}
          {selectedFeature === "statistics" && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold text-orange-500 mb-4">
                Statistiques globales
              </h2>
              <div className="text-gray-600">
                <Statistique />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
