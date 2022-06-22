import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { Chip, Avatar, Button } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Cancel, ShoppingBasket } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderData, canceledOrder } from "src/store/order/actions";
import { purple } from "@mui/material/colors";
import MAlertDialog from "src/components/MAlertDialog";
import {
  cancelListing,
  getMarketplaceContractAddress,
  buyAsset,
  placeBid,
} from "src/utils/order";
import { holdEvent, getValuefromEvent } from "src/utils/order";
import { currencyTokenAddress } from "src/config/contracts";
import { orderFinialized, bidPlaced } from "src/store/order/actions";
import MBidDialog from "./MBidDialog";
import "dotenv/config";

export default function CustomizedTables(props) {
  const dispatch = useDispatch();
  const ordersData = useSelector((state) => state.orders);
  console.log("This is orders data", ordersData);
  const profile = useSelector((state) => state.profile);
  const [confirmStatus, setConfirmStatus] = React.useState(false);
  const contractAddress = props.contractAddress;
  const [bidDlgOpen, setBidDlgOpen] = React.useState(false);
  const [rowIndex, setRowIndex] = React.useState(0);
  const [cancelOrderID, setCancelOrderID] = React.useState(undefined);
  useEffect(() => {
    dispatch(fetchOrderData(props.nftId));
  }, []);

  const cancelOrder = async (id) => {
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
      CurrencyTokenDecimals: 9,
    };

    // const result = await cancelListing(OrderState);
    // if (result) {
    //   const mContractAddress = await getMarketplaceContractAddress();
    //   const event = await holdEvent("OrderCancelled", mContractAddress);
    //   const values = await getValuefromEvent(event);
    //   dispatch(canceledOrder(ordersData[id].id));
    // }
    dispatch(canceledOrder(ordersData[id].id));
  };

  const cancelOrderClicked = (eve, index) => {
    setConfirmStatus(true);
    setCancelOrderID(index);
  };

  const confirmDlgClosed = () => {
    setConfirmStatus(false);
  };

  const buyOrder = async (event, id) => {
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
      CurrencyTokenAddress: currencyTokenAddress,
      CurrencyDecimals: 9,
    };

    const result = await buyAsset(OrderState);
    if (result) {
      const mContractAddress = await getMarketplaceContractAddress();
      const event = await holdEvent("OrderFinalized", mContractAddress);
      const values = await getValuefromEvent(event);
      dispatch(
        orderFinialized(values[0], ordersData[id].id, ordersData[id].nftId)
      );
    }
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
      CurrencyTokenAddress: currencyTokenAddress,
      CurrencyDecimals: 9,
    };
    const result = await placeBid(OrderState, Number(bidPrice));
    if (result) {
      const mContractAddress = await getMarketplaceContractAddress();
      const event = await holdEvent("OrderNewBid", mContractAddress);
      const values = await getValuefromEvent(event);
      console.log("this is event data", values);
      dispatch(bidPlaced(values[0], ordersData[id].id, ordersData[id].nftId));
    }
  };

  const placeBidClicked = async (eve, id) => {
    setRowIndex(id);
    setBidDlgOpen(true);
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
            cancelOrderID={cancelOrderID}
          />
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
                        onClick={(eve) => buyOrder(eve, index)}
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
