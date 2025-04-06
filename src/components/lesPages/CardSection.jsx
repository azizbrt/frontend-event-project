import React from "react";
import { Link } from "react-router-dom";
import Image1 from "../../assets/evenement/coaching.jpg";
import Image2 from "../../assets/evenement/communauté.jpg";
import Image3 from "../../assets/evenement/Nettoyages.jpg";
import Image4 from "../../assets/evenement/Professionnel.jpg";
import Image5 from "../../assets/evenement/sport.jpg";

const events = [
  { id: 1, title: "Développement", path: "/Card1", img: Image1 },
  { id: 2, title: "Communautaire", path: "/Card2", img: Image2 },
  { id: 3, title: "Environnement", path: "/Card3", img: Image3 },
  { id: 4, title: "Professionnel", path: "/Card4", img: Image4 },
  { id: 5, title: "Sport", path: "/Card5", img: Image5 },
];

const CardSection = () => {
  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-base text-orange-600">
            À NE PAS RATER
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold ">
            Les Meilleurs Événements Chez Nous
          </h1>
        </div>

        {/* Grid container with responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mx-auto lg:ml-40">

          {events.map((event) => (
            <div
              key={event.id}
              data-aos="fade-up"
              className="space-y-3 bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <img
                src={event.img}
                alt={`Image of the event: ${event.title}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-gray-500 text-sm mt-2">
                  Cet événement est le meilleur pour {event.title}.
                </p>
                <Link
                  to={event.path}
                  className="mt-4 inline-block bg-orange-400 text-white px-4 py-2 rounded hover:bg-gray-800"
                  aria-label={`Read more about the event: ${event.title}`}
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardSection;
