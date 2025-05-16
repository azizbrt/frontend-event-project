import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import { Users, CalendarCheck, ClipboardList } from "lucide-react";

import {
  useDernieresInscriptions,
  useDerniersPaiements,
  useInscriptionsParMois,
  useTotalEvents,
  useTotalInscriptions,
  useTotalUsers,
} from "../../hooks/useStatestique";

const Statistique = () => {
  const { data: totalUsers, isLoading: loadingUsers, isError: errorUsers } = useTotalUsers();
  const { data: totalEvents } = useTotalEvents();
  const { data: totalInscriptions } = useTotalInscriptions();
  const { data: dernieresInscriptions, isLoading: loadingInscriptions, isError: errorInscriptions } = useDernieresInscriptions();
  const { data: paiementsRecents, isLoading: loadingPaiements } = useDerniersPaiements();
  const { data: inscriptionsParMois, isLoading: loadingInscriptionsParMois, isError: errorInscriptionsParMois } = useInscriptionsParMois();

  if (loadingUsers) return <p className="text-center text-gray-500">Chargement...</p>;
  if (errorUsers) return <p className="text-center text-red-500">Erreur pour les utilisateurs.</p>;

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

  // Motion settings
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.25 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 bg-white min-h-screen max-w-5xl mx-auto">
      <motion.h1
        className="text-center text-4xl font-bold mb-10 text-gray-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Tableau de bord 
      </motion.h1>

      {/* Stats cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {stats.map(({ name, value, icon }, idx) => (
          <motion.div
            key={idx}
            className="flex items-center bg-gray-50 rounded-xl p-6 shadow-md space-x-5"
            variants={item}
          >
            <div>{icon}</div>
            <div>
              <p className="text-gray-700 font-semibold text-lg">{name}</p>
              <p className="text-3xl font-extrabold text-orange-600">{value?.toLocaleString("fr-FR")}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bar chart */}
      <motion.div
        className="bg-gray-50 rounded-xl shadow-md p-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Inscriptions par mois
        </h2>
        {loadingInscriptionsParMois && <p>Chargement...</p>}
        {errorInscriptionsParMois && <p className="text-red-500">Erreur chargement.</p>}
        {!loadingInscriptionsParMois && !errorInscriptionsParMois && (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={inscriptionsParMois || []} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis dataKey="date" tick={{ fill: "#4B5563" }} />
              <YAxis tick={{ fill: "#4B5563" }} />
              <Tooltip />
              <Bar dataKey="value" fill="#fb923c" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Lists: Recent inscriptions and payments */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Dernières inscriptions */}
        <motion.div
          className="bg-gray-50 rounded-xl shadow-md p-6"
          variants={item}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Dernières inscriptions
          </h3>
          {loadingInscriptions && <p className="text-gray-500">Chargement...</p>}
          {errorInscriptions && <p className="text-red-500">Erreur chargement.</p>}
          {!loadingInscriptions && !errorInscriptions && dernieresInscriptions?.length === 0 && (
            <p className="text-gray-500">Aucune inscription récente.</p>
          )}
          <ul className="divide-y divide-gray-300 max-h-60 overflow-y-auto">
            {dernieresInscriptions?.map((item, i) => (
              <li key={i} className="py-2">
                <p className="text-gray-700 font-medium">{item.utilisateurId?.name}</p>
                <p className="text-sm text-gray-500">
                  inscrit à <span className="font-semibold">{item.evenementId?.titre}</span> le{" "}
                  {new Date(item.dateInscription).toLocaleDateString("fr-FR")}
                </p>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Derniers paiements */}
        <motion.div
          className="bg-gray-50 rounded-xl shadow-md p-6"
          variants={item}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Derniers paiements
          </h3>
          {loadingPaiements ? (
            <p className="text-gray-500">Chargement...</p>
          ) : paiementsRecents && paiementsRecents.length > 0 ? (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {paiementsRecents.map((p) => (
                <li key={p._id} className="border rounded-lg p-3 bg-white shadow-sm">
                  <div className="flex justify-between text-gray-700 font-medium">
                    <span>{p.utilisateurId?.name || "Inconnu"}</span>
                    <span className="text-sm text-gray-500">{new Date(p.datePaiement).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="text-sm text-gray-600">Événement : {p.evenementId?.titre || "N/A"}</div>
                  <div className="text-sm text-gray-600">Montant : {p.montant} TND</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucun paiement récent.</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Statistique;
