import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import Button from "@mui/material/Button";
import MProfile from "src/components/MProfile";

import {
  FaHome,
  FaCuttlefish,
  FaArtstation,
  FaImages,
  FaLayerGroup,
} from "react-icons/fa";

import networks from "src/config/network";
import web3Modal, {
  showWeb3WalletModal,
  disconnectWallet,
  getCurrentWalletAddress,
  switchNetwork,
  getCurrentNetworkId,
  getCachedProvider,
} from "src/utils/wallet";
import { useSelector } from "react-redux";
import MSearch from "src/components/MSearch";
import { useDispatch } from "react-redux";
import { logout } from "../../store/auth/actions";
import { apiGetAccountInfo } from "src/utils/api";
import MClipboard from "../../components/MClipboard";
import { setItem, deleteItem } from "../../utils/storage";
import { connectedWallet, rejectConnectWallet } from "src/store/wallet/actions";
import "./HeaderContent.scss";

const HeaderContent = () => {
  const [connectedStatus, setConnectedStatus] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(1);
  const [connectBtnTxt, setConnectBtnTxt] = useState("Connect");
  const active = useSelector((state) => state.wallet.active);

  const [menuOpened, setMenuOpened] = useState(false);
  const [whitelisted, setWhitelisted] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const dispatch = useDispatch();
  const toggleMenu = () => {
    alert();
    setMenuOpened(!menuOpened);
  };

  const connectWallet = async () => {
    try {
      await showWeb3WalletModal();
      const curAddress = await getCurrentWalletAddress();
      if (curAddress) {
        dispatch(connectedWallet(curAddress));
      }
      setWalletAddress(curAddress);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSwitchNetwork = async (value) => {
    if (connectedStatus) {
      const res = await switchNetwork(value);
      if (res) {
        setCurrentNetwork(value);
      }
    } else {
      setCurrentNetwork(value);
    }
  };

  const handleMenuClicked = (e) => {
    if (e.target.localName !== "a") {
      return;
    }
    setMenuOpened(true);
  };

  useEffect(async () => {
    let tempWalAddress = "Addr";
    if (active) {
      tempWalAddress = await getCurrentWalletAddress();
      if (!tempWalAddress) {
        dispatch(rejectConnectWallet());
        return;
      }
      setWalletAddress(tempWalAddress);
    }

    const btnTxt = active
      ? `Connected: ${String(tempWalAddress).substring(0, 6)}...${String(
          tempWalAddress
        ).substring(38)}`
      : "Connect";

    setConnectBtnTxt(btnTxt);
  }, [active]);

  const onLogout = () => {
    dispatch(logout());
  };

  const onDisconnect = async () => {
    try {
      await disconnectWallet();
      deleteItem("walletStatus");
      dispatch(rejectConnectWallet());
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <section className="header-content">
      <div className="desktop-header">
        <div className="logo">
          <a href="/">
            <img src="/logo-icon.svg" alt="logo-icon" className="logo-icon" />
          </a>
        </div>

        <div className="search-bar">
          <MSearch />
        </div>

        <div className="links">
          <Link to="/#" className="header-item">
            MARKET
          </Link>
          <Link className="header-item" to="/create-collection">
            REDEEM
          </Link>
          <Link to="/#" className="header-item">
            ABOUT
          </Link>
          <Link to="/#" className="header-item">
            HELP
          </Link>
        </div>

        <div className="wallet-connect">
          <MClipboard>
            {({ copy }) =>
              active ? (
                <Button
                  className="btn btn-primary connect-btn"
                  onClick={() => copy(walletAddress)}
                >
                  <span className="indicator connected"></span>
                  {connectBtnTxt}
                </Button>
              ) : (
                <Button
                  className="btn btn-primary connect-btn"
                  onClick={connectWallet}
                >
                  <span className="indicator not-connected"></span>
                  {"Connect"}
                </Button>
              )
            }
          </MClipboard>
        </div>
        {active && <MProfile onLogout={onLogout} onDisconnect={onDisconnect} />}
      </div>

      <div className="mobile-header">
        <div className="logo">
          <a href="/">
            <img src="/logo-icon.svg" alt="logo-icon" className="logo-icon" />
          </a>
        </div>

        <div className="mobile-menu-button" onClick={toggleMenu}>
          <span />
          <span />
          <span />
        </div>

        <div className={`mobile-menu-wrap ${menuOpened && "opened"}`}>
          <div className="wallet-connect">
            <select
              onChange={(e) => handleSwitchNetwork(e.target.value)}
              value={currentNetwork}
            >
              {Object.keys(networks).map((networkId) => (
                <option value={networkId} key={`network_option${networkId}`}>
                  {networks[networkId].chainName}
                </option>
              ))}
            </select>

            <button type="primary" onClick={connectWallet}>
              {connectBtnTxt}
            </button>
          </div>

          <ProSidebar>
            <Menu iconShape="square" onClick={handleMenuClicked}>
              <MenuItem icon={<FaHome />}>
                Home <Link to="/" />
              </MenuItem>
              {whitelisted && (
                <>
                  <MenuItem icon={<FaCuttlefish />}>
                    Create a Collection <Link to="/create-collection" />
                  </MenuItem>
                  <MenuItem icon={<FaArtstation />}>
                    Batch Transfer NFTs <Link to="/batch-transfer" />
                  </MenuItem>
                </>
              )}
              <SubMenu title="Collections" icon={<FaLayerGroup />}>
                <MenuItem>
                  All Collections <Link to="/explore-collections" />
                </MenuItem>
                <MenuItem>
                  My Collections <Link to="/collections" />
                </MenuItem>
              </SubMenu>

              <SubMenu title="NFTs" icon={<FaImages />}>
                <MenuItem>
                  All NFTs <Link to="/explore-assets" />
                </MenuItem>

                <MenuItem>
                  My NFTs <Link to="/assets" />
                </MenuItem>
              </SubMenu>
            </Menu>
          </ProSidebar>
        </div>
      </div>
    </section>
  );
};

export default HeaderContent;
