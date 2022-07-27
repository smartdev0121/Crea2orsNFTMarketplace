import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import styled from "styled-components";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { MDescription, MTitle } from "src/components/MTextLabels";
import MTextField from "src/components/MInput/MTextField";
import { Form, Field } from "react-final-form";
import { InputAdornment } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { setApprovalForAll } from "../../utils/contract";
import { useDispatch } from "react-redux";
import { orderCreated } from "src/store/order/actions";
import { showNotify } from "../../utils/notify";
import { useSelector } from "react-redux";
import { marketplace_contract_address } from "src/config/contracts";
import { pleaseWait } from "please-wait";
import { CONTRACT_TYPE } from "src/config/global";
import { progressDisplay } from "src/utils/pleaseWait";
import "dotenv/config";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value != index}>
      {value == index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const SaleDialog = (props) => {
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();
  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date());
  const [price, setPrice] = React.useState(0);
  const [quantity, setQuantity] = React.useState(0);
  const userProfile = useSelector((state) => state.profile);
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const onSubmit = async (values) => {
    if (values.quantity > props.curUserAmount) {
      showNotify("You are exceeding amount you owned!", "warning");
      return;
    }
    const curTime = new Date().getTime();
    try {
      var loading_screen = progressDisplay("Putting on NFT to marketplace...");
      const orderData = {
        maker_address: userProfile.walletAddress,
        user_id: userProfile.id,
        nftTokenId: props.tokenId,
        nftDbId: props.nftId,
        amount: values.quantity,
        price: values.price,
      };

      const result = await setApprovalForAll(
        marketplace_contract_address[process.env.REACT_APP_CUR_CHAIN_ID],
        props.contractAddress,
        CONTRACT_TYPE.ERC1155
      );

      result
        ? dispatch(orderCreated(orderData))
        : showNotify("Error occured in approving tokens", "error");
      loading_screen?.finish();
    } catch (err) {
      console.log(err);
      loading_screen?.finish();
    }
    props.onClose();
  };
  const required = (value) => {
    return value ? undefined : "This field is required!";
  };

  const onQuantityChange = (eve) => {
    setQuantity(eve.target.value);
  };

  const onPriceChange = (eve) => {
    setPrice(eve.target.value);
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <Form
        onSubmit={onSubmit}
        validate={(values) => {
          const errors = {};
          if (values.quantity > 100) {
            errors.quantity = "Quantity can not exceed more than 100";
          }
          if (!values.quantity) errors.quantity = "this field is required!";
        }}
        render={({ handleSubmit, submitting, form, values, pristine }) => {
          return (
            <form onSubmit={handleSubmit} noValidate>
              <DialogTitle sx={{ backgroundColor: "#24253c" }}>
                Sell
              </DialogTitle>
              <DialogContent sx={{ backgroundColor: "#24253c" }}>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                    sx={{ flexDirection: "row !important" }}
                  >
                    <FormControlLabel
                      value={0}
                      control={<Radio />}
                      label="Fixed price"
                    />
                    {/* <FormControlLabel
                      value={1}
                      control={<Radio />}
                      label="Timed Auction"
                    /> */}
                  </RadioGroup>
                </FormControl>
                <TabPanel value={value} index={0}></TabPanel>
                <TabPanel value={value} index={1}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={3}>
                      <DateTimePicker
                        renderInput={(params) => <TextField {...params} />}
                        value={startTime}
                        onChange={(newValue) => {
                          setStartTime(newValue);
                        }}
                        className="date-time"
                      />
                      <DateTimePicker
                        renderInput={(params) => <TextField {...params} />}
                        value={endTime}
                        onChange={(newValue) => {
                          setEndTime(newValue);
                        }}
                      />
                    </Stack>
                  </LocalizationProvider>
                </TabPanel>
                <MTitle>Quantity</MTitle>
                <MDescription>
                  For quantities listed greater than 1, buyers will need to
                  purchase the entire quantity. Users are not able to purchase
                  partial amounts on Bitgert
                </MDescription>
                <Field
                  name="quantity"
                  validate={required}
                  component={MTextField}
                  inputProps={{ min: 1, max: 10, type: "number" }}
                  initialValue={quantity}
                  autoFocus
                  fullWidth
                  onChange={onQuantityChange}
                  label="Quantity"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <DialogContentText sx={{ marginBottom: "10px" }}>
                  To subscribe to this website, please enter your email address
                  here. We will send updates occasionally.
                </DialogContentText>
                <Field
                  name="price"
                  component={MTextField}
                  onChange={onPriceChange}
                  validate={required}
                  inputProps={{ min: 1, type: "number" }}
                  fullWidth
                  initialValue={price}
                  label="Price"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">CR2</InputAdornment>
                    ),
                  }}
                />
                {/* <FeeContent>
                  <ServieFee>Service Fee: 2.5% (1CR2 = $0.001)</ServieFee>
                  <WillReceive>
                    You will receive: {price * quantity}CR2 = $
                    {Number(price * quantity * 0.001).toFixed(5)}{" "}
                  </WillReceive>
                </FeeContent> */}
              </DialogContent>
              <DialogActions sx={{ backgroundColor: "#24253c" }}>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button type="submit">Complete Listing</Button>
              </DialogActions>
            </form>
          );
        }}
      />
    </Dialog>
  );
};

export default SaleDialog;

const FeeContent = styled.div``;
const WillReceive = styled.h6``;
const ServieFee = styled.h6``;
