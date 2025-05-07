import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
const API_URL = "http://localhost:8000/api/categories";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCategory) => {
      const response = await axios.post(`${API_URL}/create`, newCategory);
      return response.data;
    },
    onSuccess: async (data) => {
      toast.success("Catégorie ajoutée avec succès !");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de l'ajout de la catégorie !"
      );
    },
  });
};
export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get`);
      return response.data.categories;
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la récupération des catégorie"
      );
    },
  });
};
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`${API_URL}/delete/${id}`);
      return response.data;
    },
    onSuccess: async (data) => {
      toast.success("Catégorie supprimée avec succès !");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la suppression de la catégorie"
      );
    },
  });
};
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({id, data}) => {
      const response = await axios.put(`${API_URL}/modifier/${id}`,data);
      return response.data;
    },
    onSuccess: async (data) => {
      toast.success("Catégorie mise à jour avec succès ✅");
      queryClient.invalidateQueries(["categorie"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Erreur lors de la mise à jour"
      );
    },
  });
};
