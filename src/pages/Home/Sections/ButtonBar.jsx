import React from "react";
import { Button, Box } from "@mui/material";

const ButtonBar = ({ categories, onClicked }) => {
  const [checked, setChecked] = React.useState(true);
  console.log("categories", categories);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleClick = (eve, id) => {
    onClicked(eve, id);
  };

  return (
    <Box>
      <div className="button-bar">
        {categories?.map((item, index) => {
          if (item.id == 1) return;
          return (
            <Button
              className="btn outline category-btn"
              key={item.name + index}
              onClick={(eve) => handleClick(eve, item.id)}
            >
              <img src={item.icon_url}></img>
              {item.name}
            </Button>
          );
        })}
      </div>
    </Box>
  );
};

export default ButtonBar;
