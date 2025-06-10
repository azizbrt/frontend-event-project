import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  CalendarDays,
  Tag,
  Users,
  BadgeDollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Commentaire from "../../components/Feedback/Commentaire";
import InscrirePopup from "../../components/Inscrire/InscrirePopup";
import { useEvents } from "../../hooks/useEvents";
import Swal from "sweetalert2";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const { data: eventsData, isLoading, isError } = useEvents();
  const baseURL = import.meta.env.VITE_API_URL;

  const selectedEvent = eventsData?.events?.find(
    (event) => event._id === id && event.etat === "accepter"
  );

  const handleInscriptionSuccess = (inscriptionId) => {
    if (selectedEvent.prix > 0) {
      navigate(`/paiement/${inscriptionId}`, {
        state: { eventId: selectedEvent._id, eventPrice: selectedEvent.prix },
      });
    } else {
      setShowPopup(false);
      Swal.fire({
        title: "Inscription réussie !",
        text: "Vous êtes inscrit à cet événement gratuit.",
        icon: "success",
        confirmButtonText: "Super !",
      });
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatHeure = (dateString) =>
    new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Chargement en cours...
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !selectedEvent) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-700 p-4 rounded shadow"
          >
            {isError
              ? "Erreur de chargement"
              : "Événement non trouvé ou non accepté"}
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
        className="container mx-auto py-10 px-4 sm:px-8 pt-32"
      >
        {/* Image et Description */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <motion.img
              src={`${baseURL}/images/${selectedEvent.image}`}
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

            {/* Tags */}
            {selectedEvent.tag?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tag.map((t, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Date, Lieu, Type */}
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="text-orange-500" />
                <span>{selectedEvent.lieu}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="text-blue-500" />
                <span>
                  {formatDate(selectedEvent.dateDebut)} →{" "}
                  {formatDate(selectedEvent.dateFin)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-green-400" />
                <span>
                  {formatHeure(selectedEvent.dateDebut)} →{" "}
                  {formatHeure(selectedEvent.dateFin)}
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

          {/* Infos & Bouton */}
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
              <div className="flex items-center gap-2">
                <Tag className="text-purple-600" />
                <span>Catégorie: {selectedEvent.categorieName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-blue-600" />
                <div>
                  <div>Organisateur: {selectedEvent.organisateur?.name}</div>
                  <div className="text-sm text-gray-500">
                    {selectedEvent.organisateur?.email}
                  </div>
                </div>
              </div>
              {selectedEvent.restrictionAge && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-yellow-500" />
                  <span>
                    {selectedEvent.restrictionAge === "tout public"
                      ? "Accessible à tout le public"
                      : "Réservé aux personnes majeures (18 ans et plus)"}
                  </span>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              onClick={() => setShowPopup(true)}
            >
              S'inscrire maintenant
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
        <InscrirePopup
          onClose={() => setShowPopup(false)}
          onSuccess={handleInscriptionSuccess}
          title={selectedEvent.titre}
          eventId={selectedEvent._id}
          eventPrice={selectedEvent.prix}
        />
      )}
    </div>
  );
};

export default EventDetails;
