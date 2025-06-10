import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Users, CalendarCheck, ClipboardList, Flame, Wallet } from "lucide-react";

import {
  useDernieresInscriptions,
  useDerniersPaiements,
  useEvenementsPopulaires,
  useInscriptionsParMois,
  useTotalEvents,
  useTotalInscriptions,
  useTotalUsers,
} from "../../hooks/useStatestique";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Statistique = () => {
  const { data: totalUsers, isLoading: loadingUsers, isError: errorUsers } = useTotalUsers();
  const { data: totalEvents } = useTotalEvents();
  const { data: totalInscriptions } = useTotalInscriptions();
  const { data: dernieresInscriptions } = useDernieresInscriptions();
  const { data: paiementsRecents, isLoading: loadingPaiements } = useDerniersPaiements();
  const { data: inscriptionsParMois, isLoading: loadingInscriptionsParMois, isError: errorInscriptionsParMois } = useInscriptionsParMois();
  const { data: evenements, isLoading: loadingPopulaires, isError: errorPopulaires } = useEvenementsPopulaires();

  const stats = [
    {
      name: "Utilisateurs",
      value: totalUsers,
      icon: <Users className="w-10 h-10 text-orange-500" />,
    },
    {
      name: "Événements",
      value: totalEvents,
      icon: <CalendarCheck className="w-10 h-10 text-blue-500" />,
    },
    {
      name: "Inscriptions",
      value: totalInscriptions,
      icon: <ClipboardList className="w-10 h-10 text-green-500" />,
    },
  ];

  if (loadingUsers) return <p className="text-center text-gray-500">Chargement...</p>;
  if (errorUsers) return <p className="text-center text-red-500">Erreur de chargement des statistiques.</p>;

  return (
    <div className="p-6 min-h-screen max-w-6xl mx-auto bg-white">
      {/* Titre */}
      <motion.h1
        className="text-center text-4xl font-bold mb-10 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tableau de bord
      </motion.h1>

      {/* Statistiques principales */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {stats.map(({ name, value, icon }, idx) => (
          <motion.div
            key={idx}
            className="flex flex-col sm:flex-row items-center bg-white border rounded-xl p-6 shadow-sm gap-5"
            variants={item}
          >
            {/* Titre hors card en mobile */}
            <p className="block sm:hidden mb-2 text-center text-gray-600 font-medium">{name}</p>

            <div className="bg-gray-100 p-3 rounded-full">{icon}</div>

            {/* Titre dans la card sur desktop */}
            <div className="hidden sm:block">
              <p className="text-gray-600 font-medium">{name}</p>
            </div>

            <p className="text-3xl font-bold text-orange-600">{value?.toLocaleString("fr-FR") || 0}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Graphique Inscriptions */}
      <motion.div
        className="bg-white border rounded-xl shadow-sm p-6 mb-12"
        initial="hidden"
        animate="visible"
        variants={item}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Inscriptions par mois</h2>
        {loadingInscriptionsParMois && <p className="text-gray-500">Chargement...</p>}
        {errorInscriptionsParMois && <p className="text-red-500">Erreur chargement.</p>}
        {!loadingInscriptionsParMois && inscriptionsParMois?.length > 0 && (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={inscriptionsParMois}>
              <XAxis dataKey="date" tick={{ fill: "#4B5563" }} />
              <YAxis tick={{ fill: "#4B5563" }} />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Événements populaires + Paiements récents */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Événements Populaires */}
        <motion.div
          className="bg-white border rounded-xl shadow-sm p-6"
          variants={item}
        >
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            Événements Populaires
          </h3>
          {loadingPopulaires && <p className="text-gray-500">Chargement...</p>}
          {errorPopulaires && <p className="text-red-500">Erreur de chargement.</p>}
          {!loadingPopulaires && evenements?.length === 0 && (
            <p className="text-gray-500">Aucun événement populaire trouvé.</p>
          )}
          <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
            {evenements?.map((ev) => (
              <li key={ev._id} className="py-2">
                <p className="text-gray-800 font-medium">{ev.titre}</p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-orange-600">{ev.nombreParticipants}</span> participants
                </p>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Derniers Paiements */}
        <motion.div
          className="bg-white border rounded-xl shadow-sm p-6"
          variants={item}
        >
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-green-500" />
            Derniers paiements
          </h3>
          {loadingPaiements && <p className="text-gray-500">Chargement...</p>}
          {!loadingPaiements && paiementsRecents?.length === 0 && (
            <p className="text-gray-500">Aucun paiement récent.</p>
          )}
          <ul className="space-y-3 max-h-60 overflow-y-auto">
            {paiementsRecents?.map((p) => (
              <li key={p._id} className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between text-gray-700 font-medium mb-1">
                  <span>{p.utilisateurId?.name || "Inconnu"}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(p.datePaiement).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Événement : {p.evenementId?.titre || "N/A"}</div>
                <div className="text-sm text-gray-600">Montant : {p.montant} TND</div>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Statistique;
