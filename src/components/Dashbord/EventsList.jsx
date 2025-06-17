import { useEffect, useState } from "react";
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
import ModifyEvent from "./ModifyEvent";
import Swal from "sweetalert2";

const EventsList = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const { user, isCheckingAuth } = useAuthStore();
  const {
    data: events,
    isLoading,
    isError,
    error,
    refetch,
  } = useEventsByGestionnaire(user?._id);

  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  useEffect(() => {
    if (!isCheckingAuth && user?._id) {
      refetch();
    }
  }, [user?._id, isCheckingAuth, refetch]);

  const handleModify = (event) => {
    setSelectedEvent(event);
    setIsModifyOpen(true);
  };

  const handleDelete = (eventId) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera l'événement définitivement.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEvent(eventId, {
          onSuccess: () => {
            Swal.fire("Supprimé !", "L'événement a été supprimé.", "success");
          },
          onError: (err) => {
            Swal.fire(
              "Erreur",
              `La suppression a échoué: ${err.message}`,
              "error"
            );
          },
        });
      }
    });
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

      {events?.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-500 text-left text-sm text-white">
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

      {selectedEvent && (
        <ModifyEvent
          eventId={selectedEvent._id}
          isOpen={isModifyOpen}
          onClose={() => setIsModifyOpen(false)}
        />
      )}
    </div>
  );
};

const EventRow = ({ event, onModify, onDelete, getStatusIcon, isDeleting }) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="hover:bg-orange-50"
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
