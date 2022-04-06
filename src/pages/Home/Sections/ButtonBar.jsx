import React from "react";
import Button from "@mui/material/Button";
import { FormLabel } from "@mui/material";

const ButtonBar = () => {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="button-bar">
      <FormLabel className="category-label">CATEGORIES</FormLabel>

      <Button className="btn outline category-btn">
        <img src="/images/home/art.svg"></img>Art
      </Button>
      <Button className="btn outline category-btn">
        <img src="/images/home/music.svg"></img>Music
      </Button>
      <Button className="btn outline category-btn">
        <img src="/images/home/ticket.svg"></img>Ticket
      </Button>
      <Button className="btn outline category-btn">
        <img src="/images/home/community.svg"></img>Community
      </Button>
      <Button className="btn outline category-btn">
        <img src="/images/home/moments.svg"></img>Moments
      </Button>
      <Button className="btn outline category-btn">
        <img src="/images/home/default.svg"></img>Asset
      </Button>
    </div>
  );
};

export default ButtonBar;
