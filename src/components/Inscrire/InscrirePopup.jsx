import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useInscription } from "../../hooks/useInscription";
import PaiementPopup from "../Popup/PaymentPopup";

const InscrirePopup = ({ onClose, onSuccess, eventId, title, eventPrice }) => {
  // State to manage whether the payment popup should be shown
  const [showPaiementPopup, setShowPaiementPopup] = useState({
    visible: false,
    id: null,
  });

  // Access user information and token from the authentication store
  const { user, token } = useAuthStore();

  // Hook to handle inscription creation
  const { mutateAsync: createInscription } = useInscription();

  // Form data state to handle input fields (phone, note, name)
  const [formData, setFormData] = useState({
    phone: "",
    note: "",
    nomAffiché: user?.name || "", // Default to user's name if available
  });

  // Error state to store and display error messages
  const [error, setError] = useState("");

  // Handle changes in input fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for inscription
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Check if required fields are filled
    if (!formData.phone || !formData.nomAffiché) {
      setError("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    try {
      // Create inscription using the form data
      const res = await createInscription({
        eventId,
        phone: formData.phone,
        note: formData.note,
        nomAffiché: formData.nomAffiché,
        token,
      });

      // Get the inscription ID from the response
      const inscriptionId = res.inscription?._id;

      // Show the payment popup with the inscription ID
      setShowPaiementPopup({
        visible: true,
        id: inscriptionId,
      });
    } catch (err) {
      console.error("Erreur d'inscription :", err);
      setError("Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <>
      {/* Main Modal for Registration */}
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
            {/* Header Section with Event Title and Close Button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Inscription à {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom affiché *
                </label>
                <input
                  type="text"
                  name="nomAffiché"
                  value={formData.nomAffiché}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ce nom sera visible par les autres participants et
                  organisateurs.
                </p>
              </div>

              {/* Phone Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  pattern="[0-9]{8,15}"
                  title="Numéro de téléphone valide requis"
                />
              </div>

              {/* Notes (Optional) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optionnel)
                </label>
                <textarea
                  name="note"
                  rows={3}
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.note.length}/200 caractères
                </p>
              </div>

              {/* Error Message Display */}
              {error && (
                <div className="mb-4 text-red-500 text-sm">{error}</div>
              )}

              {/* Buttons to Cancel or Submit */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Procéder au paiement
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>

      {/* Show Payment Popup after Successful Registration */}
      {showPaiementPopup.visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] flex items-center justify-center"
        >
          <PaiementPopup
            onClose={() => {
              setShowPaiementPopup({ visible: false, id: null });
              onClose(); // Close the modal when payment is closed
            }}
            participantName={formData.nomAffiché}
            eventId={eventId}
            phone={formData.phone}
            note={formData.note}
            eventPrice={eventPrice}
            inscriptionId={showPaiementPopup.id}
          />
        </motion.div>
      )}
    </>
  );
};

export default InscrirePopup;
