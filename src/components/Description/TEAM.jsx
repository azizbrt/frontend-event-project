import React, { useState, useRef, useEffect } from "react";
import image from "../../assets/image.jpg";
import wided from "../../assets/wided.png"
import Aziz from "../../assets/Aziz.png"

const TeamDetails = () => (
  <section className="bg-white py-12 rounded-lg shadow-lg mt-8 max-w-6xl mx-auto px-4 text-center">
    <h2 className="text-3xl font-bold text-gray-900 mb-4">Rencontrez notre équipe</h2>
    <p className="text-gray-600 mb-10">Les esprits derrière le projet EVENT</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {/* Membre 1 */}
      <div className="bg-orange-50 p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <img
          src={wided}
          alt="Wided Laabidi"
          className="w-32 h-32 rounded-full shadow-md mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-800">Wided Laabidi</h3>
        <p className="text-orange-600 text-sm mb-2">Développeuse Frontend</p>
        <p className="text-gray-600 text-sm text-center">
          Interface utilisateur, intégration des événements, filtres et design responsive.
        </p>
      </div>

      {/* Membre 2 */}
      <div className="bg-orange-50 p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <img
          src={Aziz}
          alt="Aziz Barrouta"
          className="w-32 h-32 rounded-full shadow-md mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-800">Aziz Barrouta</h3>
        <p className="text-orange-600 text-sm mb-2">Développeur Backend</p>
        <p className="text-gray-600 text-sm text-center">
          API, base de données MongoDB, sécurité et logique serveur.
        </p>
      </div>
    </div>
  </section>
);

const TEAM = () => {
  const [showMore, setShowMore] = useState(false);
  const detailsRef = useRef(null);

  const toggleShowMore = () => setShowMore((prev) => !prev);

  // Scroll vers le contenu quand il s'affiche
  useEffect(() => {
    if (showMore && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      detailsRef.current.focus();
    }
  }, [showMore]);

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-12">
      {/* Background Image */}
      <div
        className="relative bg-cover bg-center w-full h-auto min-h-[300px] md:min-h-[500px] flex flex-col justify-center items-center text-white rounded-lg shadow-lg overflow-hidden"
        style={{ backgroundImage: `url(${image})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Contenu */}
        <div className="relative z-10 max-w-2xl text-center px-6 py-12">
          <p className="text-xs sm:text-sm uppercase font-semibold tracking-wide">
            Les admines du projet EVENT
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-2 mb-4">Notre Équipe</h2>
          <p className="text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Plongez dans l’univers de ceux qui ont conçu cette plateforme. Créativité, rigueur
            et passion sont au rendez-vous.
          </p>
          <button
            onClick={toggleShowMore}
            aria-expanded={showMore}
            aria-controls="team-details"
            className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400"
          >
            {showMore ? "Réduire" : "En savoir plus"}
          </button>
        </div>
      </div>

      {/* Contenu supplémentaire avec animation */}
      <div
        id="team-details"
        tabIndex={-1}
        ref={detailsRef}
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showMore ? "max-h-screen opacity-100 mt-10" : "max-h-0 opacity-0"
        }`}
      >
        {showMore && <TeamDetails />}
      </div>
    </div>
  );
};

export default TEAM;
