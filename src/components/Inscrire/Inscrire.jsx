import React, { useState } from "react";
import Image1 from "../../assets/inscrire.png"; 

const Inscription = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email soumis:", email);
  };

  return (
    <div className="bg-white flex justify-center py-12 px-4"> 
      <div className="bg-orange-500 max-w-6xl w-full flex flex-col-reverse md:flex-row items-center gap-8 md:gap-10 px-6 py-8 md:py-12 mx-auto rounded-lg shadow-lg">
        {/* Texte à gauche sur grand écran et en haut sur mobile */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-50">
            Abonnez-vous maintenant pour bénéficier de plus d'informations
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Entrez votre email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            >
              Subscribe 
            </button>
          </form>
        </div>

        {/* Image à droite sur grand écran et en bas sur mobile */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img 
            src={Image1} 
            alt="Inscription" 
            className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Inscription;
