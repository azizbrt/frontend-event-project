// hooks/useTotalUsers.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const API_URL = "http://localhost:8000/api/admin";
export function useTotalUsers() {
    return useQuery({
      queryKey: ["totalUsers"],
      queryFn: async () => {
        const res = await axios.get(`${API_URL}/total-users`);
        return res.data.totalUsers;
      },
      refetchInterval: 5000, // rafraîchit toutes les 5 secondes
      refetchOnWindowFocus: true, // rafraîchit quand l'utilisateur revient sur l'onglet
    });
  }
  export function useTotalEvents() {
    return useQuery({
      queryKey: ["totalEvents"],
      queryFn: async () => {
        const res = await axios.get(`${API_URL}/total-events`);
        return res.data.totalEvents;
      },
      refetchInterval: 5000, // rafraîchit toutes les 5 secondes
      refetchOnWindowFocus: true, // rafraîchit quand l'utilisateur revient sur l'onglet
    });
  }
  export function useTotalInscriptions() {
    return useQuery({
      queryKey: ["totalInscriptions"],
      queryFn: async () => {
        const res = await axios.get(`${API_URL}/total-inscription`);
        return res.data.totalInscriptions;
      },
      refetchInterval: 5000, // rafraîchit toutes les 5 secondes
      refetchOnWindowFocus: true, // rafraîchit quand l'utilisateur revient sur l'onglet
    });
  }
  export function useDernieresInscriptions() {
    return useQuery({
      queryKey: ["dernieresInscriptions"],
      queryFn: async () => {
        const res = await axios.get(`${API_URL}/dernier-inscription`);
        return res.data.inscription; // c'est le tableau retourné par ton backend
      },
      refetchInterval: 5000, // rafraîchissement auto
      refetchOnWindowFocus: true,
    });
  }
  export const useDerniersPaiements = () => {
    return useQuery({
      queryKey: ["dernierPaiements"],
      queryFn: async () => {
        const { data } = await axios.get(`${API_URL}/dernier-payment`);
        return data.paiements;
      },
    });
  };
  export function useInscriptionsParMois() {
  return useQuery({
    queryKey: ["inscriptionsParMois"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/inscriptions-par-mois`);
      return res.data; // le tableau d'objets { date, value }
    },
    refetchInterval: 60000, // rafraîchit toutes les 60 secondes (ajuste selon besoin)
    refetchOnWindowFocus: true,
  });
}
export function useEvenementsPopulaires() {
  return useQuery({
    queryKey: ["evenementsPopulaires"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/evenement-populaire`);
      return res.data.evenements; // retourne un tableau d’événements avec nombreParticipants
    },
    refetchInterval: 10000, // rafraîchit toutes les 10 secondes
    refetchOnWindowFocus: true,
  });
}
