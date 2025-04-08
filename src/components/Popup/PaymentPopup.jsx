import React from "react";
import { Card, CardContent, Button, Typography } from "@mui/material";

// Composant PaymentPopup qui affiche une fenêtre de paiement
const PaymentPopup = ({ onClose, onSuccess, price, title }) => {
  // Fonction appelée lorsque l'utilisateur confirme le paiement
  const handleSubmit = () => {
    onSuccess(); // Appelle la fonction pour signaler un paiement réussi
    onClose(); // Ferme la popup
  };

  return (
    // Fond semi-transparent pour le popup
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {/* Carte contenant les informations du paiement */}
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          {/* Titre du popup */}
          <Typography variant="h5" gutterBottom className="text-2xl font-bold text-center mb-4">
            Virement Bancaire
          </Typography>

          {/* Instructions supplémentaires */}
          <Typography variant="body2" className="mt-4 text-gray-600">
            Bienvenue, veuillez effectuer un virement du montant indiqué vers le compte bancaire ci-dessous.
          </Typography>

          {/* Informations de paiement */}
          <div className="space-y-4">
            <Typography variant="body1">
              <strong>Montant :</strong> {price} TND
            </Typography>
            <Typography variant="body1">
              <strong>À l'ordre de :</strong> Ste Event Tunisie
            </Typography>
            <Typography variant="body1">
              <strong>Pour l'événement :</strong> {title}
            </Typography>
            <Typography variant="body1">
              <strong>Banque :</strong> ATB
            </Typography>
            <Typography variant="body1">
              <strong>RIB Bancaire :</strong> 0109 0125 1100 0041 8491
            </Typography>
            <Typography variant="body1">
              <strong>BIC :</strong> ATBKTTNT
            </Typography>
            <Typography variant="body1">
              <strong>Agence :</strong> 41 av. Alain Savary, 1002 Belvedere
            </Typography>
          </div>

          {/* Bouton de confirmation du paiement */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleSubmit} // Action au clic
              variant="contained" // Style du bouton rempli
              sx={{
                bgcolor: "orange", // Fond orange
                "&:hover": { bgcolor: "#e65100" }, // Un orange plus foncé au survol
                color: "white", // Texte blanc
              }}
            >
              Confirmer le Paiement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPopup; // Exportation du composant pour être utilisé ailleurs
