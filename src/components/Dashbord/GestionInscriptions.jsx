import React, { useState } from "react";
import {
  useAnnulerInscription,
  useConsulterInscription,
  useValiderInscription,
} from "../../hooks/useInscription";

const GestionInscriptions = () => {
  const { data, isLoading: isLoadingInscriptions, isError, error } =
    useConsulterInscription();
  const { mutate: validerInscription, isLoading: loadingValidation } =
    useValiderInscription();
  const { mutate: annulerInscription, isLoading: loadingAnnulation } =
    useAnnulerInscription();

  // Hooks d'état (toujours avant tout return ou condition)
  const [editingInscription, setEditingInscription] = useState(null);

  // Fonctions
  const approuverInscription = (inscriptionId) => {
    console.log("Approuver", inscriptionId); // à remplacer par appel API plus tard
  };

  const handleAnnulation = (inscriptionId) => {
    annulerInscription(inscriptionId);
  };

  const consulterInscription = (inscriptionId) => {
    const inscription = data?.find((insc) => insc._id === inscriptionId);
    setEditingInscription(inscription);
  };

  const fermerConsultation = () => {
    setEditingInscription(null);
  };

  // Affichage
  if (isLoadingInscriptions) return <div>Chargement...</div>;
  if (isError) return <div>{error?.message || "Erreur de chargement"}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Inscriptions des événements</h1>

      {data?.length === 0 ? (
        <p>Aucune inscription trouvée.</p>
      ) : (
        <>
          {console.log("📦 Données d'inscription :", data)}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-orange-100">
                <th className="p-2 border">Nom du Participant</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Téléphone</th>
                <th className="p-2 border">Événement</th>
                <th className="p-2 border">Statut</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((inscription, index) => {
                console.log(`🔍 Inscription #${index + 1}`, inscription);
                return (
                  <tr key={inscription._id} className="text-center">
                    <td className="p-2 border">
                      {inscription.participant.nom}
                    </td>
                    <td className="p-2 border">
                      {inscription.participant.email}
                    </td>
                    <td className="p-2 border">
                      {inscription.participant.telephone}
                    </td>
                    <td className="p-2 border">
                      {inscription.evenement.titre}
                    </td>
                    <td className="p-2 border">{inscription.status}</td>
                    <td className="p-2 border space-x-1">
                      <button
                        onClick={() => {
                          console.log(
                            "✅ Approuver ID :",
                            inscription._id || inscription.id
                          );
                          validerInscription(inscription._id || inscription.id);
                        }}
                        disabled={loadingValidation}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        {loadingValidation ? "..." : "Approuver"}
                      </button>
                      <button
                        onClick={() => handleAnnulation(inscription.id)}
                        disabled={loadingAnnulation}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        {loadingAnnulation ? "Annulation..." : "Annuler"}
                      </button>
                      <button
                        onClick={() => {
                          console.log("🔎 Consulter ID :", inscription._id);
                          consulterInscription(inscription._id);
                        }}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Consulter
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {/* Mode consultation (facultatif) */}
      {editingInscription && (
        <div className="mt-6 p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Détails de l'inscription
          </h2>
          <p>
            <strong>Nom:</strong> {editingInscription.participant.nom}
          </p>
          <p>
            <strong>Email:</strong> {editingInscription.participant.email}
          </p>
          <p>
            <strong>Téléphone:</strong>{" "}
            {editingInscription.participant.telephone}
          </p>
          <p>
            <strong>Événement:</strong> {editingInscription.evenement.titre}
          </p>
          <p>
            <strong>Statut:</strong> {editingInscription.status}
          </p>
          <button
            onClick={fermerConsultation}
            className="mt-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
};

export default GestionInscriptions;
