import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:8000/api/auth";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/signup`,
        { email, password, name },
        { withCredentials: true }
      );
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating user",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response; 
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/verify-email`,
        { code },
        { withCredentials: true }
      );
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      if (get().isAuthenticated) return;

      const response = await axios.get(`${API_URL}/check-auth`, {
        withCredentials: true,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      console.warn(
        "Erreur auth frontend:",
        error.response?.data || error.message
      );
      set({
        error:
          error.response?.data?.message || "Erreur lors de l’authentification",
        isCheckingAuth: false,
        isAuthenticated: false,
        user: null,
      });
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email
      },{ withCredentials: true });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {password,withCredentials: true});
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
      
    }
  },
  // Function to update user profile
  updateUserProfile: async (name, email, password,confirmPassword) => {
    set({ isLoading: true, error: null }); // Start loading state
    try {
      // Sending the update request to the backend
      const response = await axios.put(`${API_URL}/profile`, {
        name,
        email,
        password,
        confirmPassword,
      }, {
        withCredentials: true, // To send cookies with the request (if needed)
      });

      // If successful, update the user state with the response
      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      // Handle errors, set loading to false, and show the error message
      set({
        isLoading: false,
        error: error.response?.data?.message || "Erreur lors de la mise à jour du profil",
      });
      throw error;
    }
  },

  // Optionally, add a function to clear error or reset user state
  clearError: () => set({ error: null }),

}));
