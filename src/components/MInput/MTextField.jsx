import React from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import "./MTextField.scss";

const CustomInput = styled(TextField)({
  width: "100%",
  "& label.Mui-focused": {
    color: "#999",
  },
  "& .MuiInput-root:before": {
    borderBottom: "1px solid rgb(70 70 70)",
  },
  "& .MuiInput-root:after": {
    borderBottom: "2px solid rgb(118 118 118)",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#95959561",
  },
  "& .MuiFormHelperText-root": {
    color: "rgb(237 237 237 / 49%) !important",
  },

  "& .MuiInput-root": {
    "& .MuiInput-input": {
      fontSize: "0.8rem",
      padding: "5px",
    },
    "& .MuiTypography-root": {
      fontSize: "0.8rem",
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#9b9b9b61",
      color: "#999",
    },
    "&:hover fieldset": {
      borderColor: "#ffffff61",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#444",
    },
  },
  "& .MuiInputLabel-root": {
    zIndex: "unset",
    fontSize: "1.2rem",
    color: "#bbb !important",
  },
});
const MTextField = (props) => {
  const {
    disabled,
    icon,
    input,
    label,
    meta: { asyncValidating, touched, error },
    required,
    placeholder,
    multiline,
    helperText,
    variant,
  } = props;
  let validClass = "";
  if (touched && error) {
    validClass = "is-invalid";
  } else if (touched) {
    validClass = "is-valid";
  }

  return (
    <div>
      <CustomInput
        type={input.type}
        icon={icon}
        label={label}
        className={validClass}
        disabled={disabled}
        placeholder={placeholder}
        InputLabelProps={{ ...props.InputLabelProps }}
        InputProps={{ ...props.InputProps }}
        multiline={multiline}
        helperText={helperText}
        name={input.name}
        required={required}
        value={typeof input.value === "number" ? `${input.value}` : input.value}
        onChange={input.onChange}
        variant={variant}
      />
      {asyncValidating && (
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      <div className="invalid-feedback">{touched && error}</div>
    </div>
  );
};
export default MTextField;
