import React from "react";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaHourglassStart,
  FaCalendarTimes,
} from "react-icons/fa";
import { useEventsByGestionnaire, useDeleteEvent } from "../../hooks/useEvents";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";

const EventsList = () => {
    const { user, isCheckingAuth } = useAuthStore();
    const {
      data: events = [],
      isLoading,
      isError,
      error,
    } = useEventsByGestionnaire(user?.name);
    console.log("Current user:", user);
    console.log("Events data:", events);
    console.log("Loading states:", { isCheckingAuth, isLoading, isError });
    
    const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();
  
    const handleDelete = (eventId) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
        deleteEvent(eventId, {
          onSuccess: () => {
            toast.success("Événement supprimé avec succès");
          },
          onError: (err) => {
            toast.error(`Erreur lors de la suppression: ${err.message}`);
          }
        });
      }
    };

  const getStatusIcon = (etat) => {
    switch (etat.toLowerCase()) {
      case "en attendant":
        return <FaHourglassStart className="text-blue-500" />;
      case "accepter":
        return <FaCheckCircle className="text-green-500" />;
      case "refusé":
        return <FaCalendarTimes className="text-gray-500" />;
      default:
        return <FaCheckCircle className="text-gray-400" />;
    }
  };

  if (isCheckingAuth) return <div className="text-center p-4">Vérification de l'authentification...</div>;
  if (isLoading) return <p className="text-gray-600 text-lg">Chargement...</p>;
  if (isError) return <p className="text-red-500 text-lg">Erreur: {error.message}</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Événements créés</h3>

      {events.length > 0 ? (
        <>
          {/* Desktop View */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-600">
                  <th className="p-3 border-b">Titre</th>
                  <th className="p-3 border-b">Type</th>
                  <th className="p-3 border-b">Dates</th>
                  <th className="p-3 border-b">État</th>
                  <th className="p-3 border-b">Capacité</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <EventRow 
                    key={event._id}
                    event={event}
                    onDelete={handleDelete}
                    getStatusIcon={getStatusIcon}
                    isDeleting={isDeleting}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden mt-4 space-y-4">
            {events.map((event) => (
              <EventCardMobile
                key={event._id}
                event={event}
                onDelete={handleDelete}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-600">Aucun événement trouvé.</p>
      )}
    </div>
  );
};

// Extracted components
const EventRow = ({ event, onDelete, getStatusIcon, isDeleting }) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="hover:bg-gray-50 transition-colors"
  >
    <td className="p-3 border-b text-gray-800">{event.titre}</td>
    <td className="p-3 border-b text-gray-600">{event.typeEvenement}</td>
    <td className="p-3 border-b text-gray-600">
      <div className="flex flex-col">
        <span>{new Date(event.dateDebut).toLocaleDateString()}</span>
        <span className="text-xs text-gray-400">
          {new Date(event.dateDebut).toLocaleTimeString()}
        </span>
      </div>
    </td>
    <td className="p-3 border-b">
      <div className="flex items-center gap-2">
        {getStatusIcon(event.etat)}
        <span className="text-sm capitalize">{event.etat.toLowerCase()}</span>
      </div>
    </td>
    <td className="p-3 border-b text-gray-600">{event.capacite}</td>
    <td className="p-3 border-b">
      <div className="flex gap-2">
        <button
          className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
          title="Modifier"
        >
          <FaEdit />
        </button>
        <button
          className="p-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
          title="Supprimer"
          onClick={() => onDelete(event._id)}
          disabled={isDeleting}
        >
          <FaTrash />
        </button>
      </div>
    </td>
  </motion.tr>
);

const EventCardMobile = ({ event, onDelete, getStatusIcon }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="p-4 bg-gray-50 rounded-lg shadow-sm"
  >
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-medium text-gray-800">{event.titre}</h4>
      <div className="flex gap-2">
        <button className="text-blue-600"><FaEdit /></button>
        <button 
          className="text-red-600" 
          onClick={() => onDelete(event._id)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
    <div className="space-y-1 text-sm">
      <p><span className="text-gray-600">Type:</span> {event.typeEvenement}</p>
      <p><span className="text-gray-600">Date:</span> {new Date(event.dateDebut).toLocaleDateString()}</p>
      <div className="flex items-center gap-2">
        {getStatusIcon(event.etat)}
        <span className="capitalize">{event.etat.toLowerCase()}</span>
      </div>
      <p><span className="text-gray-600">Capacité:</span> {event.capacite}</p>
    </div>
  </motion.div>
);

export default EventsList;