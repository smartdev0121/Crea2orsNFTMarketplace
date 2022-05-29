import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { styled } from "@mui/system";

export default function AccessibleTabs2() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", height: "20px" }}>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          value={value}
          aria-label="Tabs where each tab needs to be selected manually"
          sx={{
            minHeight: "20px",
            ".MuiTabs-indicator": { backgroundColor: "#cbca03ba" },
          }}
        >
          <Tab
            label="SHOW DETAILS"
            sx={{
              color: "#c5c5c5",
              fontSize: "12px",
              minHeight: "20px",
              padding: "5px",
              alignItems: "center",
              "&.Mui-selected": { color: "white" },
            }}
            value="1"
          />
          <Tab
            label="ABOUT"
            value="2"
            sx={{
              color: "#c5c5c5",
              fontSize: "12px",

              minHeight: "20px",
              padding: "5px",
              alignItems: "center",
              "&.Mui-selected": { color: "white" },
            }}
          />
        </TabList>
      </TabContext>
      <TabPanel value="1">Item One</TabPanel>
      <TabPanel value="2">Item Two</TabPanel>
    </Box>
  );
}
