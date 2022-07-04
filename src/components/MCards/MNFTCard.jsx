import React from "react";
import styled from "styled-components";
import { Button, Paper, Stack, Grid, IconButton } from "@mui/material";
import { MImg } from "../MImages";
import { Visibility, Add, ShoppingCart } from "@mui/icons-material";
import { Link } from "react-router-dom";

const MNFTCard = (props) => {
  const { data } = props;
  const onBuyNow = () => {
    props.history.push(`/nft-view/${data.nfts.id}`);
  };
  return (
    <CardContainer>
      <FlexBetween>
        <Stack>
          <MTitle>{data.nfts.name}</MTitle>
          {/* <div>
            <SubTitle>
              {data.nfts.category
                ? data.nfts.category + "/" + data.nfts.subCategory
                : data.nfts.subCategory}
            </SubTitle>
            <MEditionText>{data.nfts.token_limit}</MEditionText>
          </div> */}
        </Stack>
        <Stack>
          <Link to={`/nft-view/${data.nfts.id}`}>
            <ViewButton>
              <Visibility fontSize="small" />
              &nbsp;View
            </ViewButton>
          </Link>
        </Stack>
      </FlexBetween>
      <Grid container sx={{ height: "300px" }}>
        <Grid item xs={12} sx={{ height: "300px", position: "relative" }}>
          <MImg src={data.nfts.file_url}></MImg>
          <MSaleBox>
            <MPriceBox>
              <div>
                <h6>PRICE</h6>
                <h6>
                  {data.price} CR2(=${data.price * 0.001})
                </h6>
              </div>
              <div>
                <h6>AMOUNT</h6>
                <h6 style={{ textAlign: "right" }}>{data.amount}</h6>
              </div>
            </MPriceBox>
            <MBuyButton onClick={onBuyNow}>
              <ShoppingCart fontSize="small" />
              &nbsp;&nbsp;Buy Now
            </MBuyButton>
          </MSaleBox>
        </Grid>
      </Grid>
    </CardContainer>
  );
};

export default MNFTCard;

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
  height: 100px;
  background-color: #484848b0;
  backdrop-filter: blur(4px);
`;

const MTitle = styled.h6`
  color: #ffaf36 !important;
`;
const CardContainer = styled(Paper)`
  background-color: rgb(30, 32, 38) !important;
  width: 90%;
  padding: 10px 10px;
  border-radius: 5px;
  border: 1px solid #333;
  margin: 5px;
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
