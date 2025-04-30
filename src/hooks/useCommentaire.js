import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8000/api/commentaires";

// ✅ Créer un commentaire
export const useCreeCommentaire = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contenu, evenementId }) => {
      const res = await axios.post(
        `${API_URL}/creecommentaire/${evenementId}`,
        { contenu, evenementId }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("💬 Commentaire ajouté avec succès !");
      // Tu peux invalider ici si tu veux un refresh auto :
      queryClient.invalidateQueries(["commentaires", data.evenementId]);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "❌ Erreur lors de l’ajout du commentaire";
      toast.error(message);
    },
  });
};

// ✅ Récupérer les commentaires d’un événement
export const useCommentairesByEvenement = (evenementId) => {
  return useQuery({
    queryKey: ["commentaires", evenementId],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/affcommentaire/${evenementId}`);
      return res.data.commentaires;
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "❌ Erreur lors du chargement des commentaires";
      toast.error(message);
    },
    refetchOnWindowFocus: false,
  });
};

// ✅ Export regroupé
export const useCommentaire = () => {
  const creeCommentaire = useCreeCommentaire();
  return { creeCommentaire };
};
export const useRepondreCommentaire = () => {
  const queryClient = useQueryClient();

  // Fonction pour envoyer la réponse
  const mutation = useMutation({
    mutationFn: async ({ commentaireId, contenu }) => {
      const response = await axios.post(
        `${API_URL}/repondrecommentaire/${commentaireId}`,
        { contenu },
        { withCredentials: true } // pour envoyer le cookie s'il y a authentification
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("✅ Réponse ajoutée !");
      queryClient.invalidateQueries(["commentaires"]); // pour actualiser les commentaires
    },
    onError: (error) => {
      console.error("Erreur lors de la réponse :", error);
      toast.error("❌ Échec de l’ajout de la réponse");
    },
  });

  return { repondreCommentaire: mutation };
};
// ✅ Supprimer un commentaire
export const useSupprimerCommentaire = (evenementId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentaireId) => {
      const res = await axios.delete(`${API_URL}/supprimercommentaire/${commentaireId}`, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("🗑️ Commentaire supprimé !");
      queryClient.invalidateQueries(["commentaires", evenementId]);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "❌ Erreur lors de la suppression du commentaire";
      toast.error(message);
    },
  });
};


export const useSupprimerReponse = (evenementId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reponseId) => {
      const res = await axios.delete(`${API_URL}/reponse/${reponseId}`); // 🛠 corriger ici
      return res.data;
    },
    onSuccess: () => {
      toast.success("✅ Réponse supprimée avec succès !");
      queryClient.invalidateQueries(["commentaires", evenementId]);
    },
    onError: () => {
      toast.error("❌ Échec de la suppression de la réponse.");
    },
  });
};




