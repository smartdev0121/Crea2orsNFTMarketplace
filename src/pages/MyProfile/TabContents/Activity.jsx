import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import { Loyalty } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { getActivity } from "src/store/profile/actions";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import Diamond from "@mui/icons-material/Diamond";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";

const Activity = () => {
  const dispatch = useDispatch();
  const activities = useSelector((state) => state.profile?.activity);
  console.log("Activit", activities);
  useEffect(() => {
    dispatch(getActivity());
  }, []);

  return (
    <div className="filter-bowl">
      <div className="act-content">
        {activities ? (
          <List dense>
            {activities.map((item, index) => {
              const time = item.createdAt;
              return (
                <ListItem
                  disablePadding
                  key={"Owner" + index}
                  secondaryAction={<Chip icon={<Diamond />} label={time} />}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <img src={item?.image_url} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item?.type + " " + item?.target}
                    secondary={item?.to_address || ""}
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <section className="content">
            <h4>Nothing yet</h4>
            <p>Looks like there's still nothing. Activity will be shown here</p>
            <div className="button-container">
              <BrowseButton>Explore Crea2ors</BrowseButton>
            </div>
          </section>
        )}
      </div>

      {/* <section className="filter-container">
        <h4>Filters</h4>
        <div className="filter-btn-container">
          <BarButton>
            <Loyalty sx={{ fontSize: "14px" }} />
            &nbsp;Listings
          </BarButton>
          <BarButton>
            <Loyalty sx={{ fontSize: "14px" }} />
            &nbsp;Purchase
          </BarButton>
          <BarButton>
            <Loyalty sx={{ fontSize: "14px" }} />
            &nbsp;Sales
          </BarButton>
          <BarButton>
            <Loyalty sx={{ fontSize: "14px" }} />
            &nbsp;Transfer
          </BarButton>
          <BarButton>
            <Loyalty sx={{ fontSize: "14px" }} />
            &nbsp;Burns
          </BarButton>
          <BarButton>
            <Loyalty sx={{ fontSize: "14px" }} />
            &nbsp;Likes
          </BarButton>
          <BarButton>
            <Loyalty sx={{ fontSize: "14px" }} />
            &nbsp;Bids
          </BarButton>
          <BarButton>
            <Loyalty sx={{ fontSize: "14px" }} />
            &nbsp;Followings
          </BarButton>
        </div>
      </section> */}
    </div>
  );
};

const BrowseButton = styled(Button)(({ theme }) => ({
  color: "white",
  backgroundColor: "#da4bfd",
  textTransform: "none",
  padding: "7px 15px !important",
  borderRadius: "30px",
  display: "block",
  flex: "1 1",
  "&:hover": {
    backgroundColor: "#da4bfd",
  },
}));

const BarButton = styled(Button)(({ theme }) => ({
  color: "#aaa",
  fontSize: "12px",
  lineHeight: "1",
  padding: "5px 13px !important",
  border: "1px solid #555",
  textTransform: "none",
  borderRadius: "30px",
  margin: "5px",
}));

export default Activity;
