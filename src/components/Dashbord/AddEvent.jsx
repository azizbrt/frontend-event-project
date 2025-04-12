import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Bookmark,
  FileText,
  List,
  ChevronDown,
  Calendar,
  MapPin,
  Users,
  Euro,
  Tag,
  UploadCloud,
  Image as ImageIcon,
  Save,
  Pencil,
  Trash2,
  XCircle,
  Loader2,
  Loader2Icon
} from "lucide-react";
import useEventStore from "../../store/useEventStore ";
import { useAuthStore } from "../../store/authStore";
import useCategorieStore from "../../store/useCategorieStore";


const AddEvent = () => {
  // Get functions and data from our stores
  const { events, loading, error, fetchEventsByGestionnaire, createEvent } = useEventStore();
  const { user } = useAuthStore();
  const { categories, fetchCategories } = useCategorieStore();

  // Local state for showing/hiding the form, handling image file, submission state, and for storing form values
  const [showForm, setShowForm] = useState(false);
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    typeEvenement: "",
    dateDebut: "",
    dateFin: "",
    lieu: "",
    capacite: "",
    prix: "",
    tag: "",
    categorieName: ""
  });

  // Fetch available categories once when the component mounts
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch events organized by the logged-in user
  useEffect(() => {
    if (user?._id) {
      fetchEventsByGestionnaire(user._id);
    }
  }, [user, fetchEventsByGestionnaire]);

  // Update formData when the user changes any form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // When the user selects a file, save it to state
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // When the form is submitted, prepare and send the data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!image) {
      alert("Veuillez sélectionner une image !");
      return;
    }

    setIsSubmitting(true);

    // Create a new FormData object to send multipart/form-data
    const data = new FormData();
    data.append("titre", formData.titre);
    data.append("description", formData.description);
    data.append("typeEvenement", formData.typeEvenement);
    data.append("dateDebut", new Date(formData.dateDebut).toISOString());
    data.append("dateFin", new Date(formData.dateFin).toISOString());
    data.append("lieu", formData.lieu);
    data.append("capacite", formData.capacite);
    data.append("categorieName", formData.categorieName);
    // Append the organizer’s name (from the authenticated user)
    data.append("organisateur", user.name);

    if (formData.prix) data.append("prix", formData.prix);
    if (formData.tag) {
      // Split the tag string into an array and join it back as a comma-separated string
      const tagArray = formData.tag.split(",").map((t) => t.trim());
      data.append("tag", tagArray.join(","));
    }

    data.append("image", image);

    try {
      await createEvent(data);
      alert("Événement ajouté avec succès !");
      // Reset the form values
      setFormData({
        titre: "",
        description: "",
        typeEvenement: "",
        dateDebut: "",
        dateFin: "",
        lieu: "",
        capacite: "",
        prix: "",
        tag: "",
        categorieName: ""
      });
      setImage(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur création événement:", err);
      setSubmitError(err.response?.data?.message || "Erreur lors de la création de l'événement");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-orange-500">Liste des événements</h2>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 transition"
        >
          <PlusCircle className="mr-2 w-5 h-5" />
          Ajouter un événement
        </motion.button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6 mb-6"
        >
          <h3 className="text-xl font-semibold mb-4">Nouveau Événement</h3>
          {submitError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Organizer Display */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Organisateur:</label>
              <input
                type="text"
                value={user?.name || "Nom non défini"}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            {/* Titre */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Titre:</label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            {/* Description */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-2 border rounded"
              ></textarea>
            </div>
            {/* Type d'événement */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Type d'événement:</label>
              <select
                name="typeEvenement"
                value={formData.typeEvenement}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionnez</option>
                <option value="Présentiel">Physique</option>
                <option value="enligne">En ligne</option>
                <option value="hybride">Hybride</option>
              </select>
            </div>
            {/* Dates */}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Date de début:</label>
                <input
                  type="datetime-local"
                  name="dateDebut"
                  value={formData.dateDebut}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Date de fin:</label>
                <input
                  type="datetime-local"
                  name="dateFin"
                  value={formData.dateFin}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            {/* Lieu */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Lieu:</label>
              <input
                type="text"
                name="lieu"
                value={formData.lieu}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            {/* Capacité */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Capacité:</label>
              <input
                type="number"
                name="capacite"
                value={formData.capacite}
                onChange={handleChange}
                required
                min="1"
                className="w-full p-2 border rounded"
              />
            </div>
            {/* Prix */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Prix:</label>
              <input
                type="number"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                step="0.01"
                className="w-full p-2 border rounded"
              />
            </div>
            {/* Tags */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Tags (séparés par des virgules):</label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            {/* Catégorie */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Catégorie:</label>
              <select
                name="categorieName"
                value={formData.categorieName}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Image Upload */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="w-full p-2 border rounded"
              />
              {image && <p>Fichier sélectionné: {image.name}</p>}
            </div>
            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2Icon className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Enregistrer l'événement
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      )}

     
    </div>
  );
};

export default AddEvent;
