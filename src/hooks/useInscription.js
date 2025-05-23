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
export const useConsulterInscriptions = () => {
  return useQuery({
    queryKey: ["inscriptions"], // 🔑 Nom de la requête (clé pour le cache)
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get`);

      // 🧹 On s’assure que chaque inscription a bien un champ `id`
      return response.data.inscriptions.map((inscription) => ({
        ...inscription,
        id: inscription.id, // déjà présent, on le garde pour être sûr
      }));
    },
    onSuccess: (data) => {
      if (data.length > 0) {
        toast.success("Inscriptions récupérées avec succès !");
      }
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        " Une erreur est survenue lors du chargement des inscriptions.";
      toast.error(message);
    },
    refetchOnWindowFocus: false, // 🚫 Pas besoin de relancer quand on revient sur l’onglet
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
      const response = await axios.delete(
        `${API_URL}/annuleeinscription/${id}`
      );
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
export const useDeleteGestionnaireInscription = () => {
  const queryClient = useQueryClient(); // Pour recharger les données après suppression

  return useMutation({
    // 🎯 Fonction qui sera appelée quand on veut supprimer une inscription
    mutationFn: async ({ id, cause }) => {
      const res = await axios.delete(
        `${API_URL}/deleteinscription/${id}`,
        {
          data: { cause }, // ✅ On envoie aussi la cause dans le corps
        }
      );
      return res.data;
    },

    // ✅ Si la suppression s’est bien passée
    onSuccess: (data) => {
      toast.success(data.message || "Inscription supprimée avec succès");
      // 🔄 On met à jour les données locales pour que l’UI soit à jour
      queryClient.invalidateQueries(["inscriptions"]);
      queryClient.invalidateQueries(["mesInscriptions"]);
    },

    // ❌ Si une erreur se produit
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Erreur lors de la suppression de l'inscription";
      toast.error(message);
    },
  });
};