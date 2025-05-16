import React from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  ClipboardList,
  Flame,
  Wallet,
  BarChart2,
  UserCheck,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  useInscriptionsRecentes,
  useStatsGlobales,
  useStatsParEvenement,
} from "../../hooks/useStatsHooksgestionnaire";

const StatestiqueGestionnaire = () => {
  // Tes autres hooks déjà en place
  const {
    data: globalData,
    isLoading: globalLoading,
    error: globalError,
  } = useStatsGlobales();
  const {
    data: eventData,
    isLoading: eventLoading,
    error: eventError,
  } = useStatsParEvenement();

  // Le hook pour les inscriptions récentes
  const {
    data: inscriptions,
    isLoading: inscriptionsLoading,
    error: inscriptionsError,
  } = useInscriptionsRecentes();

  // Gérer le loading global
  if (globalLoading || eventLoading || inscriptionsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Gérer les erreurs globales
  if (globalError || eventError || inscriptionsError) {
    return (
      <div className="text-center py-10 text-red-500">
        Erreur:{" "}
        {globalError?.message ||
          eventError?.message ||
          inscriptionsError?.message}
      </div>
    );
  }

  // Stats cartes (inchangées)
  const stats = [
    {
      name: "Inscriptions Total",
      value: globalData?.total || 0,
      icon: <ClipboardList className="w-8 h-8" />,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      name: "Inscriptions Validées",
      value: globalData?.valides || 0,
      icon: <UserCheck className="w-8 h-8" />,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      name: "En Attente",
      value: globalData?.enAttente || 0,
      icon: <Clock className="w-8 h-8" />,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      name: "Prochain Événement",
      value: globalData?.prochainEvenement?.titre ? "1" : "0",
      icon: <Flame className="w-8 h-8" />,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  // Tes données graphiques (pour test ou remplacer par eventData)
  const testData = [
    { titre: "Sport", nombreInscriptions: 10 },
    { titre: "Lorem", nombreInscriptions: 15 },
  ];

  return (
    <div className="p-4 md:p-6 min-h-screen max-w-7xl mx-auto bg-gray-50">
      {/* Titre animé */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Tableau de bord Gestionnaire
        </h1>
        <p className="text-gray-500 mt-2">
          Statistiques et analyses de vos événements
        </p>
      </motion.div>

      {/* Cartes de stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
        }}
      >
        {stats.map(({ name, value, icon, color, bgColor }, idx) => (
          <motion.div
            key={idx}
            className={`p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${bgColor} ${color}`}>
                {icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm">{name}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Prochain événement */}
      {globalData?.prochainEvenement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 p-4 bg-white rounded-lg border border-blue-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <CalendarCheck className="text-blue-500" />
            <h2 className="text-lg font-semibold text-blue-800">
              Prochain Événement
            </h2>
          </div>
          <div className="pl-8">
            <h3 className="text-xl font-bold text-gray-800">
              {globalData.prochainEvenement.titre}
            </h3>
            <p className="text-gray-600">
              {new Date(globalData.prochainEvenement.date).toLocaleDateString(
                "fr-FR",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
          </div>
        </motion.div>
      )}

      {/* Graphique des inscriptions par événement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-800">
            Inscriptions par Événement
          </h2>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={testData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="titre"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar
                dataKey="nombreInscriptions"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Nouvelle section pour les 10 dernières inscriptions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="text-purple-500" />
          10 Dernières Inscriptions
        </h2>

        {inscriptions && inscriptions.length > 0 ? (
          <ul className="space-y-3">
            {inscriptions.map((inscription, index) => (
              <li
                key={index}
                className="border border-gray-100 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="text-gray-800">
                    <p className="font-medium">{inscription.nom}</p>
                    <p className="text-sm text-gray-600">{inscription.email}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      Événement :{" "}
                      <span className="font-semibold">
                        {inscription.evenement}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Le{" "}
                      {new Date(inscription.date).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span
                      className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                        inscription.statut === "validée"
                          ? "bg-green-100 text-green-700"
                          : inscription.statut === "en attente"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {inscription.statut}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Aucune inscription récente.</p>
        )}
      </motion.div>
    </div>
  );
};

export default StatestiqueGestionnaire;
