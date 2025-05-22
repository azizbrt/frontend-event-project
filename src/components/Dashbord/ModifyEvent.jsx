import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUsers, FaEdit, FaTimes } from "react-icons/fa";
import { useEventById, useUpdateEvent } from "../../hooks/useEvents";
import toast from "react-hot-toast";
import { useGetCategories } from "../../hooks/useCategorie";

const ModifyEvent = ({ eventId, isOpen, onClose }) => {
  const { data: event, isLoading, isError } = useEventById(eventId);
  const { mutate: updateEvent, isPending } = useUpdateEvent();
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();

  const [formData, setFormData] = useState({
    titre: "",
    typeEvenement: "",
    dateDebut: "",
    dateFin: "",
    capacite: "",
    description: "",
    image: null,
    prix: "",
    categorieName: "",
    tag: [],
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
        image: null,
        prix: event.prix || "",
        categorieName: event.categorieName || "",
        tag: event.tag || [],
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("titre", formData.titre);
    form.append("typeEvenement", formData.typeEvenement);
    form.append("dateDebut", new Date(formData.dateDebut).toISOString());
    form.append(
      "dateFin",
      formData.dateFin ? new Date(formData.dateFin).toISOString() : ""
    );
    form.append("capacite", formData.capacite);
    form.append("description", formData.description);
    form.append("prix", formData.prix);
    form.append("categorieName", formData.categorieName);
    form.append("tag", JSON.stringify(formData.tag));


    if (formData.image) {
      form.append("image", formData.image);
    }

    updateEvent(
      { id: eventId, updatedData: form },
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
  if (isError)
    return (
      <div className="text-center p-8 text-red-500">Erreur de chargement</div>
    );

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
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200"
            >
              <FaTimes />
            </button>
          </div>
          <div className="max-h-[80vh] overflow-y-auto p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-1"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Titre
                </label>
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
                transition={{ delay: 0.37 }}
                className="space-y-1"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Prix
                </label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {parseFloat(formData.prix) === 0 && (
                  <p className="text-green-600 text-sm font-medium mt-1">
                    Cet événement est <strong>Gratuit</strong>
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-1"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
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
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.33 }}
                className="space-y-1"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Catégorie
                </label>
                <select
                  name="categorieName"
                  value={formData.categorieName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categoriesLoading ? (
                    <option>Chargement...</option>
                  ) : (
                    categories?.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))
                  )}
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
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38 }}
                className="space-y-1"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  name="tagInput"
                  value={formData.tag.join("#")}
                  onChange={(e) => {
                    const tagsArray = e.target.value
                      .split("#")
                      .map((t) => t.trim())
                      .filter((t) => t.length > 0);
                    setFormData((prev) => ({ ...prev, tag: tagsArray }));
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.36 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Image actuelle
                </label>
                {formData.image ? (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                ) : event?.image ? (
                  <img
                    src={`http://localhost:8000/images/${event.image}`}
                    alt="Current"
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                ) : null}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      image: e.target.files[0],
                    }))
                  }
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
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
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
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
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModifyEvent;
