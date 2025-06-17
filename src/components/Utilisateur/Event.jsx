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
        [event.titre, event.description, event.organisateur?.name].some(
          (field) => field?.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Mobile Filter Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition mt-16"
          aria-label="Open filters"
        >
          <Filter size={24} />
        </button>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <>
          {/* Dimmed Background */}
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            aria-hidden="true"
          />

          {/* Sliding Drawer */}
          <aside className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl p-6 z-50 transform transition-transform duration-300 ease-in-out">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Filter className="text-orange-500" /> Filtres
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-orange-500 text-2xl font-bold leading-none"
                aria-label="Close filters"
              >
                ×
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Rechercher des événements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Date Filter */}
            <div className="mb-6">
              <label className="font-medium mb-2 flex items-center gap-2 text-gray-700">
                <CalendarDays size={18} /> Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Categories */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium flex items-center gap-2 text-gray-700">
                  <FolderOpen size={18} /> Catégories
                </label>
                {categories.length > 5 && (
                  <button
                    onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                    className="text-sm text-orange-500"
                  >
                    {categoriesExpanded ? "Voir moins" : "Voir plus"}
                  </button>
                )}
              </div>
              <div className="max-h-40 overflow-auto space-y-2">
                {visibleCategories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                resetFilters();
                setMobileFiltersOpen(false);
              }}
              className="w-full mt-6 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Réinitialiser les filtres
            </button>
          </aside>
        </>
      )}

      <main className="flex-grow container mx-auto px-4 pt-36 py-10 flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="hidden md:block w-80 bg-white p-6 rounded-xl shadow-sm h-fit sticky top-28">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              <Filter className="text-orange-500" size={20} />
              Filters
            </h2>
            <button
              onClick={resetFilters}
              className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
            >
              Reset all
            </button>
          </div>

          {/* Search Box */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Date Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-700">
              <CalendarDays size={18} className="text-orange-500" />
              Date
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Categories Filter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium flex items-center gap-2 text-gray-700">
                <FolderOpen size={18} className="text-orange-500" />
                Categories
              </h3>
              {categories.length > 5 && (
                <button
                  onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                  className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
                >
                  {categoriesExpanded ? "Voir moins" : "Voir plus"}
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {visibleCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 cursor-pointer select-none py-1.5 group"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400 transition"
                  />
                  <span className="group-hover:text-orange-600 transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Events List */}
        <section className="flex-grow">
          {/* Active Filters */}
          {(selectedCategories.length > 0 || selectedDate) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5"
                >
                  {category}
                  <button
                    onClick={() => handleCategoryChange(category)}
                    className="text-orange-600 hover:text-orange-800 transition-colors"
                    aria-label={`Remove ${category} filter`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              {selectedDate && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                  {new Date(selectedDate).toLocaleDateString()}
                  <button
                    onClick={() => setSelectedDate("")}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label="Remove date filter"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Events Count */}
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
            <CalendarDays className="text-orange-500" size={24} />
            {filteredEvents.length} upcoming events
          </h1>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleEvents.length > 0 ? (
              visibleEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full border border-gray-100 hover:border-orange-100"
                >
                  {/* Event Image */}
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={`http://localhost:8000/images/${event.image}`}
                      alt={event.titre}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=Event+Image";
                      }}
                    />
                    {event.prix > 0 && (
                      <span className="absolute top-3 right-3 bg-orange-500 text-white px-2.5 py-1 rounded-full text-xs font-medium shadow-sm">
                        {event.prix} DT
                      </span>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1">
                      {event.titre}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-3 text-sm mb-5">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FolderOpen size={16} className="text-orange-500" />
                        <span>{event.categorieName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <CalendarDays size={16} className="text-orange-500" />
                        <span>
                          {new Date(event.dateDebut).toLocaleDateString()} -{" "}
                          {new Date(event.dateFin).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin size={16} className="text-orange-500" />
                        <span className="line-clamp-1">{event.lieu}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users size={16} className="text-orange-500" />
                        <span>{event.capacite} places disponibles</span>
                      </div>
                    </div>

                    <Link
                      to={`/events/${event._id}`}
                      className="mt-auto w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded-lg transition-colors font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="text-gray-400 mb-4">
                    <CalendarDays size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No events found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your filters or search term
                  </p>
                  <button
                    onClick={resetFilters}
                    className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Show More/Less Button */}
          {filteredEvents.length > 6 && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setShowAllEvents(!showAllEvents)}
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                {showAllEvents ? "Voir moins" : "Voir plus events"}
                {showAllEvents ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
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
