import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  useAnnulerInscription,
  useConsulterInscriptions,
  useValiderInscription,
} from "../../hooks/useInscription";
import {
  usePaiementDetails,
  useValiderOuRefuserPaiement,
} from "../../hooks/usePayment";

const baseURL = import.meta.env.VITE_API_URL;

// Payment popup to show payment info and accept/refuse buttons
const PaymentDetailsModal = ({ paiement, onClose }) => {
  const { mutate: validerOuRefuserPaiement, isLoading } =
    useValiderOuRefuserPaiement();

  // Local state to keep track of updated status after mutation
  const [updatedStatus, setUpdatedStatus] = useState(paiement.statut);

  // Build image URL
  const imageUrl =
    paiement?.preuve && paiement.preuve.startsWith("http")
      ? paiement.preuve
      : paiement?.preuve
      ? `${baseURL}${paiement.preuve}`
      : null;

  if (!paiement) return null;

  // Handle accept/refuse action
  const handleUpdateStatus = (statut) => {
    const titles = {
      validé: "Accepter ce paiement ?",
      refusé: "Refuser ce paiement ?",
    };
    const confirmButtonTexts = {
      validé: "Oui, accepter",
      refusé: "Oui, refuser",
    };
    const confirmColors = {
      validé: "#10B981",
      refusé: "#EF4444",
    };

    Swal.fire({
      title: titles[statut],
      icon: statut === "validé" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: confirmButtonTexts[statut],
      cancelButtonText: "Annuler",
      confirmButtonColor: confirmColors[statut],
      cancelButtonColor: "#6B7280",
    }).then((result) => {
      if (result.isConfirmed) {
        validerOuRefuserPaiement(
          { paiementId: paiement._id || paiement.id, statut },
          {
            onSuccess: () => {
              // Update local status so UI updates
              setUpdatedStatus(statut);
              // Optionally close modal here or let user close manually
              // onClose();
            },
          }
        );
      }
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Détails du Paiement</h2>
        <p>
          <strong>Référence :</strong> {paiement.reference}
        </p>
        <p>
          <strong>Montant :</strong> {paiement.montant} €
        </p>
        <p>
          <strong>Date :</strong>{" "}
          {new Date(paiement.datePaiement).toLocaleString()}
        </p>
        <p>
          <strong>Méthode :</strong> {paiement.methode}
        </p>

        {imageUrl ? (
          <img
            src={imageUrl}
            className="w-full h-80 object-cover rounded-xl my-4"
            alt="Preuve de paiement"
          />
        ) : (
          <p className="text-gray-500 my-4">Aucune preuve fournie.</p>
        )}

        <p>
          <strong>Statut :</strong> {updatedStatus}
        </p>

        {/* Only show buttons if status is neither validé nor refusé */}
        {updatedStatus !== "validé" && updatedStatus !== "refusé" && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => handleUpdateStatus("validé")}
              disabled={isLoading}
            >
              Accepter
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleUpdateStatus("refusé")}
              disabled={isLoading}
            >
              Refuser
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

// Main component to list inscriptions and handle actions
const GestionInscriptions = () => {
  // Get inscriptions from API
  const {
    data: inscriptions,
    isLoading: isLoadingInscriptions,
    isError,
    error,
  } = useConsulterInscriptions();

  // Store the ID of the inscription to show payment details
  const [selectedInscriptionId, setSelectedInscriptionId] = useState(null);

  // Fetch payment details only if an inscription is selected
  const { data: paiementDetails, isLoading: loadingPaiementDetails } =
    usePaiementDetails(selectedInscriptionId, !!selectedInscriptionId);

  // Functions to approve or cancel inscriptions
  const { mutate: validerInscription, isLoading: loadingValidation } =
    useValiderInscription();
  const { mutate: annulerInscription, isLoading: loadingAnnulation } =
    useAnnulerInscription();

  if (isLoadingInscriptions) return <div>Chargement...</div>;
  if (isError) return <div>{error?.message || "Erreur de chargement"}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Inscriptions des événements</h1>

      {inscriptions?.length === 0 ? (
        <p>Aucune inscription trouvée.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-orange-100">
              <th className="p-3 border border-gray-300 text-left">
                Nom du Participant
              </th>
              <th className="p-3 border border-gray-300 text-left">Email</th>
              <th className="p-3 border border-gray-300 text-left">
                Téléphone
              </th>
              <th className="p-3 border border-gray-300 text-left">
                Événement
              </th>
              <th className="p-3 border border-gray-300 text-center">Statut</th>
              <th className="p-3 border border-gray-300 text-center">
                Paiement
              </th>
              <th className="p-3 border border-gray-300 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {inscriptions.map((inscription) => {
              const id = inscription._id || inscription.id;
              return (
                <tr key={id} className="even:bg-gray-50 text-center">
                  <td className="p-3 border border-gray-300 text-left">
                    {inscription.participant.nom}
                  </td>
                  <td className="p-3 border border-gray-300 text-left">
                    {inscription.participant.email}
                  </td>
                  <td className="p-3 border border-gray-300 text-left">
                    {inscription.participant.telephone}
                  </td>
                  <td className="p-3 border border-gray-300 text-left">
                    {inscription.evenement.titre}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {inscription.status}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => setSelectedInscriptionId(id)}
                    >
                      Voir paiement
                    </button>
                  </td>
                  <td className="p-3 border border-gray-300 space-x-2">
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: "Approuver cette inscription ?",
                          icon: "question",
                          showCancelButton: true,
                          confirmButtonText: "Oui, approuver",
                          cancelButtonText: "Annuler",
                          confirmButtonColor: "#10B981",
                          cancelButtonColor: "#d33",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            validerInscription(
                              inscription._id || inscription.id
                            );
                            console.log("ID being sent:", inscription._id || inscription.id);
                          }
                        })
                      }
                      disabled={loadingValidation}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingValidation ? "..." : "Approuver"}
                    </button>

                    <button
                      onClick={() =>
                        Swal.fire({
                          title: "Annuler cette inscription ?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Oui, annuler",
                          cancelButtonText: "Annuler",
                          confirmButtonColor: "#EF4444",
                          cancelButtonColor: "#6B7280",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            annulerInscription(id);
                          }
                        })
                      }
                      disabled={loadingAnnulation}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingAnnulation ? "Annulation..." : "Annuler"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Show payment modal if inscription is selected */}
      {selectedInscriptionId &&
        (loadingPaiementDetails ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-xl">
            Chargement paiement...
          </div>
        ) : (
          <PaymentDetailsModal
            paiement={paiementDetails}
            onClose={() => setSelectedInscriptionId(null)}
          />
        ))}
    </div>
  );
};

export default GestionInscriptions;
