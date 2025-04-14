import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaHourglassStart,
  FaCalendarTimes,
  FaCheck,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { useEvents, useDeleteEvent, useUpdateEventStatus } from "../../hooks/useEvents";
import { toast } from "react-hot-toast";
import ModifyEvent from "./ModifyEvent";

const AdminEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const { data, isLoading, isError } = useEvents();
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateEventStatus();

  const handleModify = (event) => {
    setSelectedEvent(event);
    setIsModifyOpen(true);
  };

  const handleDelete = (eventId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      deleteEvent(eventId, {
        onSuccess: () => toast.success("Événement supprimé avec succès"),
        onError: (err) => toast.error(`Erreur lors de la suppression: ${err.message}`),
      });
    }
  };

  const handleApprove = (eventId) => {
    updateStatus(
      { id:eventId, etat: "accepter" },
      {
        onSuccess: () => toast.success("Événement approuvé"),
        onError: (err) => toast.error(`Erreur: ${err.message}`),
      }
    );
  };

  const handleReject = (eventId) => {
    updateStatus(
      { id:eventId, etat: "refusé" },
      {
        onSuccess: () => toast.success("Événement refusé"),
        onError: (err) => toast.error(`Erreur: ${err.message}`),
      }
    );
  };

  const getStatusIcon = (etat) => {
    switch (etat.toLowerCase()) {
      case "en attendant":
        return <FaHourglassStart className="text-blue-500" />;
      case "accepter":
        return <FaCheckCircle className="text-green-500" />;
      case "refusé":
        return <FaCalendarTimes className="text-red-500" />;
      default:
        return <FaCheckCircle className="text-gray-400" />;
    }
  };

  const filteredEvents =
    data?.events?.filter(
      (event) =>
        event.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organisateur?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (isLoading) return <p className="text-center mt-10">Chargement...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        Erreur lors du chargement des événements.
      </p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-semibold">📋 Gestion des Événements</h2>
        <div className="relative w-72">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par titre ou organisateur"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-sm text-gray-600">
                <th className="p-3 border-b">Titre</th>
                <th className="p-3 border-b">Organisateur</th>
                <th className="p-3 border-b">Type</th>
                <th className="p-3 border-b">État</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event, index) => (
                <motion.tr
                  key={event._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-gray-50"
                >
                  <td className="p-3 border-b">{event.titre}</td>
                  <td className="p-3 border-b">{event.organisateur}</td>
                  <td className="p-3 border-b">{event.typeEvenement}</td>
                  <td className="p-3 border-b">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(event.etat)}
                      <span>{event.etat.toLowerCase()}</span>
                    </div>
                  </td>
                  <td className="p-3 border-b">
                    <div className="flex gap-3">
                      {event.etat === "en attendant" && (
                        <>
                          <button
                            onClick={() => handleApprove(event._id, "accepter")}
                            disabled={isUpdating}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                            title="Approuver"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleReject(event._id)}
                            disabled={isUpdating}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                            title="Rejeter"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleModify(event)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        disabled={isDeleting}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Mobile View */}
      <div className="md:hidden mt-6 space-y-4">
        {filteredEvents.map((event) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{event.titre}</h3>
                <p className="text-sm text-gray-600">{event.organisateur}</p>
              </div>
              <div className="flex gap-2">
                {event.etat === "en attendant" && (
                  <>
                    <button
                      onClick={() => handleApprove(event._id)}
                      disabled={isUpdating}
                      className="p-1 text-green-600"
                    >
                      <FaCheck size={14} />
                    </button>
                    <button
                      onClick={() => handleReject(event._id)}
                      disabled={isUpdating}
                      className="p-1 text-red-600"
                    >
                      <FaTimes size={14} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleModify(event)}
                  className="p-1 text-blue-600"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  disabled={isDeleting}
                  className="p-1 text-red-600"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <p>Type: {event.typeEvenement}</p>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(event.etat)}
                <span>{event.etat.toLowerCase()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modification Modal */}
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

export default AdminEvents;