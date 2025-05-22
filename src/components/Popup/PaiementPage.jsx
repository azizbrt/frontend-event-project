import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCreatePayment } from "../../hooks/usePayment";
import { Loader2, CheckCircle2, Clock } from "lucide-react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const PaiementPage = () => {
  const navigate = useNavigate();
  const { inscriptionId } = useParams();
  const location = useLocation();
  const { eventId, eventPrice } = location.state || {};
  
  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // 'pending', 'submitted', 'error'
  const [reference, setReference] = useState("");
  const { mutate: createPayment, isLoading } = useCreatePayment();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!eventId || !inscriptionId) {
      toast.error("Information manquante pour le paiement");
      navigate("/");
    }
  }, [eventId, inscriptionId, navigate]);

  const handlePaymentDeclaration = () => {
    if (!paymentFile) {
      toast.error("Veuillez joindre votre preuve de virement");
      return;
    }

    createPayment(
      {
        inscriptionId,
        preuve: paymentFile,
      },
      {
        onSuccess: (data) => {
          setReference(data.paiement.reference);
          setPaymentStatus("submitted");
          toast.success("Déclaration de virement enregistrée!");
        },
        onError: () => {
          setPaymentStatus("error");
          toast.error("Erreur lors de l'enregistrement");
        },
      }
    );
  };

  if (!eventId || !inscriptionId) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
              {paymentStatus === "submitted" ? (
                <>
                  <CheckCircle2 className="text-green-500" />
                  Déclaration Enregistrée
                </>
              ) : (
                <>
                  <Clock className="text-orange-500" />
                  Déclaration de Virement
                </>
              )}
            </h1>
            <p className="text-gray-600 mt-2">
              {paymentStatus === "submitted"
                ? "Votre preuve de virement a été soumise avec succès"
                : "Veuillez déclarer votre virement bancaire"}
            </p>
          </div>

          <div className="space-y-4">
            {/* Payment Amount */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Montant à payer</span>
                <span className="font-bold text-blue-600">{eventPrice} DT</span>
              </div>
            </div>

            {/* Bank Information */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">Coordonnées Bancaires</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Titulaire:</span> Banque BRT</p>
                <p><span className="font-medium">IBAN:</span> TN59 1234 5678 9012 3456 7890</p>
                <p><span className="font-medium">BIC:</span> BICXXXXXXX</p>
                <p><span className="font-medium">Référence:</span> {inscriptionId.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>

            {/* Payment Proof Upload */}
            {paymentStatus !== "submitted" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Avis de debit
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {paymentFile ? (
                      <div className="text-sm text-green-600">
                        Fichier sélectionné: {paymentFile.name}
                      </div>
                    ) : (
                      <>
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none">
                            <span>Uploader un fichier</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*,.pdf"
                              onChange={(e) => setPaymentFile(e.target.files[0])}
                            />
                          </label>
                          <p className="pl-1">ou glisser-déposer</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, PDF jusqu'à 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reference Number */}
            {paymentStatus === "submitted" && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" />
                  <div>
                    <p className="font-medium text-gray-700">Référence de déclaration</p>
                    <p className="font-mono text-green-600">{reference}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Votre déclaration est en attente de validation
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            {paymentStatus !== "submitted" && (
              <button
                onClick={handlePaymentDeclaration}
                disabled={isLoading || !paymentFile}
                className={`w-full py-2 px-4 rounded-md font-medium flex items-center justify-center ${
                  isLoading
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                } text-white transition-colors`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Enregistrement...
                  </>
                ) : (
                  "Déclarer le Virement"
                )}
              </button>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PaiementPage;