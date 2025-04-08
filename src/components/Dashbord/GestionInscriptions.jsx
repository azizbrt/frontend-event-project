import React, { useState } from "react";

const GestionInscriptions = () => {
  // État pour la liste des inscriptions
  const [inscriptions, setInscriptions] = useState([
    {
      id: 1,
      nomParticipant: "wided",
      email: "wided1@gmail.com",
      evenement: " Le coaching",
      statut: "En attente",
    },
    {
      id: 2,
      nomParticipant: "med",
      email: "med@gmail.com",
      evenement: "Collectes de fonds",
      statut: "En attente",
    },
  ]);

  // État pour l'inscription en cours de modification
  const [editingInscription, setEditingInscription] = useState(null);

  // Approver une inscription
  const approuverInscription = (inscriptionId) => {
    setInscriptions(
      inscriptions.map((inscription) =>
        inscription.id === inscriptionId
          ? { ...inscription, statut: "Approuvée" }
          : inscription
      )
    );
  };

  // Annuler une inscription
  const annulerInscription = (inscriptionId) => {
    setInscriptions(
      inscriptions.filter((inscription) => inscription.id !== inscriptionId)
    );
  };

  // Consulter une inscription
  const consulterInscription = (inscriptionId) => {
    const inscription = inscriptions.find(
      (inscription) => inscription.id === inscriptionId
    );
    if (inscription) {
      setEditingInscription(inscription);
    }
  };

  // Fermer le mode consultation
  const fermerConsultation = () => {
    setEditingInscription(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-orange-400 mb-4">Gérer les Inscriptions</h2>

      {/* Tableau des inscriptions */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nom du Participant</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Événement</th>
            <th className="p-2 border">Statut</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inscriptions.map((inscription) => (
            <tr key={inscription.id} className="text-center">
              <td className="p-2 border">{inscription.id}</td>
              <td className="p-2 border">{inscription.nomParticipant}</td>
              <td className="p-2 border">{inscription.email}</td>
              <td className="p-2 border">{inscription.evenement}</td>
              <td className="p-2 border">{inscription.statut}</td>
              <td className="p-2 border">
                <button
                  onClick={() => approuverInscription(inscription.id)}
                  className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approuver
                </button>
                <button
                  onClick={() => annulerInscription(inscription.id)}
                  className="mr-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Annuler
                </button>
                <button
                  onClick={() => consulterInscription(inscription.id)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Consulter
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mode Consultation */}
      {editingInscription && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Détails de l'inscription</h3>
          <p><strong>ID :</strong> {editingInscription.id}</p>
          <p><strong>Nom du Participant :</strong> {editingInscription.nomParticipant}</p>
          <p><strong>Email :</strong> {editingInscription.email}</p>
          <p><strong>Événement :</strong> {editingInscription.evenement}</p>
          <p><strong>Statut :</strong> {editingInscription.statut}</p>
          <button
            onClick={fermerConsultation}
            className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
};

export default GestionInscriptions;