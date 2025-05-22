import React from "react";
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
  const settings = {
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
    <section className="relative pt-28 overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 dark:bg-gray-950 dark:text-white duration-200">
      {/* Decorative orange background blob */}
      <div className="absolute h-[400px] w-[400px] sm:h-[700px] sm:w-[700px]  bg-orange-400 -top-1/3 sm:-top-1/2 right-0 rounded-3xl rotate-45 z-0"></div>

      {/* Slider content */}
      <div className="container mx-auto px-4 ">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-8">
                
                {/* Text section */}
                <div className="order-2 sm:order-1 text-center sm:text-left relative z-10 space-y-6">
                  <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
                    {data.title}
                  </h1>
                  <div className="flex justify-center sm:justify-start">
                    <button
                      onClick={handleOrderPopup}
                      className="bg-orange-600 hover:bg-orange-700 transition-transform transform hover:scale-105 text-white py-2 px-6 rounded-full shadow-lg"
                    >
                      Voir
                    </button>
                  </div>
                </div>

                {/* Image section */}
                <div className="order-1 sm:order-2 flex justify-center relative z-10">
                  <img
                    src={data.img}
                    alt={data.title}
                    className="w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] lg:h-[450px] lg:w-[450px] object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Remise;
