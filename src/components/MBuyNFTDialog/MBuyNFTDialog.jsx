import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField, Typography } from "@mui/material";

const MBuyNFTDialog = (props) => {
  const [num, setNum] = useState(0);
  const onOK = () => {
    console.log(props.orderID, num);
    props.onOK(props.orderID, num);
    props.onCancel();
  };

  const onInputChange = (eve) => {
    setNum(eve.target.value);
  };
  return (
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Buy NFT</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <h4>How much are you going to buy?</h4>
          <TextField
            id="outlined-basic"
            type="number"
            variant="filled"
            defaultValue={num}
            onChange={onInputChange}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onOK}>Yes</Button>
        <Button onClick={props.onCancel} autoFocus>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MBuyNFTDialog;
