import React from "react";
import { Button, Box } from "@mui/material";

const ButtonBar = ({ categories, onClicked }) => {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleClick = (eve, id) => {
    onClicked(eve, id);
  };

  return (
    <Box className="container">
      <div className="button-bar">
        {categories?.map((item, index) => (
          <Button
            className="btn outline category-btn"
            key={item.name + index}
            onClick={(eve) => handleClick(eve, item.id)}
          >
            <img src={item.icon_url}></img>
            {item.name}
          </Button>
        ))}
      </div>
    </Box>
  );
};

export default ButtonBar;
