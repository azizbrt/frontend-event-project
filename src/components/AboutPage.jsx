import React,{useState} from 'react';
import { Link } from "react-router-dom";
import AboutImage from "../assets/Nouveau dossier/about.jpg";
import { motion } from "framer-motion";
import { UserIcon, CalendarIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import Footer from './Footer/Footer';
import Navbar from './Navbar/Navbar';

const AboutPage = () => {
  
  return (
    <div>

      <motion.div
        className="mt-40 container mx-auto my-8 px-6 py-12 bg-white shadow-xl rounded-3xl flex flex-col md:flex-row items-center gap-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <img
            src={AboutImage}
            alt="À propos de nous"
            className="rounded-xl max-w-full h-auto object-cover"
          />
        </motion.div>

        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-4xl font-extrabold text-orange-400 mb-4">
            À propos de nous
          </h2>
          <p className="text-gray-700 text-lg mb-4 leading-relaxed">
            Bienvenue sur{" "}
            <span className="text-orange-400 font-semibold">EVENT</span>, la
            plateforme tunisienne pour organiser et découvrir des événements
            exceptionnels. Notre mission est de simplifier la gestion et la
            participation à des événements, en vous offrant une solution
            moderne, intuitive et rapide.
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/evenements"
              className="inline-block mt-6 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow hover:bg-yellow-500 transition"
            >
              Découvrir les événements
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ✅ Cards infos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 px-4 md:px-20">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-purple-100 text-center">
          <UserIcon className="h-10 w-10 mx-auto text-orange-600 mb-3" />
          <h3 className="text-lg font-bold text-orange-600 mb-2">Projet PFE</h3>
          <p className="text-sm text-gray-600">
            Réalisé par <strong>Wided Laabidi</strong> &{" "}
            <strong>Aziz Barrouta</strong> dans le cadre du PFE à l’ISET
            Siliena, avec l'encadrement de <strong>Mr.Yasser Ben Ali</strong>{" "}
            (entreprise) & <strong>Mme.Helle Jbeli</strong> (ISET).
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-purple-100 text-center">
          <CalendarIcon className="h-10 w-10 mx-auto text-orange-600" />
          <h3 className="text-lg font-bold text-orange-600 mb-2">
            Créer un événement
          </h3>
          <div className="text-sm text-gray-600">
            Vous souhaitez organiser un événement ?{" "}
            <span className="text-orange-600">Contactez-nous</span> pour le
            publier sur EVENT !
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-purple-100 text-center">
          <LightBulbIcon className="h-10 w-10 mx-auto text-orange-600 mb-3" />
          <h3 className="text-lg font-bold text-orange-600 mb-2">
            Notre mission
          </h3>
          <p className="text-sm text-gray-600">
            Offrir une solution moderne et intuitive pour simplifier
            l'organisation et la participation à tous vos événements.
          </p>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
