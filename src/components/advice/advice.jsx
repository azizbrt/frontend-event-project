import React from 'react';
import Image1 from "../../assets/Professionnel.png";
import Image2 from "../../assets/Education.png";
import Image3 from "../../assets/sprt.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Des Conseils sur Professionnel",
    soustitre: "Pour les participants :Apportez des cartes de visite pour faciliter le réseautage. Préparez un pitch de présentation pour vous présenter rapidement et efficacement. Connectez-vous sur LinkedIn après l'événement pour consolider les contacts établis.."
  },
  {
    id: 2,
    img: Image2,
    title: "Des Conseils sur Éducation et Formation",
    soustitre: "Pour les participants :Préparez-vous en consultant le programme à l'avance pour identifier les sessions les plus pertinentes. Apportez de quoi prendre des notes (cahier, tablette) pour ne rien oublier des apprentissages. N'hésitez pas à poser des questions pour mieux comprendre les sujets abordés.."
  },
  {
    id: 3,
    img: Image3,
    title: "Des Conseils sur Sport et Bien-être",
    soustitre: "Pour les participants : Portez une tenue adaptée à l'activité pour maximiser votre confort et votre performance. Restez hydraté et échauffez-vous avant de commencer toute activité physique. Respectez les consignes de sécurité et écoutez votre corps pour éviter les blessures."
  },
];

const Advice = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-white flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200">
      {/* Background pattern */}
      <div className="h-[400px] w-[400px] sm:h-[700px] sm:w-[700px] bg-orange-300 
        absolute -top-1/3 sm:-top-1/2 right-0 rounded-3xl rotate-45 z-0"></div>

      {/* Section Conseils */}
      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center">
                {/* Contenu du conseil */}
                <div className="flex flex-col justify-center gap-4 text-center sm:text-left order-2 sm:order-1 relative z-10 px-4">
                  <h1 className="text-3xl sm:text-5xl font-bold">
                    {data.title}
                  </h1>
                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mt-2">
                    {data.soustitre}
                  </p>
                </div>
                {/* Image associée */}
                <div className="order-1 sm:order-2">
                  <div className="relative z-10">
                    <img
                      src={data.img}
                      alt={data.title}
                      className="w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] lg:h-[450px] lg:w-[450px] object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Advice;
