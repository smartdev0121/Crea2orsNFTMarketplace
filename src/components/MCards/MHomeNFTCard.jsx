import React from "react";
import styled from "styled-components";
import {
  Button,
  Paper,
  Stack,
  Grid,
  IconButton,
  Chip,
  Skeleton,
} from "@mui/material";
import { MImg } from "../MImages";
import { Visibility, Add, ShoppingCart, Diamond } from "@mui/icons-material";
import { Link } from "react-router-dom";

const MNFTCard = (props) => {
  const { nft, isLoading } = props;
  const onNftClicked = (index) => {
    props.history.push(`/nft-view/${index}`);
  };
  return (
    <CardContainer onClick={(eve, index) => onNftClicked(nft?.id)}>
      <Grid container sx={{ height: "300px" }}>
        <Grid item xs={12} sx={{ height: "300px", position: "relative" }}>
          {isLoading ? (
            <Skeleton animation="wave" width="70%" height="17px" />
          ) : (
            <MName>
              <span>{nft?.name}</span>
            </MName>
          )}
          {isLoading ? (
            <Skeleton animation="wave" width="100%" height="300px" />
          ) : (
            <MImg src={nft?.file_url}></MImg>
          )}
          {isLoading ? (
            <Skeleton animation="wave" width="100%" height="50px" />
          ) : (
            <MChip
              icon={<Diamond />}
              label={nft?.minted_count + "/" + nft?.batch_size}
            />
          )}
        </Grid>
      </Grid>
    </CardContainer>
  );
};

export default MNFTCard;

const MChip = styled(Chip)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #000000a1 !important;
  align-items: center;
`;
const MName = styled.h3`
  font-family: "Paytone One";
  color: #202020;
  background-color: #890b0b;
  padding: 4px 5px;
  backdrop-filter: blur(4px);
  letter-spacing: -2px;
  position: absolute;
  top: 10px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  span {
    display: block;
    font-size: 15px;
    color: #f1ebe5 !important;
    letter-spacing: 0px;
  }
`;
const MBuyButton = styled(Button)`
  color: #fff700 !important;
  border: 1px solid #fff700 !important;
  width: 70%;
  margin: 0 auto !important;
`;
const MPriceBox = styled.div`
  padding: 10px;
  width: 100%;
  display: flex;
  text-align: start;
  justify-content: space-between;
`;
const MSaleBox = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 50px;
  background-color: #484848b0;
  backdrop-filter: blur(4px);
`;

const MTitle = styled.h6`
  color: #ffaf36 !important;
`;
const CardContainer = styled(Paper)`
  background-color: rgb(30, 32, 38) !important;
  max-width: 245px;
  min-width: 245px;
  padding: 10px 10px;
  border-radius: 5px;
  border: 1px solid #333;
  margin: 5px;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0px 0px 1px 1px #666;
  }
`;

export const MEditionText = styled.span`
  display: block;
  color: #aaa !important;
  font-size: 12px;
  margin: 5px 0;
`;

const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SubTitle = styled.span`
  display: block;
  font-size: 13px;
  color: #ccc !important;
  margin: 5px 0;
`;

const ViewButton = styled(Button)`
  background-color: rgb(43, 49, 57) !important;
  text-transform: none !important;
  color: #ccc !important;
  font-size: 14px !important;
  padding: 5px !important;
  margin: 3px !important;
  width: 100% !important;
`;
