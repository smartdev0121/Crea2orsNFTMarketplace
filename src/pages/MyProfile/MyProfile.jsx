import React, { useEffect, useState } from "react";
import { Container, Button } from "@mui/material";
import MClipboard from "../../components/MClipboard";
import { useWeb3React } from "@web3-react/core";
import "./MyProfile.scss";
import { setItem, deleteItem } from "../../utils/storage";
import { injected } from "../../wallet/connector";

const MyProfile = () => {
  const { active, account, activate } = useWeb3React();
  const [connectBtnTxt, setConnectBtnTxt] = useState("Connect");

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

  return (
    <Container maxWidth="xl" sx={{ marginTop: "100px" }}>
      <section className="profile-info-bar">
        <div className="profile-image">
          <img src="/images/profile-images/profile-empty.png" />
        </div>
        <div className="wallet-address">
          <MClipboard>
            {({ copy }) =>
              active ? (
                <Button
                  className="profile-connect-btn"
                  onClick={() => copy(account)}
                >
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
        <div className="following-bar"></div>
        <div className="edit-profile"></div>
      </section>
      <section className="tab-bar"></section>
    </Container>
  );
};

export default MyProfile;
