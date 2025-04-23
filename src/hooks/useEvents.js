// src/hooks/useEventHooks.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = "http://localhost:8000/api/events";

// 💡 1. GET - Tous les événements
export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/get`);
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache 5 min
  });
};

// 👀 2. GET - Un événement par ID
export const useEventById = (eventId) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/get/${eventId}`);
      return data.event;
    },
    enabled: !!eventId, // Yfetch ken eventId mawjoud
  });
};

// 🎯 3. GET - Événements recommandés
export const useRecommendedEvents = () => {
  return useQuery({
    queryKey: ["recommendedEvents"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/recommended`);
      return data;
    },
  });
};

// 4. GET - Événements d’un organisateur (anciennement gestionnaire)
export const useEventsByGestionnaire = (id) => {
  return useQuery({
    queryKey: ["events", "gestionnaire", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/gestionnaire/${id}`, {
        withCredentials: true,
      });
      // Ensure consistent response format
      return Array.isArray(data) ? data : data?.events || [];
    },
    enabled: !!id, // Only enable when ID exists
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnMount: "always", // Always refetch when component mounts
  });
};


export const useCreateEvent = (gestionnaireId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(`${API_URL}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", "gestionnaire", gestionnaireId] });
      toast.success("Événement créé !");
    },
    onError: (error) => {
      console.error("Create Event Error:", error);
      toast.error("Erreur lors de la création");
    },
  });
};

// 🗑️ 6. DELETE - Supprimer un événement
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId) => {
      const { data } = await axios.delete(`${API_URL}/delete/${eventId}`, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      toast.success("Événement supprimé !");
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });
};

// ✏️ 7. PUT - Modifier un événement
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const { data } = await axios.put(`${API_URL}/update/${id}`, updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      toast.success("Événement mis à jour !");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.response?.data?.message || error.message}`);
    },
  });
};
const updateEventStatus = async ({ id, etat }) => {
    const response = await axios.put(`${API_URL}/etat/${id}`, { etat });
    return response.data;
  };
  
  // 2️⃣ - Hook React Query
  export const useUpdateEventStatus = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: updateEventStatus,
      onSuccess: (data) => {
        toast.success(data.message || "État de l’événement mis à jour !");
        queryClient.invalidateQueries({ queryKey: ["events"] });
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Échec de la mise à jour de l’état."
        );
      },
    });
  };
