import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  CalendarDays,
  Tag,
  Users,
  BadgeDollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import PaymentPopup from "../Popup/PaymentPopup";
import Commentaire from "../../components/Feedback/Commentaire";
import useEventStore from "../../store/useEventStore ";

const EventDetails = () => {
  const { id } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { selectedEvent, loading, error, getEventById } = useEventStore();

  useEffect(() => {
    if (id) getEventById(id);
  }, [id, getEventById]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setShowPopup(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading || !selectedEvent) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600"
          >
            Chargement en cours...
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-700 p-4 rounded shadow"
          >
            {error}
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-10 px-4 sm:px-8"
      >
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <motion.img
              src={`http://localhost:8000/images/${selectedEvent.image}`}
              alt={`Image de ${selectedEvent.titre}`}
              className="w-full h-80 object-cover rounded-xl"
              whileHover={{ scale: 1.02 }}
            />

            <h1 className="text-3xl font-bold text-gray-800">
              {selectedEvent.titre}
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed">
              {selectedEvent.description}
            </p>

            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="text-orange-500" />
                <span className="text-base">{selectedEvent.lieu}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="text-blue-500" />
                <span>
                  {formatDate(selectedEvent.dateDebut)} →{" "}
                  {formatDate(selectedEvent.dateFin)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="text-purple-500" />
                <span>
                  {selectedEvent.typeEvenement === "physique"
                    ? "En présentiel"
                    : "En ligne"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-semibold text-orange-600">
              Informations
            </h2>

            <div className="space-y-2 text-gray-700">
              <div className="flex items-center gap-2">
                <Users className="text-gray-700" />
                <span>{selectedEvent.capacite} places</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeDollarSign className="text-green-600" />
                <span>
                  {selectedEvent.prix > 0
                    ? `${selectedEvent.prix} DT`
                    : "Gratuit"}
                </span>
              </div>
              
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              onClick={() => setShowPopup(true)}
              disabled={selectedEvent.etat !== "accepter"}
            >
              {selectedEvent.etat === "accepter"
                ? "S'inscrire maintenant"
                : "Inscriptions fermées"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Commentaire eventId={id} />
        <Footer />
      </motion.div>

      {showPopup && (
        <PaymentPopup
          onClose={() => setShowPopup(false)}
          onSuccess={handlePaymentSuccess}
          price={selectedEvent.prix}
          title={selectedEvent.titre}
          eventId={selectedEvent._id}
        />
      )}

      {paymentSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Merci !
            </h3>
            <p className="text-gray-700">
              Votre inscription a été confirmée avec succès.
            </p>
            <button
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              onClick={() => setPaymentSuccess(false)}
            >
              Fermer
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EventDetails;
