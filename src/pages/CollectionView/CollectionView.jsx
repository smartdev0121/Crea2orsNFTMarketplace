import { Container, Box, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MColorButtonView from "../../components/MInput/MColorButtonView";
import { MFlexBox } from "src/components/MLayout";
import { fetchMetaData } from "src/utils/pinata";
import CollectionInfoTab from "./CollectionInfoTab1";
import { getContractUri } from "src/store/contract/actions";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { EffectCoverflow, Pagination } from "swiper";
import MNFTCard from "src/components/MCards/MNFTCard";
import { MTopRadiusImg } from "src/components/MImages";
import styled from "styled-components";
import "./CollectionView.scss";
import { categories } from "../CreateCollection/CreateCollectionPage";

const CollectionView = (props) => {
  const newCollectionInfo = useSelector(
    (state) => state.contract.collectionInfo
  );
  const { contractAddress } = props.match.params;
  const dispatch = useDispatch();
  const [metaData, setMetaData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    dispatch(getContractUri(contractAddress));
  }, []);

  useEffect(async () => {
    let contractMetaData = null;
    if (newCollectionInfo.contractUri) {
      setIsLoading(true);
      contractMetaData = await fetchMetaData(newCollectionInfo.contractUri);
      setIsLoading(false);
      setMetaData({ ...metaData, ...contractMetaData });
    }
  }, [newCollectionInfo]);

  const onCreateNFT = () => {
    props.history.push(
      `/create-nft/${contractAddress}/${newCollectionInfo.id}`
    );
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: "100px" }}>
      <MBox>
        {isLoading ? (
          <Skeleton animation="wave" width="100%" height="300px" />
        ) : (
          <section className="image-section">
            <div className="shadow"></div>
            <MTopRadiusImg
              src={metaData?.image_url || "/images/home/visual.png"}
            />
            <div className="image-info-part">
              <h2 className="pretty-text">{metaData?.name}</h2>
              <p className="category">
                {categories[metaData?.category] + "/" + metaData?.subCategory}
              </p>
              <p>Colleciton Token Limit: {metaData?.tokenLimit}</p>
            </div>
          </section>
        )}

        <section className="info-section">
          {isLoading ? (
            <Skeleton animation="wave" width="280px" height="100px" />
          ) : (
            <div className="description">{metaData?.highLight}</div>
          )}
          {isLoading ? (
            <Skeleton animation="wave" width="547px" height="450px" />
          ) : (
            <div className="info-tab">
              <CollectionInfoTab metaData={metaData} />
            </div>
          )}
        </section>
      </MBox>
      <MFlexBox>
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
          {isLoading ? (
            <Skeleton animation="wave" width="100%" height="200px"></Skeleton>
          ) : (
            newCollectionInfo.nfts.map((item, index) => {
              return (
                <SwiperSlide key={item.name + index}>
                  <MNFTCard data={item}></MNFTCard>
                </SwiperSlide>
              );
            })
          )}
        </Swiper>
      </MFlexBox>
      <section className="create-button-part">
        <MColorButtonView onClick={onCreateNFT}>
          Create your NFTs
        </MColorButtonView>
      </section>
    </Container>
  );
};
export default CollectionView;

const MBox = styled(Box)`
  border-radius: 10px;
  border: 1px solid #333;
  background-color: #23263066;
  padding: 15px;
`;
