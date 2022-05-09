import React, { useEffect, useState } from "react";
import {
  IconButton,
  Container,
  Stack,
  Avatar,
  Button,
  Typography,
  Box,
  Grid,
  GridItem
} from "@mui/material";
import {
  Pause,
  Contrast,
  VolumeOff,
  Fullscreen,
  Sell,
  AudioFile,
  Copyright,
  AllOut,
  Diamond,
  Person,
} from "@mui/icons-material";
import "./NFTView.scss";
import { styled } from "@mui/material/styles";
import { Logout } from "@mui/icons-material";
import MColorButtonView from "../../components/MInput/MColorButtonView";
import MSelectBox from "../../components/MInput/MSelectBox";
import { useDispatch, useSelector } from "react-redux";
import { getNFTInformation } from "src/store/contract/actions";
import { MContainer } from "src/components/MLayout";
import NFTInfoBox from "./NFTInfoBox";
import MTradeState from "./MTradeState";
import SaleDialog from "./SaleDialog";
import { MRoundBox } from "src/components/MLayout";
import {getSpinner} from "src/store/app/reducer";
import MSpinner from "src/components/MSpinner";
const NFTView = (props) => {
  const { nftId } = props.match.params;
  const dispatch = useDispatch();
  const nftInfo = useSelector((state) => state.contract.nftInfo);
  const userInfo = useSelector((state) => state.profile);
  const [curUserAmount, setCurUserAmount] = useState(0);
  const isMaking = useSelector(state => getSpinner(state, "MAKING_ORDER"));
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    dispatch(getNFTInformation(nftId));
  }, []);

  useEffect(() => {
    let amount = 0;

    nftInfo.owners?.forEach((item) => {
      item.user_id == userInfo.id && setCurUserAmount(item.amount);
    });
  }, [nftInfo]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <MContainer maxWidth="xl">
      {isMaking && <MSpinner />}
      <MRoundBox>
        <Grid container spacing={2}>
          <Grid item xs={5}>
          <div className="left-side">
            <div className="asset-view">
              <img src={nftInfo.fileUrl || "/images/home/visual.png"} />
              <div className="control-part">
                <IconButton sx={{ color: "yellow" }}>
                  <Pause />
                </IconButton>
                <IconButton sx={{ color: "yellow" }}>
                  <Contrast />
                </IconButton>
                <IconButton sx={{ color: "yellow" }}>
                  <VolumeOff />
                </IconButton>
                <IconButton sx={{ color: "yellow" }}>
                  <Fullscreen />
                </IconButton>
              </div>
              {nftInfo.traits && (
                <NFTInfoBox
                  description={nftInfo?.description}
                  traits={nftInfo?.traits}
                />
              )}
            </div>
          </div>
          </Grid>
          <Grid item xs={7}>
          <div className="side-part">
            <h2>{nftInfo.name}</h2>
            <MTypography>
              <Person fontSize="small" />1 Owners | <AllOut fontSize="small" />{" "}
              {nftInfo.batchSize} Total |<Diamond fontSize="small" /> You
              owned&nbsp;
              {curUserAmount}
            </MTypography>
            <AssetButton
              className="asset-btn"
              startIcon={<Sell />}
              onClick={handleClickOpen}
            >
              Sell
            </AssetButton>
            <SaleDialog
              open={open}
              onClose={handleClose}
              contractAddress={nftInfo?.Contract?.contract_address}
              tokenId={nftInfo?.nftId}
            />
            {/* <Stack direction="row">
              <AssetButton className="asset-btn">
                <AudioFile />
                Music
              </AssetButton>
              <AssetButton className="asset-btn">
                <LockOpen />
                Reedeemable
              </AssetButton>
            </Stack> */}
            <MTradeState owners={nftInfo.owners} />
          </div>
          </Grid>
        </Grid>
      </MRoundBox>
    </MContainer>
  );
};

const ViewButton = styled(Button)((theme) => ({
  color: "yellow",
  fontSize: "15px",
  fontWeight: "600",
}));

const AssetButton = styled(Button)((theme) => ({
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "#da4bfd",
  padding: "5px 13px",
  color: "white",
  "&:hover": {
    backgroundColor: "#da4bfd",
  },
}));

export default NFTView;

const MTypography = styled(Typography)`
  width: 100%;
  flexshrink: 0;
  color: #ccc !important;
`;
