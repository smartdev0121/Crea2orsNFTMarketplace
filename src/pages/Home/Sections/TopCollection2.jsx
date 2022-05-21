import React, { useEffect, useState } from "react";
import { EffectCoverflow, Pagination } from "swiper";
import { useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import MNFTItem from "src/components/MNFTItem";
import MViewCollection from "../../../components/MViewCollection";
import Box from "@mui/material/Box";

// Import Swiper styles
import "swiper/swiper.scss";
import "swiper/modules/effect-coverflow/effect-coverflow.scss";
import "swiper/modules/pagination/pagination.scss";
import "./FeaturedArtist.scss";

const TopCollection2 = ({ mainCollection2, history }) => {
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
    <div>
      <div className="welcome-image collection-1">
        <div className="top-collection pulse" key={1}>
          <img
            src={
              mainCollection2?.Collections.image_url ||
              "/images/home/visual.png"
            }
            alt="Visual"
          />
          <MViewCollection
            category={mainCollection2?.Collections.category}
            name={mainCollection2?.Collections.name}
            contractAddress={mainCollection2?.Collections.contract_address}
            id={mainCollection2?.Collections.id}
            history={history}
          />
        </div>

        <Swiper
          slidesPerView={4}
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
              <SwiperSlide>
                <MNFTItem key={`nft2_${index}`} nft={item} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default TopCollection2;
