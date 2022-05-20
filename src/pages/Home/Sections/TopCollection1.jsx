import React, { useEffect, useState } from "react";
import { EffectCoverflow, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { apiGetAssets } from "src/utils/api";
import MNFTItem from "../../../components/MNFTItem";
import MViewCollection from "../../../components/MViewCollection";
import Box from "@mui/material/Box";

// Import Swiper styles
import "swiper/swiper.scss";
import "swiper/modules/effect-coverflow/effect-coverflow.scss";
import "swiper/modules/pagination/pagination.scss";
import "./FeaturedArtist.scss";

const TopCollection1 = () => {
  const [smallNFTs, setSmallNFTs] = useState([]);
  useEffect(() => {
    (async () => {
      try {
      } catch {
        ((err) => {})();
      }
    })();
  }, []);
  return (
    <div className="top-collection">
      <div className="welcome-image collection-1">
        <div className="top-collection pulse" key={2}>
          <img src="/images/home/visual.png" alt="Visual" />
          <MViewCollection />
        </div>
        <Swiper
          slidesPerView={2}
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
          {smallNFTs.map((item, index) => {
            return (
              <SwiperSlide key={"nft_swiper" + index}>
                <MNFTItem key={`nft1_${index}`} nft={item} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default TopCollection1;
