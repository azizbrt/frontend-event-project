import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, BarChart, Home, UserCircle, Search } from "lucide-react";
import GestionInscriptions from "./GestionInscriptions";
import CRUDevenement from "./CRUDevenement";
import { useAuthStore } from "../../store/authStore";

const Gestionnaire = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("inscriptions");

  const tabs = {
    inscriptions: {
      label: "Gérer les inscriptions",
      icon: <Users className="mr-2 w-5 h-5" />,
      component: <GestionInscriptions />,
    },
    evenements: {
      label: "Gérer les événements",
      icon: <Calendar className="mr-2 w-5 h-5" />,
      component: <CRUDevenement />,
    },
    statistiques: {
      label: "Statistiques",
      icon: <BarChart className="mr-2 w-5 h-5" />,
      component: <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-orange-500 mb-4">Statistiques globales</h2>
        <p className="text-gray-600">Tableau de bord des statistiques à venir...</p>
      </div>,
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-orange-500 to-orange-600 text-white p-6 shadow-lg">
        <div className="flex items-center mb-8">
          <Home className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-bold">Espace Gestionnaire</h2>
        </div>

        <nav className="space-y-2">
          {Object.entries(tabs).map(([id, tab]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full text-left flex items-center p-3 rounded-lg transition ${
                activeTab === id ? "bg-white text-orange-600 shadow-md" : "hover:bg-orange-400"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <UserCircle className="text-orange-500 w-6 h-6 mr-2" />
            <span className="font-medium text-gray-700">Bonjour, {user?.name}</span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-48 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {tabs[activeTab].component}
        </main>
      </div>
    </div>
  );
};

export default Gestionnaire;