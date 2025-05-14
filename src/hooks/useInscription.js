import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8000/api/inscription";

// Créer une inscription
export const useInscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, phone, note, nomAffiché, token }) => {
      const res = await axios.post(
        `${API_URL}/creeinscription`,
        {
          evenementId: eventId,
          telephone: phone,
          note: note,
          nomAffiché,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Inscription réussie");
      queryClient.invalidateQueries(["mesInscriptions"]);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Erreur lors de l'inscription";
      toast.error(message);
    },
  });
};

// Consulter toutes les inscriptions (admin ou gestionnaire)
export const useConsulterInscription = () => {
  return useQuery({
    queryKey: ["inscription"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/get`);
      const inscriptionsAvecId = res.data.inscriptions.map((inscription) => ({
        ...inscription,
        id: inscription.id,
      }));
      return inscriptionsAvecId;
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Erreur lors de la récupération des inscriptions";
      toast.error(message);
    },
    onSuccess: (data) => {
      if (data.length > 0) {
        toast.success("Inscriptions récupérées avec succès");
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Valider une inscription
export const useValiderInscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
        console.log("Deleting inscription with ID:", id);  
      const res = await axios.put(`${API_URL}/valider/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Inscription validée avec succès");
      queryClient.invalidateQueries(["inscription"]);
      queryClient.invalidateQueries(["mesInscriptions"]);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Erreur lors de la validation de l'inscription";
      toast.error(message);
    },
  });
};

// Annuler une inscription
export const useAnnulerInscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.put(`${API_URL}/annulee/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Inscription annulée avec succès");
      queryClient.invalidateQueries(["inscription"]);
      queryClient.invalidateQueries(["mesInscriptions"]);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Erreur lors de l'annulation de l'inscription";
      toast.error(message);
    },
  });
};

// Voir mes inscriptions (participant)
export const useMesInscriptions = () => {
  return useQuery({
    queryKey: ["mesInscriptions"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/getparticipant`);
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};
export const useSupprimerInscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`${API_URL}/annuleeinscription/${id}`);
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Inscription supprimée avec succès");
      queryClient.invalidateQueries(["mesInscriptions"]);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Erreur lors de la suppression de l'inscription";
      toast.error(message);
    },
  });
};
