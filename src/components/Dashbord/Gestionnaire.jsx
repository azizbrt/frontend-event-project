import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import GestionInscriptions from "./GestionInscriptions";
import CRUDevenement from "./CRUDevenement";

const Gestionnaire = () => {
 const [selectedFeature, setSelectedFeature] = useState("users");

  // Gérer la sélection d'une fonctionnalité dans la barre latérale
  const handleFeatureSelection = (feature) => {
    setSelectedFeature(feature);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-orange-400 to-orange-400 text-white h-screen p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Gestionnaire</h2>
        <nav>
          <ul className="space-y-4">
            <li
              onClick={() => handleFeatureSelection("users")}
              className={`cursor-pointer flex items-center gap-3 p-2 rounded-lg ${
                selectedFeature === "users" ? "bg-orange-600" : "hover:bg-orange-400"
              } transition duration-300`}
            >
              <span>👥</span> Gérer les inscription
            </li>
         
            <li
              onClick={() => handleFeatureSelection("events")}
              className={`cursor-pointer flex items-center gap-3 p-2 rounded-lg ${
                selectedFeature === "events" ? "bg-orange-600" : "hover:bg-orange-400"
              } transition duration-300`}
            >
              <span>📦</span> Gérer les événements
            </li>
            <li
              onClick={() => handleFeatureSelection("statistics")}
              className={`cursor-pointer flex items-center gap-3 p-2 rounded-lg ${
                selectedFeature === "statistics" ? "bg-orange-600" : "hover:bg-orange-400"
              } transition duration-300`}
            >
              <span>⚙️</span> Statistiques globales
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
          
            <span className="font-semibold text-gray-700">Bonjour, Gestionnaire</span>
          </div>
          <div className="relative group hidden sm:block">
  <input
    type="text"
    placeholder="search"
    className="w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none 
               dark:border-orange-400 dark:bg-gray-800 hover:border-orange-500"
  />
  <IoMdSearch className="text-gray-500 group-hover:text-orange-500 absolute top-1/2 -translate-y-1/2 right-3" />
</div>

        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedFeature === "users" && <GestionInscriptions/>}
       
          {selectedFeature === "events" && <CRUDevenement/>}
          {selectedFeature === "statistics" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-orange-400 mb-4">Statistiques globales</h2>
              <p className="text-gray-600">
                Contenu pour accéder aux statistiques globales...
              </p>
            </div>
          )}
         
        </div>
      </div>
    </div>
  );
};

export default Gestionnaire;
