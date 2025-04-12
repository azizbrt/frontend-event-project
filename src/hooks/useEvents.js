import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllEvents,
  fetchEventById,
  fetchRecommendedEvents,
  createEvent,
  fetchEventsByGestionnaire,
} from '../api/eventApi.js';
import axios from 'axios';
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
