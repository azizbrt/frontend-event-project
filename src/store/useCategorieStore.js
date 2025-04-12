// store/useCategorieStore.js
import { create } from "zustand";
import axios from "axios";
const API_URL = "http://localhost:8000/api/categories";


const useCategorieStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/get`);
      set({ categories: res.data.categories, loading: false });
    } catch (error) {
      set({ error: "Échec de chargement des catégories", loading: false });
    }
  },
}));

export default useCategorieStore;
