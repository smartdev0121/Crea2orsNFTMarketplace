import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const MBuyNFTDialog = (props) => {
  const onOK = () => {
    props.onOK(props.orderID);
    props.onCancel();
  };
  return (
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm...</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <h4>{props.children}</h4>
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
