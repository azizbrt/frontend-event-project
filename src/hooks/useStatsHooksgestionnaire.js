import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:8000/api/gestionnaire";


// 📊 1. Statistiques globales
export const useStatsGlobales = () => {
  return useQuery({
    queryKey: ["statsGlobales"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/globales`, {
        withCredentials: true, // important si tu utilises les cookies
      });
      return data;
    },
  });
};

// 📈 2. Nombre d'inscriptions par événement
export const useStatsParEvenement = () => {
  return useQuery({
    queryKey: ["statsParEvenement"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/inscriptions-par-evenement`, {
        withCredentials: true,
      });
      return data;
    },
  });
};

// 🕒 3. Les 10 dernières inscriptions
export const useInscriptionsRecentes = () => {
  return useQuery({
    queryKey: ["inscriptionsRecentes"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/recents`, {
        withCredentials: true,
      });
      return data;
    },
  });
};
