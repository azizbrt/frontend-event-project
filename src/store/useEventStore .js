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

  fetchEvents: async () => {
  try {
    set({ loading: true, error: null });

    const response = await axios.get(`${API_URL}/get`);
    const allEvents = response.data.events;

    // 1. Ne garder que les événements acceptés
    const acceptedEvents = allEvents.filter(event => event.etat === "accepter");

    // 2. Trier par date de création (du plus récent au plus ancien)
    const sortedEvents = acceptedEvents.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // 3. Prendre les 5 plus récents
    const latestFive = sortedEvents.slice(0, 5);

    // 4. Mettre à jour le state
    set({
      events: acceptedEvents,
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
  // In useEventStore.js
  fetchEventsByGestionnaire: async (nom) => {
    if (!nom) {
      set({ error: "Le nom de l'organisateur est manquant !" });
      return;
    }
  
    // First check if we have cached data
    const cachedEvents = localStorage.getItem(`events_${nom}`);
    if (cachedEvents) {
      set({ 
        events: JSON.parse(cachedEvents),
        loading: false 
      });
    }
  
    set({ loading: true, error: null });
    
    try {
      const res = await axios.get(`${API_URL}/gestionnaire/${nom}`, {
        withCredentials: true
      });
      
      const eventsData = res.data.events || res.data;
      
      // Update state and cache in localStorage
      set({ 
        events: eventsData,
        loading: false 
      });
      
      // Store in localStorage with timestamp
      localStorage.setItem(`events_${nom}`, JSON.stringify({
        data: eventsData,
        timestamp: new Date().getTime()
      }));
      
    } catch (error) {
      console.error("Detailed error:", error.response?.data || error.message);
      
      // If offline and we have cached data, use that instead of showing error
      const cachedEvents = localStorage.getItem(`events_${nom}`);
      if (error.message.includes("Network Error") && cachedEvents) {
        set({ 
          events: JSON.parse(cachedEvents).data,
          loading: false,
          error: "Mode hors ligne: données chargées depuis le cache"
        });
      } else {
        set({
          error: error.response?.data?.message || "Erreur lors du chargement",
          loading: false
        });
      }
    }
  },
  
  
}));

export default useEventStore;
