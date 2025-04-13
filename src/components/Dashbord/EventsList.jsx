import React, { useState } from "react";
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
import ModifyEvent from "./ModifyEvent"; // Don't forget to import this!

const EventsList = () => {
  // 1. All the important things we need to remember
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const { user, isCheckingAuth } = useAuthStore();
  const {
    data: events = [],
    isLoading,
    isError,
    error,
  } = useEventsByGestionnaire(user?.name);
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  // 2. How to choose which event to modify
  const handleModify = (event) => {
    setSelectedEvent(event);
    setIsModifyOpen(true);
  };

  // 3. How to delete an event
  const handleDelete = (eventId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      deleteEvent(eventId, {
        onSuccess: () => toast.success("Événement supprimé avec succès"),
        onError: (err) =>
          toast.error(`Erreur lors de la suppression: ${err.message}`),
      });
    }
  };

  // 4. How to show the status icon
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

  // 5. Show loading messages if we're waiting
  if (isCheckingAuth)
    return (
      <div className="text-center p-4">
        Vérification de l'authentification...
      </div>
    );
  if (isLoading) return <p className="text-gray-600 text-lg">Chargement...</p>;
  if (isError)
    return <p className="text-red-500 text-lg">Erreur: {error.message}</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Événements créés</h3>

      {events.length > 0 ? (
        <>
          {/* Big screen view */}
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
                    onModify={handleModify}
                    onDelete={handleDelete}
                    getStatusIcon={getStatusIcon}
                    isDeleting={isDeleting}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Small screen view */}
          <div className="md:hidden mt-4 space-y-4">
            {events.map((event) => (
              <EventCardMobile
                key={event._id}
                event={event}
                onModify={handleModify}
                onDelete={handleDelete}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-600">Aucun événement trouvé.</p>
      )}

      {/* The popup for editing */}
      {selectedEvent && (
        <ModifyEvent
          eventId={selectedEvent._id} // Pass ID instead of full event
          isOpen={isModifyOpen}
          onClose={() => setIsModifyOpen(false)}
        />
      )}
    </div>
  );
};

// Component for each row in the table
const EventRow = ({ event, onModify, onDelete, getStatusIcon, isDeleting }) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="hover:bg-gray-50"
  >
    <td className="p-3 border-b">{event.titre}</td>
    <td className="p-3 border-b">{event.typeEvenement}</td>
    <td className="p-3 border-b">
      {new Date(event.dateDebut).toLocaleDateString()}
      <span className="text-xs text-gray-400 block">
        {new Date(event.dateDebut).toLocaleTimeString()}
      </span>
    </td>
    <td className="p-3 border-b">
      <div className="flex items-center gap-2">
        {getStatusIcon(event.etat)}
        <span>{event.etat.toLowerCase()}</span>
      </div>
    </td>
    <td className="p-3 border-b">{event.capacite}</td>
    <td className="p-3 border-b">
      <div className="flex gap-2">
        <button onClick={() => onModify(event)} className="text-blue-600 p-2">
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(event._id)}
          disabled={isDeleting}
          className="text-red-600 p-2"
        >
          <FaTrash />
        </button>
      </div>
    </td>
  </motion.tr>
);

// Component for mobile view
const EventCardMobile = ({ event, onModify, onDelete, getStatusIcon }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-4 bg-gray-50 rounded-lg"
  >
    <div className="flex justify-between mb-2">
      <h4 className="font-medium">{event.titre}</h4>
      <div className="flex gap-2">
        <button onClick={() => onModify(event)} className="text-blue-600">
          <FaEdit />
        </button>
        <button onClick={() => onDelete(event._id)} className="text-red-600">
          <FaTrash />
        </button>
      </div>
    </div>
    <div className="space-y-1 text-sm">
      <p>Type: {event.typeEvenement}</p>
      <p>Date: {new Date(event.dateDebut).toLocaleDateString()}</p>
      <div className="flex items-center gap-2">
        {getStatusIcon(event.etat)}
        <span>{event.etat.toLowerCase()}</span>
      </div>
      <p>Capacité: {event.capacite}</p>
    </div>
  </motion.div>
);

export default EventsList;
