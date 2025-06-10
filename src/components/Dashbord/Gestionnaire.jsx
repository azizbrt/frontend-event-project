import React, { useState } from "react";
import { Users, Calendar, BarChart, Home, UserCircle, Search, LogOut } from "lucide-react";
import GestionInscriptions from "./GestionInscriptions";
import CRUDevenement from "./CRUDevenement";
import StatestiqueGestionnaire from "./StatestiqueGestionnaire";
import { useAuthStore } from "../../store/authStore";
import { useNavigate} from "react-router-dom";

const Gestionnaire = () => {
   const {  user, logout } = useAuthStore();
  const navigate = useNavigate();
  const Handelelogout = () =>{
    navigate("/");
    logout();
  }// on récupère la méthode logout
  const [activeTab, setActiveTab] = useState("inscriptions");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = {
    inscriptions: {
      label: "Gérer les inscriptions",
      icon: <Users className="mr-2 w-5 h-5" />,
      component: <GestionInscriptions searchTerm={searchTerm} />,
    },
    evenements: {
      label: "Gérer les événements",
      icon: <Calendar className="mr-2 w-5 h-5" />,
      component: <CRUDevenement searchTerm={searchTerm} />,
    },
    statistiques: {
      label: "Statistiques",
      icon: <BarChart className="mr-2 w-5 h-5" />,
      component: <StatestiqueGestionnaire />,
    },
  };

  const handleLogout = () => {
    logout(); // Appelle la fonction de déconnexion du store
    // Eventuellement rediriger vers login ou page d'accueil ici, par exemple :
    // navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-orange-500 to-orange-600 text-white p-6 shadow-lg">
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
                activeTab === id
                  ? "bg-white text-orange-600 shadow-md"
                  : "hover:bg-orange-400"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <UserCircle className="text-orange-500 w-6 h-6 mr-2" />
            <span className="font-medium text-gray-700">Bonjour, {user?.name}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Barre de recherche */}
            {(activeTab === "inscriptions" || activeTab === "evenements") && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            )}

            {/* Bouton Déconnecter */}
            <button
            onClick={ Handelelogout}
            className="flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-full shadow hover:bg-orange-100 transition"
          >
            
            Déconnecter
          </button>
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
