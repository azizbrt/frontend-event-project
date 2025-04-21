import { useMutation } from "@tanstack/react-query";
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