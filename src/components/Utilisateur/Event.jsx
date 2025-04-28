import { Link } from "react-router-dom";
import {
  Filter,
  CalendarDays,
  FolderOpen,
  MapPin,
  Users,
  Tag,
} from "lucide-react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useState } from "react";
import { useEvents } from "../../hooks/useEvents";
import { useGetCategories } from "../../hooks/useCategorie";

const Event = () => {
  // États pour gérer les filtres
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Récupérer les données
  const {
    data: eventsData,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useEvents();

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategories();

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedDate("");
    setSearchTerm("");
  };

  // Fonction pour ajouter ou enlever une catégorie du filtre
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Filtrage des événements
  const filteredEvents =
    eventsData?.events?.filter((event) => {
      // Filter by status
      if (event.etat !== "accepter") return false;

      // Category filter
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(event.categorieName);

      // Date filter
      const dateMatch =
        !selectedDate ||
        new Date(event.dateDebut).toISOString().split("T")[0] === selectedDate;

      // Search filter
      const searchMatch =
        !searchTerm ||
        event.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.organisateur?.name &&
          event.organisateur.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      return categoryMatch && dateMatch && searchMatch;
    }) || [];

  // Affichage de l'état de chargement ou d'erreur
  if (eventsLoading || categoriesLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Chargement...</p>
      </div>
    );

  if (eventsError || categoriesError)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error loading data.</p>
      </div>
    );

  // Extract category names from categoriesData
  const categories = categoriesData?.map((cat) => cat.name) || [];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-10 flex flex-col md:flex-row gap-6">
        {/* Filtres */}
        <aside className="w-full md:w-64 lg:w-80 bg-white p-4 rounded-lg shadow-md h-fit sticky top-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-orange-500" /> Filtres
          </h2>

          {/* Search bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Filtres par catégories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Catégories</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map((category, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2"
                >
                  <input
                    type="checkbox"
                    id={`category-${idx}`}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="accent-orange-500"
                  />
                  <label
                    htmlFor={`category-${idx}`}
                    className="text-sm text-gray-700"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Filtres par date */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Date</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Bouton de réinitialisation des filtres */}
          <button
            onClick={resetFilters}
            className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-all duration-200 active:scale-95"
          >
            Réinitialiser
          </button>
        </aside>

        {/* Liste des événements */}
        <section className="flex-grow">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2">
            <CalendarDays className="w-6 h-6 text-orange-500" /> Événements à
            venir
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition duration-200"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={`http://localhost:8000/images/${event.image}`}
                      alt={event.titre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {event.titre}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {event.description}
                    </p>

                    <div className="text-sm text-gray-500 space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-gray-500" />
                        <span>{event.categorieName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        <span>
                          {new Date(event.dateDebut).toLocaleDateString()} -{" "}
                          {new Date(event.dateFin).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{event.lieu}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{event.capacite} places</span>
                      </div>
                      {event.prix > 0 && (
                        <div className="font-semibold text-orange-500">
                          {event.prix} DT
                        </div>
                      )}
                      {event.tag?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <Tag className="w-4 h-4 text-gray-500" />
                          {event.tag.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-100 px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/events/${event._id}`}
                      className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                      Voir détails
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 mb-4">Aucun événement trouvé.</p>
                <button
                  onClick={resetFilters}
                  className="text-orange-500 hover:text-orange-600 underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Event;
