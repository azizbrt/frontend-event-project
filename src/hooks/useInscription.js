import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios"
import toast from "react-hot-toast";
import { data } from "react-router-dom";



const API_URL = "http://localhost:8000/api/inscription";

export const useInscription = () =>{
    return useMutation({
        mutationFn: async ({eventId, phone,note,nomAffiché, token})=>{
            const res= await axios.post(`${API_URL}/creeinscription`,{
                evenementId: eventId,
                telephone : phone,
                note: note,
                nomAffiché,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return res.data;
        },
        onSuccess: (data) =>{
            toast.success(data.message|| "Inscription réussie");
        },
        onError: (error) =>{
            const message = error?.response?.data?.message || "Erreur lors de l'inscription";
            toast.error(message);
        }
    })
}
export const useConsulterInscription = () => {
    return useQuery({
      queryKey: ["inscription"],
      queryFn: async () => {
        const res = await axios.get(`${API_URL}/get`);
  
        // 🔄 On s'assure que chaque inscription a un champ "id"
        const inscriptionsAvecId = res.data.inscriptions.map((inscription) => ({
          ...inscription,
          id: inscription._id || inscription.id, // pour être sûr
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
  
//valider inscription
export const useValiderInscription =() =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async(id)=>{
            const res= await axios.put(`${API_URL}/valider/${id}`);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Inscription validée avec succès")
            queryClient.invalidateQueries(["inscription"])
        },
        onError: (error) =>{
            const message = error?.response?.data?.message || "Erreur lors de la validation de l'inscription"; toast.error(message);
            toast.error(message)
        }
    })
}
export const useAnnulerInscription =() =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async(id)=>{
            const res= await axios.put(`${API_URL}/annulee/${id}`);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Inscription annulée avec succès")
            queryClient.invalidateQueries(["inscription"])
        },
        onError: (error) =>{
            const message = error?.response?.data?.message || "Erreur lors de l'annulation de l'inscription"; toast.error(message);
            toast.error(message)
        }
    })
}