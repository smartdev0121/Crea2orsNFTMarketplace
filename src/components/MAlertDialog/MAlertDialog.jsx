import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const MAlertDialog = (props) => {
  const onOK = () => {
    props.onOK(props.cancelOrderID);
    props.onCancel();
  };
  return (
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure to cancel?
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

export default MAlertDialog;
