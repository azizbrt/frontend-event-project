import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  useAnnulerInscription,
  useConsulterInscription,
  useValiderInscription,
} from "../../hooks/useInscription";
import { useGetAllPaiementsWithDetails } from "../../hooks/usePayment";

const GestionInscriptions = () => {
  const {
    data,
    isLoading: isLoadingInscriptions,
    isError,
    error,
  } = useConsulterInscription();

  const { data: paiements, isLoading: isLoadingPaiements } =
    useGetAllPaiementsWithDetails();

  const { mutate: validerInscription, isLoading: loadingValidation } =
    useValiderInscription();
  const { mutate: annulerInscription, isLoading: loadingAnnulation } =
    useAnnulerInscription();

  // Hooks d'état (toujours avant tout return ou condition)
  const [editingInscription, setEditingInscription] = useState(null);
  const [paiement, setPaiment] = useState([]);

  useEffect(() => {
    // Si l'utilisateur n'est pas authentifié, ne pas exécuter le code
    if (!Array.isArray(data) || !Array.isArray(paiements)) return;

    const updatedPaiment = data.map((inscription) => {
      const found = paiements.find((p) => {
        const paiementId = p?.inscription?._id;
        return paiementId === inscription.id;
      });
      return found || null;
    });

    setPaiment(updatedPaiment);
  }, [data, paiements]);

  console.log(paiement, "paiment !!!;knjhh");

  // Fonctions
  const handleAnnulation = (inscriptionId) => {
    annulerInscription(inscriptionId);
  };

  const fermerConsultation = () => {
    setEditingInscription(null);
  };

  // Affichage
  if (isLoadingInscriptions || isLoadingPaiements)
    return <div>Chargement...</div>;
  if (isError) return <div>{error?.message || "Erreur de chargement"}</div>;

  console.log("📦 Données d'inscription :", data); // Debugging inscriptions
  console.log("💸 Données de paiements :", paiements); // Debugging payments

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Inscriptions des événements</h1>

      {data?.length === 0 ? (
        <p>Aucune inscription trouvée.</p>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-orange-100">
                <th className="p-2 border">Nom du Participant</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Téléphone</th>
                <th className="p-2 border">Événement</th>
                <th className="p-2 border">Statut</th>
                <th className="p-2 border">Paiement</th>
                <th className="p-2 border">Référence</th>
              </tr>
            </thead>
            <tbody>
              {data.map((inscription, index) => {
                let paiementIndex = paiement[index];
                console.log(paiementIndex, "paiementIndex");
                console.log(paiement, "paiement !!");

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
                    <td className="p-2 border">
                      {paiementIndex ? (
                        <span>{paiementIndex.reference}</span> // Displaying payment reference from hook
                      ) : (
                        <span>Non payé</span>
                      )}
                    </td>
                    <td className="p-2 border space-x-1">
                      <button
                        onClick={() => {
                          Swal.fire({
                            title: "Approuver cette inscription ?",
                            text: "L'utilisateur sera accepté à l'événement.",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonColor: "#10B981", // green
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Oui, approuver",
                            cancelButtonText: "Annuler",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              validerInscription(
                                inscription._id || inscription.id
                              );
                            }
                          });
                        }}
                        disabled={loadingValidation}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        {loadingValidation ? "..." : "Approuver"}
                      </button>
                      <button
                        onClick={() => {
                          Swal.fire({
                            title: "Annuler cette inscription ?",
                            text: "Cette action est irréversible.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#EF4444", // red
                            cancelButtonColor: "#6B7280", // gray
                            confirmButtonText: "Oui, annuler",
                            cancelButtonText: "Annuler",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              handleAnnulation(inscription.id);
                            }
                          });
                        }}
                        disabled={loadingAnnulation}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        {loadingAnnulation ? "Annulation..." : "Annuler"}
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
