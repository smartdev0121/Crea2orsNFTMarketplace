import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import MProfileLink from "src/components/MLink/MProfileLink";
import {
  ClosedCaptionDisabled,
  Logout,
  Settings,
  PersonAdd,
  ManageAccounts,
  Collections,
  Inventory2,
  Extension,
  NoteAdd,
} from "@mui/icons-material";
import "dotenv/config";

const AccountMenu = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);

  console.log(profile);
  const avatarUrl = useSelector((state) => state.profile?.avatar_url);
  const customUrl = useSelector((state) => state.profile?.customUrl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              src={process.env.REACT_APP_BACKEND_URL + avatarUrl || ""}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MProfileLink to={`/user/${customUrl}`}>
          <MenuItem>
            <ListItemIcon>
              <ManageAccounts fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem>
        </MProfileLink>

        <MProfileLink to="/all-collections">
          <MenuItem>
            <ListItemIcon>
              <Inventory2 fontSize="small" />
            </ListItemIcon>
            All Collections
          </MenuItem>
        </MProfileLink>

        <MProfileLink to="/my-collections">
          <MenuItem>
            <ListItemIcon>
              <Collections fontSize="small" />
            </ListItemIcon>
            My Collections
          </MenuItem>
        </MProfileLink>

        <MProfileLink to="/my-nfts">
          <MenuItem>
            <ListItemIcon>
              <Extension fontSize="small" />
            </ListItemIcon>
            My NFTs
          </MenuItem>
        </MProfileLink>

        <MProfileLink to="/create-collection">
          <MenuItem>
            <ListItemIcon>
              <NoteAdd fontSize="small" />
            </ListItemIcon>
            Create Collection
          </MenuItem>
        </MProfileLink>

        <Divider />

        <MenuItem onClick={props.onDisconnect}>
          <ListItemIcon>
            <ClosedCaptionDisabled fontSize="small" />
          </ListItemIcon>
          Disconnect Wallet
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default AccountMenu;
