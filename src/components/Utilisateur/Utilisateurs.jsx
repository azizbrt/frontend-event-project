import React from "react";
import Navbar from "../Navbar/Navbar";
import Advice from "../advice/advice";
import EventsSection from "../Filtrer/EventsSection";
import CardSection from "../lesPages/CardSection";
import Description from "../Description/TEAM";
import Footer from "../Footer/Footer";
import { BsEnvelopePaper } from "react-icons/bs";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import Lottie from "react-lottie";

import emailAnimation from "../../animation/autrEmail.json";

const Utilisateurs = () => {
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Clé d'accès pour Web3Forms
    formData.append("access_key", "32ba1629-63c6-412a-9d3f-7b56322950b6");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      }).then((res) => res.json());

      if (res.success) {
        Swal.fire({
          title: "Succès",
          text: "Message envoyé avec succès !",
          icon: "success",
        });
        event.target.reset(); // Réinitialisation du formulaire
      } else {
        Swal.fire({
          title: "Erreur",
          text: "Une erreur s'est produite. Veuillez réessayer.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: "Impossible d'envoyer le message. Vérifiez votre connexion.",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <Advice />
      <CardSection />
      <EventsSection />
      <Description />

      <br />

      <section className="max-w-4xl mx-auto p-8 rounded-lg shadow-md flex flex-col h-auto md:h-[70vh] space-y-6">
        <h1 className="text-3xl font-bold mb-4 flex items-center">
          <BsEnvelopePaper className="text-orange-500 text-3xl mr-2" />
          <span className="text-orange-500">Contactez-nous</span>
        </h1>
        <p className="text-gray-600 mb-6">
          Contactez-nous pour plus d'informations et soyez averti lorsque nous
          publions quelque chose de nouveau.
        </p>
        <div className="flex justify-center items-center w-full">
          <form className="w-full md:w-1/2 space-y-4" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold"
              >
                Adresse e-mail :
              </label>
              <input
                required
                type="email"
                name="email"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Votre adresse e-mail"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-gray-700 font-semibold"
              >
                Votre message :
              </label>
              <textarea
                required
                name="message"
                className="w-full p-3 border
border-gray-300 rounded focus:outline-none focus:ring-2
focus:ring-orange-500 h-48"
                placeholder="Votre message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-orange-500
text-white px-4 py-2 rounded
hover:bg-orange-600 transition transform hover:scale-105 active:scale-95"
              aria-label="Envoyer le message"
            >
              Envoyer
            </button>
          </form>

          <div className="w-full flex justify-center items-center pt-8">
            <Lottie
              options={{
                animationData: emailAnimation,
                loop: true,
                autoplay: true,
              }}
              style={{ maxHeight: 350, width: "100%", maxWidth: 350 }}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Utilisateurs;
