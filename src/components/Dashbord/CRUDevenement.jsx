import React, { useState } from "react";

const CRUDevenement = () => {
  // État pour la liste des événements
  const [events, setEvents] = useState([]);

  // État pour le formulaire d'ajout/modification
  const [newEvent, setNewEvent] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
    location: "",
    capacity: "",
    status: "Brouillon",
    creatorId: "1", // Simule l'ID du créateur
    creationDate: "",
    modificationDate: "",
    price: "",
    registrationLink: "",
    qrCode: "",
    mainImage: "",
    tags: [],
  });

  // État pour gérer l'édition
  const [editingEvent, setEditingEvent] = useState(null);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setNewEvent({
      id: "",
      name: "",
      description: "",
      category: "",
      startDate: "",
      endDate: "",
      location: "",
      capacity: "",
      status: "Brouillon",
      creatorId: "1",
      creationDate: "",
      modificationDate: "",
      price: "",
      registrationLink: "",
      qrCode: "",
      mainImage: "",
      tags: [],
    });
    setEditingEvent(null);
  };

  // Validation du formulaire
  const validateEvent = (event) => {
    if (!event.name.trim()) return "Le nom de l'événement est requis.";
    if (!event.startDate || !event.endDate) return "Les dates de début et de fin sont requises.";
    if (new Date(event.startDate) > new Date(event.endDate))
      return "La date de début doit être antérieure à la date de fin.";
    if (!event.location.trim()) return "Le lieu est requis.";
    if (!event.capacity || isNaN(event.capacity) || event.capacity <= 0)
      return "La capacité doit être un nombre positif.";
    return "";
  };

  // Ajouter un événement
  const addEvent = () => {
    const errorMessage = validateEvent(newEvent);
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    const eventToAdd = {
      ...newEvent,
      id: Date.now().toString(), // Génère un ID unique basé sur le timestamp
      creationDate: new Date().toISOString(),
      modificationDate: new Date().toISOString(),
    };

    setEvents([...events, eventToAdd]);
    resetForm();
  };

  // Modifier un événement
  const editEvent = (eventId) => {
    const eventToEdit = events.find((event) => event.id === eventId);
    setEditingEvent(eventId);
    setNewEvent({ ...eventToEdit });
  };

  // Mettre à jour un événement
  const updateEvent = () => {
    const errorMessage = validateEvent(newEvent);
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    const updatedEvents = events.map((event) =>
      event.id === editingEvent
        ? {
            ...newEvent,
            modificationDate: new Date().toISOString(),
          }
        : event
    );

    setEvents(updatedEvents);
    resetForm();
  };

  // Supprimer un événement
  const deleteEvent = (eventId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      setEvents(events.filter((event) => event.id !== eventId));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-orange-400 mb-4">Gérer les Événements</h2>

      {/* Formulaire pour ajouter ou modifier un événement */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Nom de l'événement"
          value={newEvent.name}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
        />
        <textarea
          placeholder="Description de l'événement"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
        />
        <select
          value={newEvent.category}
          onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
        >
          <option value="">Sélectionnez une catégorie</option>
          <option value="Éducation">Éducation</option>
          <option value="Culture">Culture</option>
          <option value="Sport">Sport</option>
        </select>
        <input
          type="datetime-local"
          value={newEvent.startDate}
          onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
        />
        <input
          type="datetime-local"
          value={newEvent.endDate}
          onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Lieu"
          value={newEvent.location}
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Capacité maximale"
          value={newEvent.capacity}
          onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Prix (0 pour gratuit)"
          value={newEvent.price}
          onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
        />
        <button
          onClick={editingEvent ? updateEvent : addEvent}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          {editingEvent ? "Mettre à jour" : "Ajouter"}
        </button>
      </div>

      {/* Liste des événements */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Catégorie</th>
            <th className="p-2 border">Dates</th>
            <th className="p-2 border">Lieu</th>
            <th className="p-2 border">Capacité</th>
            <th className="p-2 border">État</th>
            <th className="p-2 border">Créateur</th>
            <th className="p-2 border">Création</th>
            <th className="p-2 border">Modification</th>
            <th className="p-2 border">Prix</th>
            <th className="p-2 border">Lien Inscription</th>
            <th className="p-2 border">QR Code</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Tags</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="text-center">
              <td className="p-2 border">{event.id}</td>
              <td className="p-2 border">{event.name}</td>
              <td className="p-2 border">{event.description}</td>
              <td className="p-2 border">{event.category}</td>
              <td className="p-2 border">
                {new Date(event.startDate).toLocaleString()} -{" "}
                {new Date(event.endDate).toLocaleString()}
              </td>
              <td className="p-2 border">{event.location}</td>
              <td className="p-2 border">{event.capacity}</td>
              <td className="p-2 border">{event.status}</td>
              <td className="p-2 border">{event.creatorId}</td>
              <td className="p-2 border">
                {new Date(event.creationDate).toLocaleString()}
              </td>
              <td className="p-2 border">
                {new Date(event.modificationDate).toLocaleString()}
              </td>
              <td className="p-2 border">{event.price || "Gratuit"}</td>
              <td className="p-2 border">
                {event.registrationLink ? (
                  <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                    Lien
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="p-2 border">{event.qrCode || "N/A"}</td>
              <td className="p-2 border">
                {event.mainImage ? (
                  <img src={event.mainImage} alt="Événement" className="w-10 h-10 object-cover" />
                ) : (
                  "N/A"
                )}
              </td>
              <td className="p-2 border">{event.tags.join(", ") || "Aucun"}</td>
              <td className="p-2 border">
                <button
                  onClick={() => editEvent(event.id)}
                  className="mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Modifier
                </button>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CRUDevenement;