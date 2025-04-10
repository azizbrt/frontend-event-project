import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, CalendarDays } from "lucide-react";
import useEventStore from "../../store/useEventStore ";

const CardSection = () => {
  const { latestEvents, fetchEvents, loading, error } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-orange-500 font-semibold mb-2">
            DÉCOUVREZ NOS ÉVÉNEMENTS
          </p>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Prochains Événements
          </h1>
          <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
        </div>

        {/* Loading/Error */}
        {loading && <p className="text-center text-gray-500">Chargement...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {latestEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img
                  src={`http://localhost:8000/images/${event.image}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  alt={event.titre}
                />
                <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Nouveau
                </div>
              </div>

              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  {event.lieu}
                </div>
                <h3 className="text-lg font-semibold truncate block max-w-full">
                  {event.titre}
                </h3>

                <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-orange-500" />
                  {new Date(event.dateDebut).toLocaleDateString("fr-FR")}
                </div>
                <Link
                  to={`/events/${event._id}`}
                  className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Voir détails
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Voir tous les événements */}
        <div className="text-center mt-12">
          <Link
            to="/events"
            className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-medium py-2 px-6 rounded-full transition-colors duration-300"
          >
            Voir tous les événements
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardSection;
