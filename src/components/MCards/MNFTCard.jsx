import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Paper, Stack, Grid, IconButton } from "@mui/material";
import { MImg } from "../MImages";
import { Visibility, Add, ShoppingCart } from "@mui/icons-material";
import { Link } from "react-router-dom";

const MNFTCard = (props) => {
  const { data } = props;
  const [blob, setBlob] = useState();
  const onBuyNow = () => {
    props.history.push(`/nft-view/${data.id}`);
  };

  useEffect(async () => {
    let blobIns = await fetch(data?.fileUrl).then((r) => r.blob());
    setBlob(blobIns);
  }, []);
  return (
    <CardContainer>
      <FlexBetween>
        <Stack>
          <MTitle>{data.name}</MTitle>
          {/* <div>
            <SubTitle>
              {data.nfts.category
                ? data.nfts.category + "/" + data.nfts.subCategory
                : data.nfts.subCategory}
            </SubTitle>
            <MEditionText>{data.nfts.token_limit}</MEditionText>
          </div> */}
        </Stack>
        {/* <Stack>
          <Link to={`/nft-view/${data.id}`}>
            <ViewButton>
              <Visibility fontSize="small" />
              &nbsp;View
            </ViewButton>
          </Link>
        </Stack> */}
      </FlexBetween>
      <Grid container sx={{ height: "300px" }}>
        <Grid item xs={12} sx={{ height: "300px", position: "relative" }}>
          {String(blob?.type).split("/")[0] == "image" && (
            <MImg src={data.fileUrl}></MImg>
          )}
          {String(blob?.type).split("/")[0] == "video" && (
            <MDiv>
              <video width="100%" controls>
                <source src={data.fileUrl} />
              </video>
            </MDiv>
          )}

          <MSaleBox>
            <MPriceBox>
              {/* <div>
                <h6>PRICE</h6>
                <h6>
                  {data.price} CR2(=${data.price * 0.001})
                </h6>
              </div> */}
              <div>
                <h6>TOTAL</h6>
                <h6 style={{ textAlign: "right" }}>{data.batchSize}</h6>
              </div>
            </MPriceBox>
            <MBuyButton onClick={onBuyNow}>
              <ShoppingCart fontSize="small" />
              &nbsp;&nbsp;View NFT
            </MBuyButton>
          </MSaleBox>
        </Grid>
      </Grid>
    </CardContainer>
  );
};

export default MNFTCard;

const MDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
  text-align: end;
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
