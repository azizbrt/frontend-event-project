import React from "react";
import { motion } from "framer-motion";
import { FaTimes, FaCheck, FaTimesCircle } from "react-icons/fa";

const EventDetailsModal = ({ 
  event, 
  isOpen, 
  onClose, 
  handleApprove, 
  handleReject, 
  isUpdating 
}) => {
  if (!isOpen || !event) return null;
  

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white max-w-2xl w-full rounded-xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
          disabled={isUpdating}
        >
          <FaTimes />
        </button>

        {/* Event Title */}
        <h2 className="text-2xl font-bold mb-4">{event.titre}</h2>

        {/* Event Image */}
        <div className="mb-4">
          <img
            src={`http://localhost:8000/images/${event.image}`}
            alt={`Image de ${event.titre}`}
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>

        {/* Event Details */}
        <div className="space-y-4 text-gray-700 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Type :</strong> {event.typeEvenement}</p>
              <p><strong>Catégorie :</strong> {event.categorieName}</p>
            </div>
            <div>
              <p><strong>Lieu :</strong> {event.lieu}</p>
              <p><strong>Capacité :</strong> {event.capacite} participants</p>
            </div>
            <div>
              <p><strong>Date début :</strong> {new Date(event.dateDebut).toLocaleString()}</p>
              <p><strong>Date fin :</strong> {new Date(event.dateFin).toLocaleString()}</p>
            </div>
            <div>
              <p><strong>Prix :</strong> {event.prix} TND</p>
              <p><strong>Organisateur :</strong> {event.organisateur?.name}</p>
            </div>
          </div>
          
          {/* Event Tags */}
          {event.tag?.length > 0 && (
            <div>
              <strong>Tags :</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {event.tag.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Event Description */}
          <div>
            <strong>Description :</strong>
            <p className="mt-2 whitespace-pre-line">{event.description}</p>
          </div>

          {/* Event Status */}
          <div className="flex items-center gap-4 pt-4">
            <strong>État :</strong>
            {event.etat === "en attendant" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {handleApprove(event._id);onClose();}}
                  disabled={isUpdating}
                  
                  className="flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 rounded-full text-green-700 text-sm"
                >
                  <FaCheck size={14} />
                  Accepter
                </button>
                <button
                  onClick={() => {handleReject(event._id);onClose();}}
                  disabled={isUpdating}

                  className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 rounded-full text-red-700 text-sm"
                >
                  <FaTimesCircle size={14} />
                  Refuser
                </button>
              </div>
            ) : (
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs ${
                  event.etat === "accepter"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {event.etat}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventDetailsModal;