import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Filter,
  CalendarDays,
  FolderOpen,
  MapPin,
  Users,
  X,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useEvents } from "../../hooks/useEvents";
import { useGetCategories } from "../../hooks/useCategorie";

const Event = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);

  const { data: eventsData, isLoading, isError } = useEvents();
  const { data: categoriesData } = useGetCategories();

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedDate("");
    setSearchTerm("");
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredEvents =
    eventsData?.events?.filter((event) => {
      if (event.etat !== "accepter") return false;

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(event.categorieName);

      const matchesDate =
        !selectedDate ||
        new Date(event.dateDebut).toISOString().split("T")[0] === selectedDate;

      const matchesSearch =
        !searchTerm ||
        [event.titre, event.description, event.organisateur?.name].some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchesCategory && matchesDate && matchesSearch;
    }) || [];

  const visibleEvents = showAllEvents
    ? filteredEvents
    : filteredEvents.slice(0, 6);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Erreur lors du chargement des événements</p>
      </div>
    );

  const categories = categoriesData?.map((cat) => cat.name) || [];
  const visibleCategories = categoriesExpanded
    ? categories
    : categories.slice(0, 5);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <button
        onClick={() => setMobileFiltersOpen(true)}
        className="md:hidden fixed bottom-6 right-6 bg-orange-500 text-white p-3 rounded-full shadow-lg z-20"
      >
        <Filter size={24} />
      </button>

      <main className="flex-grow container mx-auto px-4 pt-36 py-10 flex flex-col md:flex-row gap-6">
        {/* Filtres */}
        <aside className="hidden md:block w-90 bg-white p-5 rounded-xl shadow-sm h-fit sticky top-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Filter className="text-orange-500" /> Filters
            </h2>
            <button
              onClick={resetFilters}
              className="text-sm text-orange-500 hover:underline"
            >
              Reset all
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Date Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <CalendarDays size={18} className="text-gray-500" /> Date
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          {/* Categories */}
          <div className="mb-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium flex items-center gap-2">
                <FolderOpen size={18} className="text-gray-500" /> Categories
              </h3>
              {categories.length > 5 && (
                <button
                  onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                  className="text-sm text-orange-500"
                >
                  {categoriesExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
            <div className="mt-3 space-y-2">
              {visibleCategories.map((category) => (
                <label key={category} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="group-hover:text-orange-600">{category}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Liste des événements */}
        <section className="flex-grow">
          {(selectedCategories.length > 0 || selectedDate) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map((category) => (
                <span key={category} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {category}
                  <button
                    onClick={() => handleCategoryChange(category)}
                    className="ml-2 hover:text-orange-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              {selectedDate && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {new Date(selectedDate).toLocaleDateString()}
                  <button
                    onClick={() => setSelectedDate("")}
                    className="ml-2 hover:text-blue-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}

          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CalendarDays className="text-orange-500" />
            {filteredEvents.length} événements à venir
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleEvents.length > 0 ? (
              visibleEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={`http://localhost:8000/images/${event.image}`}
                      alt={event.titre}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x200?text=Image+manquante";
                      }}
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-1">{event.titre}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FolderOpen size={16} />
                          <span>{event.categorieName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <CalendarDays size={16} />
                          <span>
                            {new Date(event.dateDebut).toLocaleDateString()} -{" "}
                            {new Date(event.dateFin).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin size={16} />
                          <span>{event.lieu}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Users size={16} />
                          <span>{event.capacite} places</span>
                        </div>
                        {event.prix > 0 && (
                          <div className="font-medium text-orange-600">{event.prix} DT</div>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/events/${event._id}`}
                      className="mt-auto block w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Voir détails
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 mb-4">Aucun événement trouvé</p>
                <button onClick={resetFilters} className="text-orange-500 hover:underline">
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>

          {filteredEvents.length > 6 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowAllEvents(!showAllEvents)}
                className="inline-flex items-center gap-2 text-orange-500 hover:underline"
              >
                {showAllEvents ? "Voir moins" : "Voir plus"}
                {showAllEvents ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Event;
