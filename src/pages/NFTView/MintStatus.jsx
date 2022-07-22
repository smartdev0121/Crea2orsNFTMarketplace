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
import { AccountTree } from "@mui/icons-material";
import { useState } from "react";
import styled from "styled-components";
import { mintAsset } from "src/utils/contract";
import MBuyNFTDialog from "src/components/MBuyNFTDialog";
import { CONTRACT_TYPE } from "src/config/global";
import { useDispatch, useSelector } from "react-redux";
import { nftMinted } from "src/store/order/actions";

const MintStatus = (props) => {
  const creator = props.creator;
  const [walAbbr, setWalAbbr] = useState("");
  const [buyOrderConfirm, setBuyOrderConfirm] = React.useState(false);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);

  console.log(creator);
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
    const result = await mintAsset(
      CONTRACT_TYPE.ERC1155,
      props.contractAddress,
      metaData
    );
    if (result) {
      dispatch(nftMinted(creator.id, Number(amount)));
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

      {/* 
          
            
            {ordersData.map((row, index) => {
              let diff = row.endTime - row.startTime;
              
              if (diff != 0) {
                const curTime = Math.round(Number(new Date().getTime()) / 1000);
                if (curTime > row.startTime) diff = row.endTime - curTime;
              }
              return (
                <StyledTableRow key={"Order_table" + index}>
                  <StyledTableCell>{row.price}CR2</StyledTableCell>
                  <StyledTableCell>{row.amount}</StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      icon={
                        <Avatar
                          sx={{ width: 24, height: 24 }}
                          src={
                            process.env.REACT_APP_BACKEND_URL +
                              row.User?.avatar_url || ""
                          }
                        />
                      }
                      label={row.user?.nickName || addressAbbr}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {row.user?.id == profile?.id ? (
                      <ColorButton
                        variant="contained"
                        startIcon={<Cancel />}
                        onClick={(eve) => cancelOrderClicked(eve, index)}
                      >
                        Cancel
                      </ColorButton>
                    ) : (
                      <BuyButton
                        variant="contained"
                        startIcon={<ShoppingBasket />}
                        onClick={(eve) => buyOrderClicked(eve, index)}
                      >
                        Buy Now
                      </BuyButton>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
            <MBidDialog
              open={bidDlgOpen}
              onPlaceBid={onPlaceBid}
              onClose={onBidDlgClose}
              index={rowIndex}
            />
          </TableBody>
        </Table>
      </TableContainer> */}
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
