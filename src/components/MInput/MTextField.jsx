import React from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

const MTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#fdfdfd",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#95959561",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#9b9b9b61",
    },
    "&:hover fieldset": {
      borderColor: "#ffffff61",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#a9a9a961",
    },
  },
});

export default MTextField;
