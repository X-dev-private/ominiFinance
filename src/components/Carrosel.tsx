import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image1 from "../assets/image1.svg";
import Image2 from "../assets/image2.png";
import Image3 from "../assets/image3.png";
import Image4 from "../assets/image4.png";

export default function ImageCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 8000, // Movimento bem lento (8s por transição)
    slidesToShow: 3, // Mostra 3 imagens ao mesmo tempo
    slidesToScroll: 1, // Move de forma contínua
    autoplay: true,
    autoplaySpeed: 0, // Sem pausa entre as transições
    pauseOnHover: false, // Continua rodando mesmo com o mouse sobre
    cssEase: "linear", // Faz o movimento contínuo sem parar
  };

  return (
    <div className="max-w-4xl mx-auto py-6 p-4 rounded-lgz mb-20 m">
      <Slider {...settings}>
        {[Image1, Image2, Image3, Image4].map((image, index) => (
          <div key={index} className="px-2">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-40 object-contain rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
