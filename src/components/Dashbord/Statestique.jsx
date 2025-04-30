import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useDernieresInscriptions,
  useTotalEvents,
  useTotalInscriptions,
  useTotalUsers,
} from "../../hooks/useStatestique";

const Statistique = () => {
  // Hook pour récupérer le nombre total d'utilisateurs
  const {
    data: totalUsers,
    isLoading: loadingUsers,
    isError: errorUsers,
  } = useTotalUsers();
  const { data: totalEvents } = useTotalEvents();
  const { data: totalInscriptions } = useTotalInscriptions();
  const {
    data: dernieresInscriptions,
    isLoading: loadingInscriptions,
    isError: errorInscriptions,
  } = useDernieresInscriptions();

  // Placeholder des autres données (tu vas faire d'autres hooks plus tard)

  // Références
  const reference = {
    totalUsers: 200,
    totalEvents: 20,
    totalInscriptions: 300,
  };

  // Fonction utilitaire
  const getPercentage = (value, total) => {
    if (!value || !total) return "0.00";
    return ((value / total) * 100).toFixed(2);
  };

  // Loading/Error state
  if (loadingUsers) return <p className="text-center">Chargement...</p>;
  if (errorUsers)
    return (
      <p className="text-center text-red-500">
        Erreur en récupérant les utilisateurs.
      </p>
    );

  const barData = [
    {
      name: "Utilisateurs",
      value: totalUsers,
      percentage: getPercentage(totalUsers, reference.totalUsers),
    },
    {
      name: "Événements",
      value: totalEvents,
      percentage: getPercentage(totalEvents, reference.totalEvents),
    },
    {
      name: "Inscriptions",
      value: totalInscriptions,
      percentage: getPercentage(totalInscriptions, reference.totalInscriptions),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Tableau de bord
      </h1>

      {/* Statistiques avec pourcentages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {barData.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-gray-600">{item.name}</h3>
            <p className="text-4xl text-orange-600 font-bold">
              {item.percentage}%
            </p>
          </div>
        ))}
      </div>

      {/* Graphique en barres */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Aperçu graphique
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#ff6600" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Inscriptions & Paiements récents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inscriptions récentes */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-md font-semibold text-gray-700 mb-4">
            Dernières inscriptions
          </h3>

          {loadingInscriptions && (
            <p className="text-gray-500">Chargement...</p>
          )}
          {errorInscriptions && (
            <p className="text-red-500">Erreur lors du chargement.</p>
          )}

          {!loadingInscriptions &&
            !errorInscriptions &&
            dernieresInscriptions?.length === 0 && (
              <p className="text-gray-500">Aucune inscription récente.</p>
            )}

          <ul className="divide-y divide-gray-200">
            {dernieresInscriptions?.map((item, i) => (
              <li key={i} className="py-2">
                <p className="text-gray-700 font-medium">
                  {item.utilisateurId?.name}
                </p>
                <p className="text-sm text-gray-500">
                  inscrit à{" "}
                  <span className="font-semibold">
                    {item.evenementId?.title}
                  </span>{" "}
                  le{" "}
                  {new Date(item.dateInscription).toLocaleDateString("fr-FR")}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Paiements récents */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-md font-semibold text-gray-700 mb-4">
            Derniers paiements
          </h3>
          <p className="text-gray-500">Aucun paiement récent.</p>
        </div>
      </div>
    </div>
  );
};

export default Statistique;
