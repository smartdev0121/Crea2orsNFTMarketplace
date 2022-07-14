import React, { useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  Paper,
  TableBody,
  Chip,
  Avatar,
  Button,
  TableCell,
  TableContainer,
} from "@mui/material";
import MBuyNFTDialog from "src/components/MBuyNFTDialog";
import styled from "styled-components";
import { AccountTree } from "@mui/icons-material";
import { useState } from "react";
import {
  mintAsset,
  getTokenBalance,
  transferCustomCrypto,
} from "src/utils/contract";
import { CONTRACT_TYPE } from "src/config/global";
import { useDispatch, useSelector } from "react-redux";
import { nftMinted } from "src/store/order/actions";
import { pleaseWait } from "please-wait";
import { showNotify } from "src/utils/notify";
import { currencyTokenAddress } from "src/config/contracts";
import "dotenv/config";

const MintStatus = (props) => {
  const creator = props.creator;
  const [walAbbr, setWalAbbr] = useState("");
  const [buyOrderConfirm, setBuyOrderConfirm] = React.useState(false);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);

  useEffect(() => {
    if (creator) {
      const walletAddress = String(creator.user.wallet_address);
      const addrLength = walletAddress.length;
      let addressAbbr =
        walletAddress.substring(0, 5) +
        "..." +
        walletAddress.substring(addrLength - 2, addrLength);
      setWalAbbr(addressAbbr);
    }
  }, [creator]);

  const confirmDlgClosed = () => {
    setBuyOrderConfirm(false);
  };

  const mintNFT = async (index) => {
    const amount = 1;
    const metaData = {
      tokenId: creator.nfts.nft_id,
      metaUri: creator.nfts.metadata_url,
      mintCount: amount,
      initialSupply: String(creator.nfts.batch_size),
      royaltyFee: String(creator.nfts.royalty_fee),
      royaltyAddress: creator.user.wallet_address,
    };
    const balance = await getTokenBalance(currencyTokenAddress);

    if (!balance) {
      showNotify(
        "An error occurred while obtaining your CR2 wallet balance",
        "error"
      );
      return;
    } else if (balance < creator.price) {
      showNotify("Your CR2 balance is less than the NFT mint price", "warning");
      return;
    }

    var loading_screen = pleaseWait({
      logo: "/favicon.ico",
      backgroundColor: "#343434",
      loadingHtml: `<div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
      <div>
        <h4 class="wait-text">Minting NFT ...</h4>
      </div>`,
      transitionSupport: false,
    });

    try {
      const result = await mintAsset(
        CONTRACT_TYPE.ERC1155,
        props.contractAddress,
        metaData
      );

      const cr2Result = await transferCustomCrypto(
        currencyTokenAddress[process.env.REACT_APP_CUR_CHAIN_ID],
        creator.user.wallet_address,
        Number(creator.price)
      );

      if (result && cr2Result) {
        dispatch(nftMinted(creator.id, Number(amount)));
      }
      loading_screen.finish();
    } catch (err) {
      console.log(err);
      loading_screen.finish();
    }
  };

  const buyOrderClicked = () => {
    setBuyOrderConfirm(true);
  };
  return (
    <>
      {creator && (
        <>
          <MintTitle>
            Mint Status(
            <Chip
              sx={{ margin: "10px 0" }}
              icon={
                <Avatar
                  sx={{ width: 24, height: 24 }}
                  src={
                    process.env.REACT_APP_BACKEND_URL +
                      creator.user?.avatar_url || ""
                  }
                />
              }
              label={creator?.user?.nickName || walAbbr}
            />
            )
          </MintTitle>
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Minted</TableCell>
                  <TableCell>Remain</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <MBuyNFTDialog
                  open={buyOrderConfirm}
                  orderID={0}
                  onOK={(index) => mintNFT(index)}
                  onCancel={confirmDlgClosed}
                >
                  Are you sure to mint NFT?
                </MBuyNFTDialog>
                <TableRow>
                  <TableCell>{creator.price}CR2</TableCell>
                  <TableCell>{creator.nfts.batch_size}</TableCell>
                  <TableCell>{creator.nfts.minted_count}</TableCell>
                  <TableCell>
                    {creator.nfts.batch_size - creator.nfts.minted_count}
                  </TableCell>
                  <TableCell>
                    <BuyButton
                      variant="contained"
                      startIcon={<AccountTree />}
                      onClick={buyOrderClicked}
                      disabled={
                        creator.nfts.batch_size - creator.nfts.minted_count == 0
                      }
                    >
                      MINT
                    </BuyButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default MintStatus;

const MintTitle = styled.p`
  font-size: 1.1rem;
  margin: 0;
`;

const BuyButton = styled(Button)`
  color: white !important;
  background-color: #2c32ffc7 !important;
  text-transform: none;
  &:hover: {
    background-color: "#109138c2";
  }
`;
