import React, { useEffect, useState } from "react";
import { Container, Button, Box } from "@mui/material";
import MClipboard from "../../components/MClipboard";
import { useWeb3React } from "@web3-react/core";
import "./MyProfile.scss";
import { setItem, deleteItem } from "../../utils/storage";
import { injected } from "../../wallet/connector";
import { Settings, DownloadForOffline, MoreHoriz } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProfileTab from "./ProfileTab";
import "dotenv/config";

const MyProfile = (props) => {
  const { active, account, activate } = useWeb3React();
  const [connectBtnTxt, setConnectBtnTxt] = useState("Connect");
  const [value, setValue] = React.useState("1");
  const userInfo = useSelector((state) => state.profile);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    const btnTxt = active
      ? `${String(account).substring(0, 6)}...${String(account).substring(38)}`
      : "Connect";
    setConnectBtnTxt(btnTxt);
  }, [active, false]);

  const connectWallet = async () => {
    try {
      await activate(injected);
      setItem("walletStatus", true);
    } catch (err) {
      console.log(err);
    }
  };

  const onEditProfile = () => {
    props.history.push("/edit-profile");
  };

  return (
    <Container maxWidth="xl" sx={{ marginTop: "100px" }}>
      <section className="profile-info-bar">
        <div className="profile-image">
          <img
            src={
              process.env.REACT_APP_BACKEND_URL + userInfo.avatar_url ||
              "/images/profile-images/profile-empty.png"
            }
          />
        </div>
        <div className="wallet-address">
          <MClipboard>
            {({ copy }) =>
              active ? (
                <Button
                  className="profile-connect-btn"
                  onClick={() => copy(account)}
                >
                  <span className="token-image">
                    <img src="/images/crypto-icons/brise.png" />
                  </span>
                  <span className="indicator connected"></span>
                  {connectBtnTxt}
                </Button>
              ) : (
                <Button className="profile-connect-btn" onClick={connectWallet}>
                  <span className="indicator not-connected"></span>
                  {connectBtnTxt}
                </Button>
              )
            }
          </MClipboard>
        </div>
        <div className="bio-text">
          <p>{userInfo.bio || ""}</p>
        </div>
        <div className="personal">
          <a
            href={`https://${userInfo.personalSite}`}
            target="_blank"
            style={{ color: "#999" }}
          >
            <b>@{userInfo.personalSite || ""}</b>
          </a>
        </div>
        <div className="following-bar">
          <label>
            <span className="count">0</span>
            <span className="static-string">followers</span>
          </label>
          <label>
            <span className="count">0</span>
            <span className="static-string">following</span>
          </label>
        </div>
        <div className="edit-profile">
          <Button className="edit-btn" onClick={onEditProfile}>
            <Settings />
            Edit Profile
          </Button>
          <IconButton sx={{ color: "#888", marginLeft: "15px" }}>
            <DownloadForOffline />
          </IconButton>
          <IconButton sx={{ color: "#888" }}>
            <MoreHoriz />
          </IconButton>
        </div>
      </section>
      <section className="tab-bar">
        <ProfileTab />
      </section>
    </Container>
  );
};

export default MyProfile;
