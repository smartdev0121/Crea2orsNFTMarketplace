import React, { useEffect } from "react";
import { MContainer, MBox, MFlexBox } from "src/components/MLayout";
import { MTitle, MDescription } from "src/components/MTextLabels";
import MUserNFTCard from "src/components/MCards/MUserNFTCard";
import { useDispatch, useSelector } from "react-redux";
import { getUserNFTs } from "src/store/contract/actions";
import { getSpinner } from "src/store/app/reducer";

const MyNFTs = (props) => {
  const dispatch = useDispatch();
  const myCollections = useSelector((state) => state.contract.myCollections);
  const isLoading = useSelector((state) =>
    getSpinner(state, "USER_NFTS_LOADING")
  );
  const userNfts = useSelector((state) => state.contract.userNfts);
  console.log("USER ALL NFTS", userNfts);
  useEffect(() => {
    dispatch(getUserNFTs());
  }, []);

  const onNewCollection = () => {
    props.history.push("/create-collection");
  };

  return (
    <MContainer maxWidth="xl">
      <MBox>
        <MTitle className="text">My NFTs</MTitle>
        <MDescription>This is all nfts you owned</MDescription>
      </MBox>
      <MFlexBox>
        {isLoading
          ? [0, 1, 2, 3, 4].map((item, index) => {
              return (
                <MUserNFTCard isLoading={isLoading} key={"userNFT" + index} />
              );
            })
          : userNfts.map((item, index) => {
              return (
                <div data-aos="fade-up">
                  <MUserNFTCard
                    history={props.history}
                    data={item}
                    isLoading={isLoading}
                    key={"userNFT" + index}
                  />
                </div>
              );
            })}
      </MFlexBox>
    </MContainer>
  );
};

export default MyNFTs;
