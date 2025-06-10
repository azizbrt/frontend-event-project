import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  useAnnulerInscription,
  useConsulterInscriptions,
  useDeleteGestionnaireInscription,
  useSupprimerInscription,
  useValiderInscription,
} from "../../hooks/useInscription";
import {
  usePaiementDetails,
  useValiderOuRefuserPaiement,
} from "../../hooks/usePayment";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  X,
} from "lucide-react";

const baseURL = import.meta.env.VITE_API_URL;

const PaymentDetailsModal = ({ paiement, onClose }) => {
  const { mutate: validerOuRefuserPaiement, isLoading } =
    useValiderOuRefuserPaiement();

  const [updatedStatus, setUpdatedStatus] = useState(paiement.statut);

  const imageUrl =
    paiement?.preuve && paiement.preuve.startsWith("http")
      ? paiement.preuve
      : paiement?.preuve
      ? `${baseURL}${paiement.preuve}`
      : null;

  if (!paiement) return null;

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
              setUpdatedStatus(statut);
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
        <p><strong>Référence :</strong> {paiement.reference}</p>
        <p><strong>Montant :</strong> {paiement.montant} €</p>
        <p><strong>Date :</strong> {new Date(paiement.datePaiement).toLocaleString()}</p>
        <p><strong>Méthode :</strong> {paiement.methode}</p>

        {imageUrl ? (
          <img
            src={imageUrl}
            className="w-full h-80 object-cover rounded-xl my-4"
            alt="Preuve de paiement"
          />
        ) : (
          <p className="text-gray-500 my-4">Aucune preuve fournie.</p>
        )}

        <p><strong>Statut :</strong> {updatedStatus}</p>

        {updatedStatus !== "validé" && updatedStatus !== "refusé" && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              className="text-green-600 hover:text-green-700"
              onClick={() => handleUpdateStatus("validé")}
              disabled={isLoading}
              title="Accepter"
            >
              <CheckCircle size={28} />
            </button>
            <button
              className="text-red-600 hover:text-red-700"
              onClick={() => handleUpdateStatus("refusé")}
              disabled={isLoading}
              title="Refuser"
            >
              <XCircle size={28} />
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <X size={18} /> Fermer
        </button>
      </div>
    </div>
  );
};

const GestionInscriptions = () => {
  const {
    data: inscriptions,
    isLoading: isLoadingInscriptions,
    isError,
    error,
  } = useConsulterInscriptions();

  const [selectedInscriptionId, setSelectedInscriptionId] = useState(null);

  const { data: paiementDetails, isLoading: loadingPaiementDetails } =
    usePaiementDetails(selectedInscriptionId, !!selectedInscriptionId);

  const { mutate: validerInscription, isLoading: loadingValidation } =
    useValiderInscription();
  const { mutate: annulerInscription, isLoading: loadingAnnulation } =
    useAnnulerInscription();
  const { mutate: supprimerInscription, isLoading } =
    useDeleteGestionnaireInscription();

  const handleDelete = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez supprimer cette inscription.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      input: "select",
      inputOptions: {
        "Paiement non reçu": "Paiement non reçu",
        "Demande du participant": "Demande du participant",
        "Erreur de saisie": "Erreur de saisie",
        "Nombre maximum atteint": "Nombre maximum atteint",
        "Problème technique": "Problème technique",
        Autre: "Autre",
      },
      inputPlaceholder: "Choisissez la cause",
      preConfirm: (cause) => {
        if (!cause) {
          Swal.showValidationMessage("Veuillez choisir une cause");
        }
        return cause;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        supprimerInscription({ id, cause: result.value });
      }
    });
  };

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
              <th className="p-3 border">Nom du Participant</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Téléphone</th>
              <th className="p-3 border">Événement</th>
              <th className="p-3 border">Statut</th>
              <th className="p-3 border">Paiement</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inscriptions.map((inscription) => {
              const id = inscription._id || inscription.id;
              return (
                <tr key={id} className="even:bg-gray-50 text-center">
                  <td className="p-3 border text-left">
                    {inscription.participant.nom}
                  </td>
                  <td className="p-3 border text-left">
                    {inscription.participant.email}
                  </td>
                  <td className="p-3 border text-left">
                    {inscription.participant.telephone}
                  </td>
                  <td className="p-3 border text-left">
                    {inscription.evenement.titre}
                  </td>
                  <td className="p-3 border">{inscription.status}</td>
                  <td className="p-3 border">
                    {inscription.evenement.prix === 0 ? (
                      <span className="text-green-600 font-semibold">
                        Gratuit
                      </span>
                    ) : (
                      <button
                        title="Voir paiement"
                        onClick={() => setSelectedInscriptionId(id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={22} />
                      </button>
                    )}
                  </td>
                  <td className="p-3 border space-x-2 flex justify-center">
                    <button
                      title="Accepter"
                      onClick={() =>
                        Swal.fire({
                          title: "Accepter cette inscription ?",
                          icon: "question",
                          showCancelButton: true,
                          confirmButtonText: "Oui, accepter",
                          cancelButtonText: "Annuler",
                          confirmButtonColor: "#10B981",
                          cancelButtonColor: "#d33",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            validerInscription(id);
                          }
                        })
                      }
                      disabled={loadingValidation}
                      className="text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      <CheckCircle size={22} />
                    </button>

                    <button
                      title="Annuler"
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
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      <XCircle size={22} />
                    </button>

                    <button
                      title="Supprimer"
                      onClick={() => handleDelete(id)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      <Trash2 size={22} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

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
