// src/hooks/useEventHooks.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = "http://localhost:8000/api/events";

/* ==================== GET HOOKS ==================== */

// 📌 Tous les événements
export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/get`);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 min de cache
  });
};

// 🔍 Un événement par ID
export const useEventById = (eventId) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/get/${eventId}`);
      return data.event;
    },
    enabled: !!eventId,
  });
};

// ⭐ Événements recommandés
export const useRecommendedEvents = () => {
  return useQuery({
    queryKey: ["recommendedEvents"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/recommended`);
      return data;
    },
  });
};

// 👤 Événements d’un gestionnaire
export const useEventsByGestionnaire = (id) => {
  return useQuery({
    queryKey: ["events", "gestionnaire", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/gestionnaire/${id}`, {
        withCredentials: true,
      });
      return Array.isArray(data) ? data : data?.events || [];
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: "always",
  });
};

/* ==================== MUTATION HOOKS ==================== */

// 🆕 Créer un événement
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
      toast.success("Événement créé !");
      queryClient.invalidateQueries(["events", "gestionnaire", gestionnaireId]);
      queryClient.invalidateQueries(["events"]);
    },
    onError: (error) => {
      console.error("Erreur création événement:", error);
      toast.error("Erreur lors de la création");
    },
  });
};

// 🗑️ Supprimer un événement
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
      toast.success("Événement supprimé !");
      queryClient.invalidateQueries(["events"]);
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });
};

// ✏️ Modifier un événement
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const { data } = await axios.put(`${API_URL}/update/${id}`, updatedData);
      return data;
    },
    onSuccess: () => {
      toast.success("Événement mis à jour !");
      queryClient.invalidateQueries(["events"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour.");
    },
  });
};

// ✅ Modifier l’état (statut) d’un événement
const updateEventStatus = async ({ id, etat }) => {
  const { data } = await axios.put(`${API_URL}/etat/${id}`, { etat });
  return data;
};

export const useUpdateEventStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEventStatus,
    onSuccess: (data) => {
      toast.success(data.message || "État de l’événement mis à jour !");
      queryClient.invalidateQueries(["events"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur mise à jour état.");
    },
  });
};
//recommended events
export const fetchRecommendedEvents = async () => {
  const response = await axios.get(`${API_URL}/recommended`, {
    withCredentials: true,
  });
  return response.data;
};
