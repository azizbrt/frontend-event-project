import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUsers, FaEdit, FaTimes } from "react-icons/fa";
import { useEventById, useUpdateEvent } from "../../hooks/useEvents";
import toast from "react-hot-toast";

const ModifyEvent = ({ eventId, isOpen, onClose }) => {
  const { data: event, isLoading, isError } = useEventById(eventId);
  const { mutate: updateEvent, isPending } = useUpdateEvent();

  const [formData, setFormData] = useState({
    titre: "",
    typeEvenement: "",
    dateDebut: "",
    dateFin: "",
    capacite: "",
    description: "",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        titre: event.titre || "",
        typeEvenement: event.typeEvenement || "",
        dateDebut: event.dateDebut?.slice(0, 10) || "",
        dateFin: event.dateFin?.slice(0, 10) || "",
        capacite: event.capacite || "",
        description: event.description || "",
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEvent(
      {
        id: eventId,
        updatedData: {
          ...formData,
          dateDebut: new Date(formData.dateDebut).toISOString(),
          dateFin: formData.dateFin ? new Date(formData.dateFin).toISOString() : null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Événement mis à jour !");
          onClose();
        },
        onError: (err) => {
          toast.error("Erreur lors de la mise à jour !");
          console.error(err);
        },
      }
    );
  };

  if (isLoading) return <div className="text-center p-8">Chargement...</div>;
  if (isError) return <div className="text-center p-8 text-red-500">Erreur de chargement</div>;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/30"
      />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-xl bg-white shadow-xl overflow-hidden"
        >
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <Dialog.Title className="text-xl font-bold flex items-center gap-2">
              <FaEdit /> Modifier l'événement
            </Dialog.Title>
            <button onClick={onClose} className="text-white hover:text-blue-200">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-1"
            >
              <label className="block text-sm font-medium text-gray-700">Titre</label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-1"
            >
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="typeEvenement"
                value={formData.typeEvenement}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="Presentiel">Présentiel</option>
                <option value="enligne">En ligne</option>
                <option value="hybride">Hybride</option>
              </select>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-1"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaCalendarAlt /> Début
                </label>
                <input
                  type="date"
                  name="dateDebut"
                  value={formData.dateDebut}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-1"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaCalendarAlt /> Fin
                </label>
                <input
                  type="date"
                  name="dateFin"
                  value={formData.dateFin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-1"
            >
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaUsers /> Capacité
              </label>
              <input
                type="number"
                name="capacite"
                value={formData.capacite}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-1"
            >
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-end gap-3 pt-4"
            >
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isPending}
                className={`px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${
                  isPending ? "opacity-70" : ""
                }`}
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <FaEdit /> Enregistrer
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModifyEvent;