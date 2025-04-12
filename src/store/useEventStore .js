import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:8000/api/events";

const useEventStore = create((set, get) => ({
  events: [],
  latestEvents: [],
  recommendedEvents: [],
  selectedEvent: null,
  loading: false,
  error: null,

  // ✅ Fetch all events
  fetchEvents: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/get`);
      const allEvents = response.data.events;

      const sortedEvents = [...allEvents].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      const latestFive = sortedEvents.slice(0, 5);

      set({
        events: allEvents,
        latestEvents: latestFive,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch events',
        loading: false
      });
    }
  },

  // ✅ Get event by ID
  getEventById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/get/${id}`, {
        withCredentials: true,
      });
      set({ selectedEvent: response.data.event, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Erreur lors de la récupération de l'événement",
      });
    }
  },

  // ✅ Fetch recommended events
  fetchRecommendedEvents: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/recommended`, {
        withCredentials: true,
      });
      set({
        recommendedEvents: response.data,
        loading: false
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch recommended events"
      });
    }
  },

  // ✅ Create event (multipart/form-data)
  createEvent: async (eventData) => {
    try {
      set({ loading: true, error: null });

      const response = await axios.post(`${API_URL}/create`, eventData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });
      console.log("✅ Event created:", response.data);

      // Ajouter le nouvel événement à la liste locale si tu veux
      set((state) => ({
        events: [...state.events, response.data.event],
        loading: false
      }));

      return response.data;
    } catch (error) {
      console.error("Erreur création événement:", error);
      set({
        loading: false,
        error: error.response?.data?.message || "Erreur lors de la création"
      });
      return null;
    }
  },

  // ✅ Fetch events by gestionnaire ID
  fetchEventsByGestionnaire: async (gestionnaireId) => {
    if (!gestionnaireId) {
      set({ error: "Gestionnaire ID is missing!" });
      return;
    }
  
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/gestionnaire/${gestionnaireId}`);
      set({ events: res.data.events, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Erreur inconnue", loading: false });
    }
  },
  
}));

export default useEventStore;
