import { Container, Box, Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MColorButtonView from "../../components/MInput/MColorButtonView";
import { MFlexBox } from "src/components/MLayout";
import { fetchMetaData } from "src/utils/pinata";
import CollectionInfoTab from "./CollectionInfoTab1";
import { fetchCategories, getContractUri } from "src/store/contract/actions";
import { MTopRadiusImg } from "src/components/MImages";
import styled from "styled-components";
import "./CollectionView.scss";
import { showNotify } from "src/utils/notify";
import MScrollToTop from "src/components/MScrollToTop";
import Slider from "./Slider";

const CollectionView = (props) => {
  const { contractAddress } = props.match.params;
  const newCollectionInfo = useSelector(
    (state) => state.contract.collectionInfo
  );
  const profile = useSelector((state) => state.profile);
  const categories = useSelector((state) => state.contract.categories);
  const [metaData, setMetaData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(getContractUri(contractAddress));
    dispatch(fetchCategories());
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
    if (newCollectionInfo.nfts.length == newCollectionInfo.tokenLimit) {
      showNotify("You created all NFTs of you collection", "warning");
      return;
    }
    props.history.push(
      `/create-nft/${contractAddress}/${newCollectionInfo.id}`
    );
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: "100px" }}>
      <MScrollToTop history={props.history} />
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
                {console.log("contract ", metaData)}
                {categories.filter((item) => item.id == metaData?.category)[0]
                  ?.name +
                  "/" +
                  metaData?.subCategory}
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
        {isLoading ? (
          <Skeleton animation="wave" width="100%" height="200px"></Skeleton>
        ) : (
          <Slider images={newCollectionInfo.nfts} history={props.history} />
        )}
      </MFlexBox>
      {newCollectionInfo?.userId === profile.id && (
        <section className="create-button-part">
          <MColorButtonView onClick={onCreateNFT}>
            Create your NFTs
          </MColorButtonView>
        </section>
      )}
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
