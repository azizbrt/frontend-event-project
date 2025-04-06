import { useState, useEffect } from "react"; // Importation des hooks React
import Cookies from "js-cookie"; // Importation de la bibliothèque js-cookie pour gérer les cookies
import { IoMdClose } from "react-icons/io"; // Importation de l'icône de fermeture depuis react-icons

const CookieConsent = () => {
  // État pour gérer l'affichage du bandeau de consentement
  const [showBanner, setShowBanner] = useState(true);

  // useEffect pour vérifier si le cookie existe déjà
  useEffect(() => {
    const cookieConsent = Cookies.get("cookie_consent"); // Récupération du cookie
    if (cookieConsent) {
      setShowBanner(false); // Affichage du bandeau si le cookie n'existe pas
    }
  }, []);

  // Fonction appelée lorsqu'on clique sur "Accepter"
  const handleAccept = () => {
    Cookies.set("cookie_consent", "true", { expires: 30 }); // Création du cookie valable 30 jours
    
    setShowBanner(false); // Masquage du bandeau
  };

  return (
    showBanner && ( // Affichage du bandeau uniquement si showBanner est true
      <div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 
        w-[90%] md:w-[500px] bg-gray-900 text-white p-5 rounded-xl 
        flex items-center gap-4 shadow-xl"
      >
        {/* Icône emoji pour représenter les cookies */}
        <span className="text-xl">🍪</span>

        {/* Message d'information */}
        <p className="text-sm flex-1">
          Nous utilisons des cookies pour améliorer votre expérience.
        </p>

        {/* Bouton pour accepter les cookies */}
        <button
          onClick={handleAccept}
          className="bg-orange-500 hover:bg-orange-600 
          text-white py-2 px-4 rounded-lg text-sm transition duration-300"
        >
          Accepter
        </button>

        {/* Bouton pour fermer le bandeau sans accepter */}
        <button
          onClick={() => setShowBanner(false)}
          className="text-white text-lg"
        >
          <IoMdClose /> {/* Icône de fermeture */}
        </button>
      </div>
    )
  );
};

export default CookieConsent;