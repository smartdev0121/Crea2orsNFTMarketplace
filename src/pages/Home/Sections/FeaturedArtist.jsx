import React from "react";
import { EffectCoverflow, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { Box } from "@mui/material";
// Import Swiper styles
import "swiper/swiper.scss";
import "swiper/modules/effect-coverflow/effect-coverflow.scss";
import "swiper/modules/pagination/pagination.scss";
import "./FeaturedArtist.scss";
// import required modules
const FeaturedArtist = () => {
  return (
    <div>
      <Swiper
        slidesPerView={5}
        grabCursor={true}
        spaceBetween={30}
        centeredSlides={false}
        pagination={{
          clickable: true,
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide className="category-swiper-slide">
          <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
          <h4>design</h4>
        </SwiperSlide>
        <SwiperSlide className="category-swiper-slide">
          <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
          <h4>architecture</h4>
        </SwiperSlide>
        <SwiperSlide className="category-swiper-slide">
          <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
          <h4>literature</h4>
        </SwiperSlide>
        <SwiperSlide className="category-swiper-slide">
          <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
          <h4>painting</h4>
        </SwiperSlide>
        <SwiperSlide className="category-swiper-slide">
          <img src="https://swiperjs.com/demos/images/nature-5.jpg" />
          <h4>photography</h4>
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-6.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-7.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-8.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-9.jpg" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default FeaturedArtist;
