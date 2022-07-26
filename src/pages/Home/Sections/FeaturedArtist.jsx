import React from "react";
import { Button } from "@mui/material";
import styled from "styled-components";

import "./FeaturedArtist.scss";

const FeaturedArtist = ({ subCategories, onSubClicked }) => {
  console.log("Subcate", subCategories);
  return (
    <MBox className="mt-10">
      {subCategories?.map((item, index) => (
        <Button
          variant="outlined"
          sx={{ margin: "4px" }}
          key={item.name + index}
          onClick={(eve) => onSubClicked(eve, item.id)}
        >
          {item.name}
        </Button>
      ))}
    </MBox>
  );
};

export default FeaturedArtist;

const MBox = styled.div`
  border: 1px solid #333;
  padding: 10px;
  width: 89%;
  margin: 0 auto;
`;
