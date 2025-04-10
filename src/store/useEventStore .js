// store/eventStore.js
import { create } from 'zustand';
import axios from 'axios';


const API_URL = "http://localhost:8000/api/events";



const useEventStore = create((set) => ({
  events: [],
  latestEvents: [], // New state for latest events
  loading: false,
  error: null,
  selectedEvent: null,
  loading: false,
  error: null,
  recommendedEvents: [],

  
  fetchEvents: async () => {
    try {
      set({ loading: true, error: null });
      
      const response = await axios.get(`${API_URL}/get`);
      
      // Get all events
      const allEvents = response.data.events;
      
      // Sort by date (newest first) and take first 5
      const sortedEvents = [...allEvents].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      const latestFive = sortedEvents.slice(0, 5);

      set({ 
        events: allEvents,
        latestEvents: latestFive, // Store the latest 5 separately
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch events',
        loading: false 
      });
    }
  },
  //get event by Id
  getEventById: async (id) => {
    try {
      // Say we're loading
      set({ loading: true, error: null });
  
      // Ask the backend for the event with this id
      const response = await axios.get(`${API_URL}/get/${id}`, {
        withCredentials: true,
      });
  
      // Save the event to the store
      set({ selectedEvent: response.data.event, loading: false });
    } catch (error) {
      // If there's a problem, show an error
      set({
        loading: false,
        error: error.response?.data?.message || "Erreur lors de la récupération de l'événement",
      });
    }
  },
   // Function to fetch recommended events from the backend
   fetchRecommendedEvents: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/recommended`, { withCredentials: true });
      // Assume the API returns an array of events
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
  }
  
}));

export default useEventStore;