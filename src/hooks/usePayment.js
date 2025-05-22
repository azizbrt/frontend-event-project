// hooks/usePaiementHooks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8000/api/payments";

// 🔍 1. Récupérer les détails d’un paiement par inscriptionId
export const usePaiementDetails = (inscriptionId, enabled = true) => {
  return useQuery({
    queryKey: ["paiement-details", inscriptionId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/get/${inscriptionId}`, {
        withCredentials: true,
      });
      return data;
    },
    enabled: !!inscriptionId && enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    onError: (error) => {
      toast.error("Erreur lors du chargement du paiement");
      console.error(" Erreur paiement-details:", error);
    },
  });
};

// 🧾 2. Créer un nouveau paiement
export const useCreatePayment = () => {
  return useMutation({
    mutationFn: async (formDataValues) => {
      const formData = new FormData();

      formData.append("inscriptionId", formDataValues.inscriptionId);
      if (formDataValues.preuve) {
        formData.append("preuve", formDataValues.preuve); // "preuve" doit correspondre au nom dans le backend
      }

      const { data } = await axios.post(`${API_URL}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      return data;
    },
    onSuccess: (data) => {
      toast.success("Paiement soumis !");
      console.log("Paiement créé :", data);
    },
    onError: (error) => {
      toast.error(
        "Erreur paiement : " + (error.response?.data?.message || error.message)
      );
      console.error(" Paiement erreur :", error);
    },
  });
};
export const useValiderOuRefuserPaiement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paiementId, statut }) => {
      const response = await axios.put(
        `${API_URL}/valider/${paiementId}`,
        { statut },
        { withCredentials: true }
      );
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["paiementDetails"]); //  à adapter selon ta clé de cache
      queryClient.invalidateQueries(["inscriptions"]); //  idem si nécessaire
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour du paiement"
      );
    },
  });
};
