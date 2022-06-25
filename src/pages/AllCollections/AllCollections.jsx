import React, { useEffect } from "react";
import { MContainer, MBox, MFlexBox } from "src/components/MLayout";
import { MTitle, MDescription } from "src/components/MTextLabels";
import MCollectionCard from "src/components/MCards/MCollectionCard";
import { Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllCollections } from "src/store/contract/actions";
import MAnimatedText from "src/components/MTextLabels/MAnimatedText";
import { getSpinner } from "src/store/app/reducer";

const AllCollections = (props) => {
  const dispatch = useDispatch();
  const allCollections = useSelector((state) => state.contract.allCollections);
  const isLoading = useSelector((state) =>
    getSpinner(state, "ALL_COLLECTIONS")
  );
  useEffect(() => {
    dispatch(getAllCollections());
  }, []);

  const onNewCollection = () => {
    props.history.push("/create-collection");
  };

  return (
    <MContainer maxWidth="xl">
      <MBox>
        {/* <MAnimatedText
          bottomText="You can explore collections and go into some collection and create
          your own NFT"
        >
          Explore Collections
        </MAnimatedText> */}
        <MTitle className="text">Explore Collections</MTitle>
        <MDescription>
          You can explore collections and go into some collection and create
          your own NFT
        </MDescription>
      </MBox>
      <Divider />
      <MFlexBox>
        {allCollections.map((item, index) => {
          return (
            <div data-aos="fade-up" key={"collection_item" + index}>
              <MCollectionCard
                data={item}
                key={item.id + index}
                isLoading={isLoading}
              />
            </div>
          );
        })}
      </MFlexBox>
    </MContainer>
  );
};

export default AllCollections;
