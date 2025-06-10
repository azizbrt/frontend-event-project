import React from 'react';
import Image1 from "../../assets/logo1.png";
import Image2 from "../../assets/sale.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Jusqu'à 50% de réduction sur les Formation MERN ",
  },
  {
    id: 2,
    img: Image2,
    title: "70% de réduction sur tous les évènements",
  },
];

const Remise = ({ handleOrderPopup }) => {
  var settings = {
    dots: false,
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

      {/* Remise section */}
      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center">
                {/* Contenu de l'offre */}
                <div className="flex flex-col justify-center gap-4 text-center sm:text-left order-2 sm:order-1 relative z-10 px-4">
                  <h1 className="text-3xl sm:text-5xl font-bold">
                    {data.title}
                  </h1>
                  <div className="flex justify-center sm:justify-start">
                    <button
                      onClick={handleOrderPopup}
                      className="bg-orange-600 hover:bg-orange-700 transition-transform transform hover:scale-105 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-full shadow-lg"
                    >
                      Voir
                    </button>
                  </div>
                </div>
                {/* Les images */}
                <div className="order-1 sm:order-2">
                  <div className="relative z-10">
                    <img
                      src={data.img}
                      alt=""
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

export default Remise;
