import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import OnSale from "./TabContents/OnSale";
import Activity from "./TabContents/Activity";
import Collections from "./TabContents/Collections";
import Created from "./TabContents/Created";
import Owned from "./TabContents/Owned";

const tablist = ["On Sale", "Owned", "Created", "Collections", "Activity"];
export default function LabTabs(props) {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "#444" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            sx={{
              minHeight: "20px",
              ".MuiTabs-indicator": { backgroundColor: "#c5c5c5" },
              ".MuiTabs-flexContainer": { justifyContent: "center" },
            }}
          >
            {tablist.map((item, index) => (
              <Tab
                label={item}
                value={`${index}`}
                key={`item_${index}`}
                sx={{
                  color: "#c5c5c5",
                  fontSize: "12px",
                  fontWeight: "700",
                  minHeight: "20px",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  borderRadius: "10px",
                  padding: "10px",
                  margin: "5px",
                  "&.Mui-selected": { color: "white" },
                }}
              />
            ))}
          </TabList>
        </Box>
        <TabPanel value="0" sx={{ paddingLeft: "0px", color: "white" }}>
          <OnSale history={props.history} />
        </TabPanel>
        <TabPanel value="1" sx={{ paddingLeft: "0px", color: "white" }}>
          <Owned />
        </TabPanel>
        <TabPanel value="2" sx={{ paddingLeft: "0px", color: "white" }}>
          <Created />
        </TabPanel>
        <TabPanel value="3" sx={{ paddingLeft: "0px", color: "white" }}>
          <Collections />
        </TabPanel>
        <TabPanel value="4" sx={{ paddingLeft: "0px", color: "white" }}>
          <Activity />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
