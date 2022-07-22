import * as React from "react";
import Tabs from "@mui/material/Tabs";
import {
  Tab,
  Stack,
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  Chip,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import { PeopleAlt, Sell, Diamond } from "@mui/icons-material";
import MSellTable from "./MSellTable";
import styled from "styled-components";
import "dotenv/config";

export default function IconLabelTabs(props) {
  const [value, setValue] = React.useState(0);
  const owners = props.owners;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon label tabs example"
      >
        <MTab
          icon={<Sell fontSize="small" />}
          label="Onsale"
          sx={{ fontSize: "12px !important" }}
        ></MTab>
        <MTab
          icon={<PeopleAlt fontSize="small" />}
          label="Owners"
          sx={{ fontSize: "12px !important" }}
        ></MTab>
      </Tabs>
      <TabPanel value={value} index={1}>
        <List dense>
          {owners?.map((item, index) => {
            const walAddr = String(item.user_wallet_address);
            const addrLength = walAddr.length;
            const displayAddr =
              walAddr.substring(0, 8) +
              "..." +
              walAddr.substring(addrLength - 3, addrLength);
            return (
              <ListItem
                disablePadding
                key={"Owner" + index}
                secondaryAction={
                  <Chip icon={<Diamond />} label={item.amount} />
                }
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      src={
                        process.env.REACT_APP_BACKEND_URL +
                          item.User.avatar_url || ""
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText primary={item.User.nick_name || displayAddr} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </TabPanel>
      <TabPanel value={value} index={0}>
        <MSellTable
          contractAddress={props.contractAddress}
          nftId={props.nftId}
        />
      </TabPanel>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MTab = styled(Tab)`
  color: #aaa !important;
  font-size: 13px !important;
  &.Mui-selected {
    color: #eee !important;
  }
`;

const UserRow = styled.div`
  display: flex;
`;
