import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useInscription } from "../../hooks/useInscription";

const InscrirePopup = ({ onClose, onSuccess, eventId, title, eventPrice }) => {
  const { user, token } = useAuthStore();
  const { mutateAsync: createInscription, isPending } = useInscription();

  const [formData, setFormData] = useState({
    phone: "",
    note: "",
    nomAffiché: user?.name || "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check required fields
    if (!formData.phone || !formData.nomAffiché) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const res = await createInscription({
        eventId,
        phone: formData.phone,
        note: formData.note,
        nomAffiché: formData.nomAffiché,
        token,
      });

      onSuccess(res.inscription?._id, formData);
      onClose();
    } catch (err) {
      console.error("Erreur d'enregistrement:", err);
      setError("Oups ! Un problème est survenu. Veuillez réessayer.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Join {title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
              disabled={isPending}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                 Votre nom d'affichage *
                </label>
                <input
                  type="text"
                  name="nomAffiché"
                  value={formData.nomAffiché}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  maxLength={100}
                  disabled={isPending}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ce nom sera visible par les autres
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                 Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  pattern="[0-9]{8,15}"
                  title="Veuillez entrer un numéro de téléphone valide"
                  disabled={isPending}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  name="note"
                  rows={3}
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  maxLength={200}
                  disabled={isPending}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.note.length}/200 characters
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-2 bg-red-50 text-red-600 text-sm rounded">
                  {error}
                </div>
              )}

              {/* Price Display */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="font-medium text-blue-800">
                  {eventPrice > 0
                    ? `Event Price: ${eventPrice} DT`
                    : "C'est un événement GRATUIT!"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-md"
                disabled={isPending}
              >
                Annuler
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center justify-center min-w-32"
                disabled={isPending}
              >
                {
                  isPending
                    ? "Traitement..."
                    : eventPrice > 0
                    ? "Continuer vers le paiement" // 💵 Paid event
                    : "Terminer l'inscription" // 🎉 Free event
                }
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InscrirePopup;
