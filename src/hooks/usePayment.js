import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast";

const API_URL = "http://localhost:8000/api/payments";

export const  useCreatePayment =()=>{
    return useMutation({
        mutationFn: async (data)=>{
            const response = await axios.post(`${API_URL}/create`,data);
            return response.data;
        },
        onSuccess: (data)=>{
            toast.success("paiment en attente!!");
            console.log("Payment created successfully:", data);
        },

        onError: (error) => {
            toast.error("Erreur lors de la création du paiement: " + error.message);
            console.error("Error details:", error);
        }
    })
}


export const useGetAllPaiementsWithDetails = () => {
  return useQuery({
    queryKey: ['paiements'],  // The query key is now an object with queryKey
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/get`);
        return response.data.paiements;  // Assuming the response contains paiements in the 'paiements' field
      } catch (error) {
        toast.error("Erreur lors de la récupération des paiements");
        console.error("Error details:", error);
        throw new Error(error.response?.data?.message || error.message);
      }
    },
    onSuccess: (data) => {
      console.log("Paiements fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching paiements:", error);
    },
    refetchInterval: 600000,  // Automatically refetch every 10 minutes (optional)
  });
};
