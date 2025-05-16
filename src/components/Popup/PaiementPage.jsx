import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCreatePayment } from "../../hooks/usePayment";
import { Loader2 } from "lucide-react"; // spinner

const PaiementPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { inscriptionId } = useParams();
  const location = useLocation();
  const { eventId, eventPrice } = location.state || {};
  const [reference, setReference] = useState("");
  const { mutate: createPayment, isLoading } = useCreatePayment();

  if (!eventId || !inscriptionId) {
    toast.error("Échec : ID manquant.");
    return null;
  }

  const handlePayment = () => {
    if (!inscriptionId) {
      toast.error("Échec : ID de l’inscription manquant.");
      return;
    }

    const paymentData = { inscriptionId };

    createPayment(paymentData, {
      onSuccess: (data) => {
        setReference(data.paiment.reference);
        toast.success("Paiement effectué avec succès !");
      },
      onError: () => {
        toast.error("Erreur lors du paiement. Veuillez réessayer.");
      },
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h1 className="text-2xl font-bold text-green-600 mb-4 text-center">
            🎉 Paiement
          </h1>
          <p className="text-gray-700 mb-6 text-center">
            Veuillez vérifier les informations ci-dessous avant de valider votre
            paiement.
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            {/* Montant */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant à payer (TND)
              </label>
              <input
                type="text"
                value={eventPrice}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            {/* Référence */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Référence (générée automatiquement)
              </label>
              <input
                type="text"
                value={isLoading ? "Génération en cours..." : reference}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            {/* RIB */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RIB
              </label>
              <input
                type="text"
                value="FR76 1234 5678 9876 5432 1000 000"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            {/* Bouton Valider */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handlePayment}
                className={`px-4 py-2 flex items-center justify-center bg-orange-500 text-white rounded-md hover:bg-orange-600 transition disabled:opacity-50`}
                disabled={isLoading || reference !== ""}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : reference ? (
                  "Paiement effectué"
                ) : (
                  "Valider le paiement"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PaiementPage;
