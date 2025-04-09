import React from "react";
import { Link } from "react-router-dom";
import Image1 from "../../assets/evenement/coaching.jpg";
import Image2 from "../../assets/evenement/communauté.jpg";
import Image3 from "../../assets/evenement/Nettoyages.jpg";
import Image4 from "../../assets/evenement/Professionnel.jpg";
import Image5 from "../../assets/evenement/sport.jpg";

const events = [
  { 
    id: 1, 
    title: "Développement", 
    path: "/events/1", 
    img: Image1,
    date: "15 Juin 2023",
    location: "Espace Coworking"
  },
  { 
    id: 2, 
    title: "Communautaire", 
    path: "/events/2", 
    img: Image2,
    date: "22 Juin 2023",
    location: "Centre Ville"
  },
  { 
    id: 3, 
    title: "Environnement", 
    path: "/events/3", 
    img: Image3,
    date: "30 Juin 2023",
    location: "Parc National"
  },
  { 
    id: 4, 
    title: "Professionnel", 
    path: "/events/4", 
    img: Image4,
    date: "5 Juillet 2023",
    location: "Hôtel des Congrès"
  },
  { 
    id: 5, 
    title: "Sport", 
    path: "/events/5", 
    img: Image5,
    date: "12 Juillet 2023",
    location: "Stade Municipal"
  },
];

const CardSection = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header section */}
        <div className="text-center mb-16">
          <p className="text-orange-500 font-semibold mb-2">
            DÉCOUVREZ NOS ÉVÉNEMENTS
          </p>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Prochains Événements
          </h1>
          <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
        </div>

        {/* Event cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Nouveau
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {event.date}
                </div>
                
                <Link
                  to={event.path}
                  className="inline-block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Voir détails
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-12">
          <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-medium py-2 px-6 rounded-full transition-colors duration-300">
            Voir tous les événements
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardSection;