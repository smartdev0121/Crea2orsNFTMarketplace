import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import DetailInfo from "./DetailInfo";
import { useSelector } from "react-redux";

export default function LabTabs(props) {
  const [value, setValue] = React.useState("1");
  const userProfile = useSelector((state) => state.profile);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            sx={{
              minHeight: "20px",
              ".MuiTabs-indicator": { backgroundColor: "#cbca03ba" },
            }}
          >
            <Tab
              label="COLLECTION DETAILS"
              value="1"
              sx={{
                color: "#c5c5c5",
                fontSize: "12px",
                minHeight: "20px",
                alignItems: "center",
                backgroundColor: "#b82ac5",
                borderTopLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                padding: "10px",
                margin: "5px",
                "&.Mui-selected": { color: "white" },
              }}
            />
            <Tab
              label="ABOUT AUTHOR"
              value="2"
              sx={{
                color: "#c5c5c5",
                fontSize: "12px",
                minHeight: "20px",
                backgroundColor: "#b82ac5",
                borderTopLeftRadius: "10px !important",
                borderBottomRightRadius: "10px !important",
                padding: "10px",
                margin: "5px",
                alignItems: "center",

                "&.Mui-selected": { color: "white" },
              }}
            />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ paddingLeft: "0px" }}>
          <DetailInfo
            url={props.metaData?.vidUrl}
            desc={props?.metaData?.description}
            userProfile={userProfile}
          />
        </TabPanel>
        <TabPanel value="2" sx={{ color: "white" }}>
          {userProfile?.bio}
        </TabPanel>
      </TabContext>
    </Box>
  );
}
