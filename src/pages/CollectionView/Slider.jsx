import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Fade from "react-reveal/Fade";
import MNFTCard from "src/components/MCards/MNFTCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const SimpleSlider = (props) => {
  const [initialState, setInitialState] = useState({
    photoIndex: 0,
    isOpen: false,
    images: [],
  });

  useEffect(() => {
    setInitialState({ ...initialState, images: props.images });
  }, []);

  var settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 1000,
    arrows: true,
    className: "rounded-md overflow-x-hidden shadow-xl",
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      {initialState.images.length !== 0 && (
        <div className="mt-10" data-aos="fade-up" style={{ width: "100%" }}>
          <div className="mt-5 md:mt-0 relative">
            <Slider {...settings}>
              {initialState.images.map((element, i) => (
                <MNFTCard data={element} key={"NFTCard" + i}></MNFTCard>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </>
  );
};

export default SimpleSlider;
