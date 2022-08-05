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
  GridItem,
  Chip,
} from "@mui/material";
import {
  Pause,
  Contrast,
  VolumeOff,
  Fullscreen,
  Sell,
  Face as FaceIcon,
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
import { getSpinner } from "src/store/app/reducer";
import MSpinner from "src/components/MSpinner";
import MintStatus from "./MintStatus";
import { userStatus } from "src/store/profile/reducer";
import { showNotify } from "src/utils/notify";

const NFTView = (props) => {
  const { nftId } = props?.match?.params;
  const [blob, setBlob] = useState();
  const dispatch = useDispatch();
  const nftInfo = useSelector((state) => state.contract.nftInfo);
  console.log(nftInfo);
  const categories = useSelector((state) => state.contract?.categories);
  console.log(categories);
  const userInfo = useSelector((state) => state.profile);
  const [curUserAmount, setCurUserAmount] = useState(0);
  const isMaking = useSelector((state) => getSpinner(state, "MAKING_ORDER"));
  const [open, setOpen] = React.useState(false);
  const status = useSelector((state) => userStatus(state));
  console.log(
    categories?.filter(
      (item, index) => Number(item.id) === Number(nftInfo.Contract?.category)
    )
  );
  useEffect(async () => {
    dispatch(getNFTInformation(nftId));
  }, []);

  useEffect(async () => {
    let blobIns = await fetch(nftInfo?.fileUrl).then((r) => r.blob());
    setBlob(blobIns);
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
                {String(blob?.type).split("/")[0] == "image" && (
                  <img src={nftInfo.fileUrl || "/images/home/visual.png"} />
                )}
                {String(blob?.type).split("/")[0] == "video" && (
                  <video width="100%" controls>
                    <source src={nftInfo.fileUrl} />
                  </video>
                )}

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
              <Chip
                icon={<FaceIcon />}
                sx={{ marginBottom: "1rem" }}
                label={
                  categories?.filter(
                    (item, index) =>
                      Number(item.id) === Number(nftInfo.Contract?.category)
                  )[0]?.name +
                  " / " +
                  categories?.filter(
                    (item) =>
                      Number(item.id) === Number(nftInfo.Contract?.subCategory)
                  )[0]?.name
                }
                variant="outlined"
              />
              <MTypography>
                <Person fontSize="small" />
                {nftInfo.owners?.length} Owners | <AllOut fontSize="small" />{" "}
                {nftInfo.batchSize} Total |
                <Diamond fontSize="small" /> You owned&nbsp;
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
                nftId={nftInfo?.id}
                curUserAmount={curUserAmount}
              />
              <MintStatus
                creator={nftInfo?.creator}
                contractAddress={nftInfo.Contract?.contract_address}
              />
              <MTradeState
                owners={nftInfo.owners}
                contractAddress={nftInfo.Contract?.contract_address}
                nftId={nftId}
              />
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
