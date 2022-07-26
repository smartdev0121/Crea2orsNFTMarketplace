import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableHead,
  TableRow,
  Paper,
  TableBody,
  Chip,
  Avatar,
  Button,
  TableContainer,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { Cancel, ShoppingBasket } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderData, canceledOrder } from "src/store/order/actions";
import { purple } from "@mui/material/colors";
import MAlertDialog from "src/components/MAlertDialog";
import MBuyNFTDialog from "src/components/MBuyNFTDialog";
import { getMarketplaceContractAddress, placeBid } from "src/utils/order";
import { holdEvent, getValuefromEvent } from "src/utils/order";
import { currencyTokenAddress } from "src/config/contracts";
import { orderFinialized, bidPlaced } from "src/store/order/actions";
import MBidDialog from "./MBidDialog";
import { transferNFT, getTokenBalance, approve } from "src/utils/contract";
import { marketplace_contract_address } from "src/config/contracts";
import { showNotify } from "src/utils/notify";
import { CONTRACT_TYPE } from "src/config/global";
import { progressDisplay } from "src/utils/pleaseWait";
import { userStatus } from "src/store/profile/reducer";
import "dotenv/config";

export default function CustomizedTables(props) {
  const dispatch = useDispatch();
  const ordersData = useSelector((state) => state.orders);
  const profile = useSelector((state) => state.profile);
  const [confirmStatus, setConfirmStatus] = React.useState(false);
  const contractAddress = props.contractAddress;
  const status = useSelector((state) => userStatus(state));

  const [bidDlgOpen, setBidDlgOpen] = React.useState(false);
  const [rowIndex, setRowIndex] = React.useState(0);
  const [cancelOrderID, setCancelOrderID] = React.useState(undefined);
  const [buyOrderConfirm, setBuyOrderConfirm] = React.useState(false);
  const [buyOrderId, setBuyOrderId] = React.useState(undefined);
  useEffect(() => {
    dispatch(fetchOrderData(props.nftId));
  }, []);

  const cancelOrder = async (id) => {
    dispatch(canceledOrder(ordersData[id].id));
  };

  const cancelOrderClicked = (eve, index) => {
    setConfirmStatus(true);
    setCancelOrderID(index);
  };

  const confirmDlgClosed = () => {
    setConfirmStatus(false);
    setBuyOrderConfirm(false);
  };

  const buyOrder = async (id) => {
    let cr2Approving = progressDisplay(
      `Approving ${ordersData[id].price}CREA2`
    );
    let nftApproving;
    let transferringNFT;

    const amount = 1;

    const balance = await getTokenBalance(
      currencyTokenAddress[process.env.REACT_APP_CUR_CHAIN_ID]
    );

    if (!balance) {
      showNotify(
        "An error occurred while obtaining your CR2 wallet balance",
        "error"
      );
      cr2Approving?.finish();
      return;
    } else if (balance < ordersData[id].price) {
      showNotify("Your CR2 balance is less than the NFT mint price", "warning");
      cr2Approving?.finish();
      return;
    }
    try {
      const approveResult = await approve(
        marketplace_contract_address[process.env.REACT_APP_CUR_CHAIN_ID],
        currencyTokenAddress[process.env.REACT_APP_CUR_CHAIN_ID],
        ordersData[id].price,
        CONTRACT_TYPE.ERC20
      );

      cr2Approving?.finish();

      if (!approveResult) {
        showNotify("Approving failed", "error");
        return;
      }

      transferringNFT = progressDisplay("Buying NFT");

      const result = await transferNFT(
        contractAddress,
        ordersData[id].maker_address,
        ordersData[id].nfts.nft_id,
        amount,
        marketplace_contract_address[process.env.REACT_APP_CUR_CHAIN_ID],
        ordersData[id].price
      );

      transferringNFT?.finish();

      if (result) {
        dispatch(
          orderFinialized(ordersData[id].id, Number(amount), profile.id)
        );
      }
    } catch (err) {
      console.log(err);
      cr2Approving?.finish();
      nftApproving?.finish();
      transferringNFT?.finish();
    }
  };

  const buyOrderClicked = async (event, id) => {
    setBuyOrderId(id);
    setBuyOrderConfirm(true);
  };

  const onBidDlgClose = () => {
    setBidDlgOpen(false);
  };

  const onPlaceBid = async (id, bidPrice) => {
    const OrderState = {
      Creator: ordersData[id].creatorAddress,
      NftAddress: contractAddress,
      TokenId: ordersData[id].contractNftId,
      Amount: ordersData[id].amount,
      Price: ordersData[id].price,
      StartTime: ordersData[id].startTime,
      EndTime: ordersData[id].endTime,
      OrderType: ordersData[id].orderType,
      Buyer: ordersData[id].creatorAddress,
      BuyerPrice: ordersData[id].price,
      CurrencyTokenAddress:
        currencyTokenAddress[process.env.REACT_APP_CUR_CHAIN_ID],
      CurrencyDecimals: 9,
    };
    const result = await placeBid(OrderState, Number(bidPrice));
    if (result) {
      const mContractAddress = await getMarketplaceContractAddress();
      const event = await holdEvent("OrderNewBid", mContractAddress);
      const values = await getValuefromEvent(event);
      dispatch(bidPlaced(values[0], ordersData[id].id, ordersData[id].nftId));
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Price</StyledTableCell>
            <StyledTableCell>Quantity</StyledTableCell>
            <StyledTableCell>Creator</StyledTableCell>
            <StyledTableCell>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <MAlertDialog
            open={confirmStatus}
            onOK={(index) => cancelOrder(index)}
            onCancel={confirmDlgClosed}
            orderID={cancelOrderID}
          >
            Are you sure to cancel?
          </MAlertDialog>
          <MBuyNFTDialog
            open={buyOrderConfirm}
            orderID={buyOrderId}
            onOK={(index) => buyOrder(index)}
            onCancel={confirmDlgClosed}
          >
            Are you sure to buy NFT?
          </MBuyNFTDialog>
          {ordersData.map((row, index) => {
            let diff = row.endTime - row.startTime;
            const addrLength = String(row.maker_address).length;
            let addressAbbr =
              String(row.maker_address).substring(0, 5) +
              "..." +
              String(row.maker_address).substring(addrLength - 2, addrLength);
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
                {/* <StyledTableCell>
                  {diff <= 0
                    ? "#"
                    : `${parseInt(diff / 86400)}d ${parseInt(
                        (diff % 86400) / 3600
                      )}h ${parseInt((diff % 3600) / 60)}m`}
                </StyledTableCell> */}
                <StyledTableCell>
                  {
                    row.user?.id == profile?.id ? (
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
                    )
                    // ) : (
                    //   <BuyButton
                    //     variant="contained"
                    //     startIcon={<ShoppingBasket />}
                    //     onClick={(eve) => placeBidClicked(eve, index)}
                    //     disabled={diff <= 0}
                    //   >
                    //     {diff <= 0 ? "Sold out" : "Place Bid"}
                    //   </BuyButton>
                    // )
                  }
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
    </TableContainer>
  );
}

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  textTransform: "none",

  "&:hover": {
    backgroundColor: purple[700],
  },
}));

const BuyButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#12702fc2",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#109138c2",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#242638fa",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    backgroundColor: "#312b424f",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
