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
  approve,
  allowance,
  holdEvent,
  getValuefromEvent,
} from "src/utils/contract";
import { CONTRACT_TYPE } from "src/config/global";
import { useDispatch, useSelector } from "react-redux";
import { nftMinted } from "src/store/order/actions";
import { showNotify } from "src/utils/notify";
import { currencyTokenAddress } from "src/config/contracts";
import { progressDisplay } from "src/utils/pleaseWait";
import { userStatus } from "src/store/profile/reducer";

import "dotenv/config";

const MintStatus = (props) => {
  const creator = props.creator;
  const [walAbbr, setWalAbbr] = useState("");
  const [buyOrderConfirm, setBuyOrderConfirm] = React.useState(false);
  const dispatch = useDispatch();
  const status = useSelector((state) => userStatus(state));

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

    const balance = await getTokenBalance(
      currencyTokenAddress[process.env.REACT_APP_CUR_CHAIN_ID]
    );

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

    let approve_wait = progressDisplay(
      ` Approving ${creator.price} CREA2 to Manager ...`
    );

    const approveResult = await approve(
      props.contractAddress,
      currencyTokenAddress[process.env.REACT_APP_CUR_CHAIN_ID],
      Number(creator.price) + 1,
      CONTRACT_TYPE.ERC20
    );

    const allowancevalue = await allowance(
      currencyTokenAddress[process.env.REACT_APP_CUR_CHAIN_ID],
      props.contractAddress,
      CONTRACT_TYPE.ERC20
    );

    if (allowancevalue < creator.price) {
      showNotify("You didn't allow price enough to mint to manager");
      return;
    }
    console.log("allowance", allowancevalue);

    approve_wait?.finish();

    if (!approveResult) {
      showNotify("You can not approve your balance", "warning");
      return;
    }

    var mint_wait = progressDisplay("Minting NFT ...");

    try {
      const metaData = {
        tokenId: creator.nfts.nft_id,
        bFirst: creator.nfts.nft_id == -1 ? true : false,
        metaUri: creator.nfts.metadata_url,
        mintCount: amount,
        mintPrice: creator.price,
        initialSupply: creator.nfts.batch_size,
        royaltyFee: creator.nfts.royalty_fee,
        royaltyAddress: creator.user.wallet_address,
      };

      const result = await mintAsset(
        CONTRACT_TYPE.ERC1155,
        props.contractAddress,
        metaData
      );

      mint_wait?.finish();
      console.log("Creator", creator);
      if (result) {
        const event = await holdEvent("LazyMinted", props.contractAddress);
        const values = await getValuefromEvent(event);
        console.log("EVENT", values[0]);
        console.log("EVENT1", creator);

        console.log(
          "Creator",
          creator.nft_id,
          Number(values[0]),
          Number(amount)
        );
        dispatch(nftMinted(creator.nft_id, values[0], Number(amount)));
      }
    } catch (err) {
      mint_wait?.finish();
      console.log(err);
      return;
    }
  };

  const buyOrderClicked = () => {
    setBuyOrderConfirm(true);
  };

  const handleProfileClicked = () => {
    window.location.assign(
      process.env.REACT_APP_FRONT_URL + "user/" + profile.customUrl
    );
  };

  return (
    <>
      {creator && (
        <>
          <MintTitle>
            Mint Status(
            <Chip
              sx={{ margin: "10px 0" }}
              onClick={handleProfileClicked}
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
