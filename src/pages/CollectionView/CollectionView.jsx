import { Container, Box, Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MColorButtonView from "../../components/MInput/MColorButtonView";
import { MFlexBox } from "src/components/MLayout";
import { fetchMetaData } from "src/utils/pinata";
import CollectionInfoTab from "./CollectionInfoTab1";
import { getContractUri } from "src/store/contract/actions";
import { MTopRadiusImg } from "src/components/MImages";
import styled from "styled-components";
import "./CollectionView.scss";
import { categories } from "../CreateCollection/CreateCollectionPage";
import Slider from "./Slider";

const CollectionView = (props) => {
  const newCollectionInfo = useSelector(
    (state) => state.contract.collectionInfo
  );
  const { contractAddress } = props.match.params;
  const dispatch = useDispatch();
  const [metaData, setMetaData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

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
            <Skeleton animation="wave" width="35%" height="400px" />
          ) : (
            <div className="description">{metaData?.highLight}</div>
          )}
          {isLoading ? (
            <>
              <Stack width={"95%"} sx={{ marginLeft: "10px" }}>
                <Stack direction={"row"} spacing={2}>
                  <Skeleton animation="wave" width="100px" height="50px" />
                  <Skeleton animation="wave" width="100px" height="50px" />
                </Stack>
                <Skeleton animation="wave" width="100%" height="50px" />
                <Skeleton animation="wave" width="100%" height="450px" />
              </Stack>
            </>
          ) : (
            <div className="info-tab">
              <CollectionInfoTab metaData={metaData} />
            </div>
          )}
        </section>
      </MBox>
      <MFlexBox>
        {/* <Slider {...settings}>
          {newCollectionInfo.nfts.map((item, index) => {
            return (
              <SwiperSlide key={item.name + index}>
                <MNFTCard data={item}></MNFTCard>
              </SwiperSlide>
            );
          })}
        </Slider> */}
        {isLoading ? (
          <Skeleton animation="wave" width="100%" height="200px"></Skeleton>
        ) : (
          <Slider images={newCollectionInfo.nfts} />
        )}
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
