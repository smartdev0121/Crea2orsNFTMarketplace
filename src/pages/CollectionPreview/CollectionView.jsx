import { Container, Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import MColorButtonView from "../../components/MInput/MColorButtonView";
import CollectionInfoTab from "./CollectionInfoTab1";
import { MTopRadiusImg } from "src/components/MImages";
import styled from "styled-components";
import "./CollectionView.scss";

const CollectionView = (props) => {
  const newCollectionInfo = useSelector(
    (state) => state.contract.collectionPreview
  );

  const categories = useSelector((state) => state.contract.categories);
  console.log(categories);
  console.log(newCollectionInfo);

  const goBack = () => {
    props.history.push("/create-collection");
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: "100px" }}>
      <MBox>
        <section className="image-section">
          <div className="shadow"></div>
          <MTopRadiusImg
            src={newCollectionInfo?.image || "/images/home/visual.png"}
          />
          <div className="image-info-part">
            <h2 className="pretty-text">{newCollectionInfo?.collectionName}</h2>
            <p className="category">
              {console.log(
                categories.filter((item) => item.id == newCollectionInfo?.type)
              )}

              {categories.filter(
                (item) => item.id == newCollectionInfo?.type
              )[0].name +
                "/" +
                newCollectionInfo?.subCategory}
            </p>
            <p>Colleciton Token Limit: {newCollectionInfo?.tokenLimit}</p>
          </div>
        </section>

        <section className="info-section">
          <div className="description">{newCollectionInfo?.intro}</div>
          <div className="info-tab">
            <CollectionInfoTab metaData={newCollectionInfo} />
          </div>
        </section>
      </MBox>
      <section className="create-button-part">
        <MColorButtonView onClick={goBack}>Go back</MColorButtonView>
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
