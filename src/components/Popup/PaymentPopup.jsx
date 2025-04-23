import { useState } from "react"; // Import the React useState hook to manage state
import { motion } from "framer-motion"; // Import motion from framer-motion to animate the popup
import { useCreatePayment } from "../../hooks/usePayment"; // Import the payment creation hook

const PaiementPopup = ({
  onClose,
  eventId,
  nomAffiché,
  eventPrice,
  inscriptionId,
}) => {
  // States to store reference and loading state
  const [reference, setReference] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hook to handle payment creation
  const createPayment = useCreatePayment();

  // Function to handle payment button click
  const handlePayment = async () => {
    // If there is no inscription or event ID, don't proceed
    if (!inscriptionId || !eventId) return;

    setIsLoading(true); // Set loading to true when starting the payment process

    try {
      // Call the createPayment hook to create a payment and get a reference number
      const data = await createPayment.mutateAsync({ eventId, inscriptionId });
      // Set the reference number once the payment is created successfully
      setReference(data?.paiment?.reference || "Erreur");
    } catch (error) {
      // If there is an error, set the reference to "Erreur"
      setReference("Erreur");
    } finally {
      setIsLoading(false); // Set loading to false once done
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial opacity for animation
      animate={{ opacity: 1 }} // Animation to fade in
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }} // Initial scale for the popup animation
        animate={{ scale: 1 }} // Animation to scale the popup to normal size
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Paiement pour {nomAffiché} {/* Display participant name */}
          </h3>
          <button
            onClick={onClose} // Close the popup when the button is clicked
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕ {/* Close icon */}
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Display amount to be paid */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant à payer (TND)
            </label>
            <input
              type="text"
              value={eventPrice} // Display event price
              disabled // Make the input read-only
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Display the reference number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Référence (générée automatiquement)
            </label>
            <input
              type="text"
              value={isLoading ? "Génération en cours..." : reference} // Show "Génération en cours..." if loading, else show reference
              disabled // Make the input read-only
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Dummy RIB (bank account number) field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RIB
            </label>
            <input
              type="text"
              value="FR76 1234 5678 9876 5432 1000 000" // Static bank account number for the example
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex justify-end">
            {/* Submit button to validate the payment */}
            <button
              type="button"
              onClick={handlePayment} // Trigger the payment handling function
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              disabled={isLoading} // Disable the button while loading
            >
              {isLoading ? "Traitement..." : "Valider le paiement"}{" "}
              {/* Button text changes based on loading state */}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PaiementPopup;
