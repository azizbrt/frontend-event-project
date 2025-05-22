// Nouvelle façon (v5)
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:8000/api/admin";

const fetchUsers = async () => {
  const { data } = await axios.get(`${API_URL}/users`); // adapte le endpoint
  console.log("Réponse API:", data); // 👀 observe bien ça dans la console
  return data.data;
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
const AddUser = async (userData) => {
  try {
    const { data } = await axios.post(`${API_URL}/users/create`, userData);
    return data;
  } catch (error) {
    // Pass along the error response for better error handling in components
    throw error;
  }
};

export const useAddUser = () => {
  return useMutation({
    mutationFn: AddUser,
  });
};
const updateUser = async (updateUser) => {
  const { _id, ...userData } = updateUser;
  const response = await axios.put(`${API_URL}/users/${_id}`, userData);
  return response.data;
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: updateUser,
  });
};
const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/users/${userId}`);
  return response.data;
};
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: deleteUser,
  });
};
const searchUsers = async (searchTerm) => {
  const { data } = await axios.get(
    `${API_URL}/users/search?search=${searchTerm}`
  );
  return data; // Return the search results
};
export const useSearchUsers = (searchTerm) => {
  return useQuery({
    queryKey: ["searchUsers", searchTerm], // Query key based on searchTerm
    queryFn: () => searchUsers(searchTerm), // Search function
    enabled: searchTerm.length > 0, // Only run the query when searchTerm is not empty
  });
};
