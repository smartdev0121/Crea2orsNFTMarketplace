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
  const [category, setCategory] = React.useState(0);

  React.useEffect(() => {
    setCategory(props.selectValue);
  }, [category]);

  const onChanged = (e) => {
    setCategory(e.target.value);
    props.onChangeValue(e.target.value);
  };
  return (
    <MSelect value={category} onChange={onChanged}>
      {categories.map((value, index) => (
        <MenuItem value={index} key={value + index}>
          {value}
        </MenuItem>
      ))}
    </MSelect>
  );
}
