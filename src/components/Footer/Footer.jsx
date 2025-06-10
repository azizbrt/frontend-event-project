import React from "react";
import Banner from "../../assets/Nouveau dossier/footer.jpg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const FooterLinks = [
  { title: "Accueil", link: "/#" },
  { title: "À propos", link: "/about" },
];

const Footer = () => {
  return (
    <div style={BannerImg} className="text-orange-700 py-10 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 pt-5">
          
          {/* À propos */}
          <div className="md:col-span-1 text-center md:text-left">
            <h2 className="text-xl font-bold mb-4">À propos</h2>
            <p className="text-orange-700">
              Nous organisons des événements exceptionnels pour toutes les occasions.
              Restez informé et participez à nos offres exclusives.
            </p>
          </div>

          {/* Liens utiles */}
          <div className="md:col-span-1 text-center md:text-left">
            <h2 className="text-xl font-bold mb-4">Liens utiles</h2>
            <ul className="flex flex-col gap-2">
              {FooterLinks.map((link) => (
                <li
                  key={link.title}
                  className="cursor-pointer hover:text-orange-400 transition-all"
                >
                  <a href={link.link}>{link.title}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Réseaux & Contact */}
          <div className="md:col-span-1 text-center md:text-left">
            <h2 className="text-xl font-bold mb-4">Contact</h2>
            <div className="flex justify-center md:justify-start gap-4 mb-4">
              <a href="#" className="hover:text-orange-400">
                <FaInstagram className="text-3xl" />
              </a>
              <a href="#" className="hover:text-orange-400">
                <FaFacebook className="text-3xl" />
              </a>
              <a href="#" className="hover:text-orange-400">
                <FaLinkedin className="text-3xl" />
              </a>
            </div>
            <div className="text-orange-700">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <FaLocationArrow /> Nabeul, Kélibia
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <FaMobileAlt /> +216 52067885
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
