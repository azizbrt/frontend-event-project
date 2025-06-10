import React, { useState } from "react";
import {
  FaUsers,
  FaTags,
  FaCalendarAlt,
  FaChartBar,
  FaHome,
  FaUserCircle,
  FaSearch,
} from "react-icons/fa";
import CRUDuser from "./CRUDuser";
import CRUDcategorie from "./CRUDcategorie";
import AdminEvents from "./AdminEvents";
import Statistique from "./Statestique";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");

  const HandleLogout = () => {
    logout();
    navigate("/");
  };

  const tabs = {
    users: {
      label: "Gérer les utilisateurs",
      icon: <FaUsers className="mr-2 w-5 h-5" />,
      component: <CRUDuser searchTerm={searchTerm} />,
    },
    categorie: {
      label: "Gérer les catégories",
      icon: <FaTags className="mr-2 w-5 h-5" />,
      component: <CRUDcategorie searchTerm={searchTerm} />,
    },
    events: {
      label: "Gérer les événements",
      icon: <FaCalendarAlt className="mr-2 w-5 h-5" />,
      component: <AdminEvents searchTerm={searchTerm} />,
    },
    statistics: {
      label: "Statistiques globales",
      icon: <FaChartBar className="mr-2 w-5 h-5" />,
      component: (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">
            Statistiques globales
          </h2>
          <Statistique />
        </div>
      ),
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar non fixe */}
      <aside className="w-64 bg-gradient-to-b from-orange-500 to-orange-600 text-white p-6 shadow-lg">
        <div className="flex items-center mb-8">
          <FaHome className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-bold">Admin</h2>
        </div>
        <nav className="space-y-2">
          {Object.entries(tabs).map(([key, tab]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center p-3 rounded-lg transition duration-300 text-left w-full ${
                activeTab === key
                  ? "bg-orange-600 font-semibold"
                  : "hover:bg-orange-500"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header non fixe avec fond orange */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center text-orange-500">
          <div className="flex items-center">
            <FaUserCircle className="w-6 h-6 mr-2" />
            <span className="font-medium">Bonjour, {user?.name}</span>
          </div>

          <div className="flex items-center gap-4">
            

            <button
              onClick={HandleLogout}
              className="flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-full shadow hover:bg-orange-100 transition"
            >
              Déconnecter
            </button>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {tabs[activeTab].component}
        </main>
      </div>
    </div>
  );
};

export default Admin;
