import * as React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import styled from "styled-components";

const MSelect = styled(Select)`
  color: #bbb !important;
  border-color: #bbb !important;
  border: 1px solid #bbb !important;
  fieldset {
    border: none;
  }
`;
export default function UnstyledSelectObjectValues(props) {
  const categories = props.values;

  const onChanged = (e) => {
    props.onChangeValue(e.target.value);
  };

  return (
    <MSelect value={props.selectValue} onChange={onChanged}>
      {categories?.map((value, index) => (
        <MenuItem value={value.id} key={value.name + index}>
          {value.name}
        </MenuItem>
      ))}
    </MSelect>
  );
}
