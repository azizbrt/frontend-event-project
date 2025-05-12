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

    formData.append("access_key", "c12a0a7f-5121-4b0d-8cf1-f6572be7d413");
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
        event.target.reset();
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

      {/* Contact Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Form Section */}
            <div className="md:w-1/2 p-8 md:p-10">
              <div className="flex items-center mb-6">
                <BsEnvelopePaper className="text-orange-500 text-3xl mr-3" />
                <h2 className="text-3xl font-bold text-orange-500">
                  Contactez-nous
                </h2>
              </div>
              <p className="text-gray-600 mb-8">
                Contactez-nous pour plus d'informations et soyez averti lorsque
                nous publions quelque chose de nouveau.
              </p>

              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Adresse e-mail
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Votre adresse e-mail"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Votre message
                  </label>
                  <textarea
                    required
                    name="message"
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Votre message"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white font-medium py-3 px-6 rounded-lg hover:bg-orange-600 transition duration-300 transform hover:scale-[1.02] active:scale-95"
                >
                  Envoyer le message
                </button>
              </form>
            </div>

            {/* Animation Section */}
            <div className="hidden md:block md:w-1/2 bg-gray-50 flex items-center justify-center p-8">
              <div className="max-w-xs">
                <Lottie
                  options={{
                    animationData: emailAnimation,
                    loop: true,
                    autoplay: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Utilisateurs;
