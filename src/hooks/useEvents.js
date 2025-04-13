import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllEvents,
  fetchEventById,
  fetchRecommendedEvents,
  createEvent,
  fetchEventsByGestionnaire,
} from '../api/eventApi.js';
import axios from 'axios';
import toast from 'react-hot-toast';
const API_URL = "http://localhost:8000/api/events";

export const useEvents = () => {
  return useQuery(['events'], fetchAllEvents);
};

export const useEvent = (id) => {
  return useQuery(['event', id], () => fetchEventById(id), {
    enabled: !!id
  });
};

export const useRecommendedEvents = () => {
  return useQuery(['recommendedEvents'], fetchRecommendedEvents);
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(['events']); // reload after new event
    },
  });
};

export const useEventsByGestionnaire = (nom) => {
    return useQuery({
      queryKey: ['events', 'gestionnaire', nom],
      queryFn: async () => {
        const response = await axios.get(`${API_URL}/gestionnaire/${nom}`, {
          withCredentials: true
        });
        return response.data.events || response.data;
      },
      enabled: !!nom,
      staleTime: 5 * 60 * 1000 // 5 minutes cache
    });
  };
  export const useDeleteEvent = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (eventId) => {
        const response = await axios.delete(`${API_URL}/delete/${eventId}`, {
          withCredentials: true,
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ 
          queryKey: ['events', 'gestionnaire'] 
        });
      }
    });
    };
    // In your useUpdateEvent hook file
export const useUpdateEvent = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ id, updatedData }) => {
        const { data } = await axios.put(`${API_URL}/update/${id}`, updatedData);
        return data;
      },
      onSuccess: (data) => {
        toast.success("Événement mis à jour avec succès");
        queryClient.invalidateQueries(["events"]); // This refreshes your events list
        return data; // Make sure to return the data
      },
      onError: (error) => {
        toast.error(`Erreur: ${error.response?.data?.message || error.message}`);
      },
      onSettled: () => {
        // This runs after success or error
        // No need to do anything here, but it's good to know it exists
      }
    });
  };
      export const useEventById = (eventId) => {
        return useQuery({
          queryKey: ["event", eventId],
          queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/get/${eventId}`);
            return data.event;
          },
          enabled: !!eventId, // Only fetch if eventId exists
        });
      };
