import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { getUserCollections } from "src/store/contract/actions";
import { MFlexBox } from "src/components/MLayout";
import MCollectionCard from "src/components/MCards/MCollectionCard";

const Collections = () => {
  const dispatch = useDispatch();
  const myCollections = useSelector((state) => state.contract.myCollections);
  useEffect(() => {
    dispatch(getUserCollections());
  }, []);

  return (
    <div className="tab-container">
      {myCollections.length == 0 ? (
        <section className="content">
          <h4>No collections found</h4>
          <p>
            We couldn't find any of your collections. Looks like you don't have
            any
          </p>
          <div className="button-container">
            <BrowseButton>Create a collection</BrowseButton>
            <ImportButton>Import an existing</ImportButton>
          </div>
        </section>
      ) : (
        <MFlexBox>
          {myCollections.map((item, index) => {
            return (
              <div data-aos="fade-up">
                <MCollectionCard data={item} key={item.id + index} />
              </div>
            );
          })}
        </MFlexBox>
      )}
    </div>
  );
};

const BrowseButton = styled(Button)(({ theme }) => ({
  color: "white",
  backgroundColor: "#da4bfd",
  textTransform: "none",
  padding: "7px 15px !important",
  borderRadius: "30px",
  display: "block",
  flex: "1 1",
  "&:hover": {
    backgroundColor: "#da4bfd",
  },
}));

const ImportButton = styled(Button)(({ theme }) => ({
  display: "block",
  color: "#aaa",
  textTransform: "none",
  border: "1px solid #777",
  marginTop: "5px",
  padding: "7px 13px !important",
  borderRadius: "30px",
  display: "block",
  flex: "1 1",
}));

export default Collections;
