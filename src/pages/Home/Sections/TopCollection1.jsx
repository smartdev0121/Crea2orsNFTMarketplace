import React, { useEffect, useState } from "react";
import { EffectCoverflow, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import MNFTItem from "../../../components/MNFTItem";
import MViewCollection from "../../../components/MViewCollection";
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import MHomeNFTCard from "src/components/MCards/MHomeNFTCard";
import InfiniteScroll from "react-infinite-scroll-component";
import "swiper/swiper.scss";
import "swiper/modules/effect-coverflow/effect-coverflow.scss";
import "swiper/modules/pagination/pagination.scss";
import "./FeaturedArtist.scss";

const TopCollection1 = ({ collectionDatas, history }) => {
  const categories = useSelector((state) => state.contract.categories);
  const [displayCollectionDatas, setDisplayCollectionDatas] = useState([]);

  useEffect(() => {
    setDisplayCollectionDatas(collectionDatas?.slice(0, 2));
  }, [collectionDatas]);

  const fetchMoredata = () => {
    setDisplayCollectionDatas((prev) =>
      collectionDatas?.slice(0, prev.length + 1)
    );
  };

  return (
    <section style={{ width: "90%", margin: "0 auto" }}>
      <InfiniteScroll
        dataLength={displayCollectionDatas?.length}
        hasMore={true}
        next={fetchMoredata}
        endMessage={<div style={{ alignText: "center" }}>All loaded!</div>}
      >
        {displayCollectionDatas?.map((mainCollection1, index) => (
          <div
            className="top-collection"
            key={"topcollection" + index}
            style={{
              border: "1px solid #2c2c2c",
              background: "#202020",
              borderRadius: "10px",
            }}
          >
            <div
              className="welcome-image collection-1"
              style={{ padding: "10px" }}
            >
              <div className="top-collection pulse" key={2}>
                <img
                  src={mainCollection1?.image_url || "/images/home/visual.png"}
                  alt="Visual"
                />
                <MViewCollection
                  category={categories?.filter(
                    (item) => item.id == mainCollection1?.category
                  )}
                  name={mainCollection1?.name}
                  contractAddress={mainCollection1?.contract_address}
                  id={mainCollection1?.id}
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
                {mainCollection1.nfts.map((item, index) => {
                  return (
                    <SwiperSlide key={"nft_swiper" + index}>
                      <MHomeNFTCard
                        key={`nft1_${index}`}
                        nft={item}
                        isLoading={false}
                        history={history}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </section>
  );
};

export default TopCollection1;
