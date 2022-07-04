import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ReportDialog(props) {
  const [text, setText] = useState();
  const handleClose = () => {
    props.onClose();
  };

  const handleChange = (eve) => {
    if (!eve.target.value) return;
    setText(eve.target.value);
  };

  const handleSubmit = () => {
    props.onSubmit(text);
  };
  return (
    <div>
      <Dialog open={props.open} onClose={handleClose}>
        <DialogTitle>Report Dialog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tell us how this user violates the rules of the site.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Message"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={text}
            onChange={handleChange}
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
