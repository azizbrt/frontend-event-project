import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaStar,
} from "react-icons/fa";
import useEventStore from "../../store/useEventStore ";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    partialVisibilityGutter: 40,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
    partialVisibilityGutter: 20,
  },
};

const EventCard = ({ event }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.3 }}
    className="mx-2 p-4 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
  >
    <div className="relative">
      <motion.img
        src={`http://localhost:8000/images/${event.image}`}
        alt={event.titre}
        className="w-full h-48 object-cover rounded-lg"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      />
      {event.isRecommended && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-full flex items-center text-xs">
          <FaStar className="mr-1" /> Recommandé
        </div>
      )}
    </div>

    <div className="mt-4 space-y-2">
      <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
        {event.titre}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>

      <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
        <CalendarDays className="w-4 h-4 text-orange-500" />
        {new Date(event.dateDebut).toLocaleDateString("fr-FR")}
      </div>

      <div className="flex items-center text-sm text-gray-500">
        <FaMapMarkerAlt className="mr-2 text-orange-500" />
        <span className="line-clamp-1">{event.lieu}</span>
      </div>


    </div>
    <Link
      to={`/events/${event._id}`}
      className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
    >
      Voir détails
    </Link>
  </motion.div>
);

const CustomArrow = ({ onClick, direction }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className={`absolute z-10 ${
      direction === "left" ? "left-0" : "right-0"
    } p-2 bg-white rounded-full shadow-lg`}
    aria-label={direction === "left" ? "Previous" : "Next"}
  >
    {direction === "left" ? (
      <FaChevronLeft className="text-orange-500 text-xl" />
    ) : (
      <FaChevronRight className="text-orange-500 text-xl" />
    )}
  </motion.button>
);

const EventsSection = () => {
  const { recommendedEvents, loading, error, fetchRecommendedEvents } =
    useEventStore();

  useEffect(() => {
    fetchRecommendedEvents();
  }, [fetchRecommendedEvents]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full py-12 bg-white">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center text-black mb-8"
      >
        Événements à ne pas manquer
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative px-4"
      >
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          partialVisible={true}
          customLeftArrow={<CustomArrow direction="left" />}
          customRightArrow={<CustomArrow direction="right" />}
          containerClass="carousel-container"
          itemClass="carousel-item-padding-40-px"
        >
          {recommendedEvents
  .filter((event) => event.etat === "accepté")
  .map((event) => (
    <EventCard key={event._id} event={event} />
))}

        </Carousel>
      </motion.div>
    </div>
  );
};

export default EventsSection;
