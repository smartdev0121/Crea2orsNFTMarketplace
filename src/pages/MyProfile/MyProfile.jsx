import React, { useEffect, useState } from "react";
import { Container, Button, Box } from "@mui/material";
import MClipboard from "../../components/MClipboard";
import { setItem, deleteItem, getItem } from "../../utils/storage";
import {
  Settings,
  DownloadForOffline,
  MoreHoriz,
  Edit,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ProfileTab from "./ProfileTab";
import MBorderButton from "src/components/MButtons/MBorderButton";
import Tooltip from "@material-ui/core/Tooltip";
import MImageCropper from "src/components/MImageCropper";
import { profileBackgroundUpdate } from "src/store/users/actions";
import { getUserInfo } from "../../store/users/actions";
import { getCurrentWalletAddress } from "src/utils/wallet";
import { connectedWallet, rejectConnectWallet } from "src/store/wallet/actions";
import { showNotify } from "src/utils/notify";
import "./MyProfile.scss";
import "dotenv/config";

const MyProfile = (props) => {
  const hiddenBackImageFile = React.useRef(null);
  const [connectBtnTxt, setConnectBtnTxt] = useState("Connect");
  const [resizedImage, setResizedImage] = useState(null);
  const [confirmedFile, setConfirmedFile] = useState(undefined);
  const [file, setFile] = useState(null);
  const [walletAddress, setWalletAddress] = useState(undefined);
  const [account, setAccount] = useState("");
  const [value, setValue] = useState("1");
  const userInfo = useSelector((state) => state.profile);
  const followInfo = useSelector((state) => state.users.userFollow);
  const active = useSelector((state) => state.wallet.active);
  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(async () => {
    let tempWalAddress = "Addr";
    if (active) {
      tempWalAddress = await getCurrentWalletAddress();
      setWalletAddress(tempWalAddress);
      if (!tempWalAddress) {
        dispatch(rejectConnectWallet());
        return;
      }
    }

    const btnTxt = active
      ? `Connected: ${String(tempWalAddress).substring(0, 6)}...${String(
          tempWalAddress
        ).substring(38)}`
      : "Connect";

    setConnectBtnTxt(btnTxt);
  }, [active, false]);

  const connectWallet = async () => {
    try {
      const curAddress = await getCurrentWalletAddress();
      if (curAddress) {
        dispatch(connectedWallet(curAddress));
      }
      setWalletAddress(curAddress);
    } catch (err) {
      console.log(err);
    }
  };

  const onImageClicked = () => {
    props.history.push("/edit-profile");
  };

  const onEditProfile = () => {
    props.history.push("/edit-profile");
  };

  const onBackgroundEdit = () => {
    hiddenBackImageFile.current.click();
  };

  const onInputBackImageChanged = (event) => {
    setFile(event.target.files[0]);
  };
  return (
    <Container maxWidth="xl" sx={{ marginTop: "100px" }}>
      <section className="profile-info-bar">
        <div
          style={{
            width: "100%",
            top: "-33px",
            position: "absolute",
            height: "200px",
            backgroundImage: `url(${process.env.REACT_APP_BACKEND_URL}${userInfo?.backgroundImageUrl})`,
            backgroundSize: "cover",
          }}
        >
          <div className="edit-part">
            <Tooltip title="Edit Background">
              <IconButton onClick={onBackgroundEdit}>
                <Edit
                  fontSize="large"
                  sx={{
                    backgroundColor: "#da4bfd",
                    borderRadius: "50%",
                    padding: "5px",
                    color: "white",
                  }}
                />
              </IconButton>
            </Tooltip>

            <input
              type="file"
              ref={hiddenBackImageFile}
              name="profile-back"
              id="profile-back"
              accept=".jpg, .png, .jpeg, .bmp"
              onChange={onInputBackImageChanged}
              className="file-input"
            />
            <MImageCropper
              file={file}
              onConfirm={(croppedFile) => {
                setResizedImage(window.URL.createObjectURL(croppedFile));
                setConfirmedFile(croppedFile);
                let data = new FormData();
                data.append("file_back", croppedFile);
                data.append("walletAddress", walletAddress);
                if (!walletAddress) {
                  showNotify(
                    "Wallet is not connected! Please connect wallet!",
                    "error"
                  );
                  return;
                }
                dispatch(profileBackgroundUpdate(data));
              }}
              onCompleted={() => setFile(null)}
            />
          </div>
        </div>

        <Tooltip title="Edit Profile">
          <Button className="profile-image" onClick={onImageClicked}>
            <img
              src={
                (userInfo?.avatar_url &&
                  process.env.REACT_APP_BACKEND_URL + userInfo?.avatar_url) ||
                "/images/profile-images/profile-empty.png"
              }
            />
          </Button>
        </Tooltip>

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
        <p className="nick_name">@{userInfo?.nickName}</p>
        <div className="bio-text">
          <p>{userInfo?.bio || ""}</p>
        </div>
        <div className="personal">
          <a
            href={`https://${userInfo?.personalSite}`}
            target="_blank"
            style={{ color: "#999" }}
          >
            <b>{userInfo?.personalSite || ""}</b>
          </a>
        </div>
        <div className="following-bar">
          <label>
            <span className="count">
              {Object.keys(followInfo?.followers).length}
            </span>
            <span className="static-string">followers</span>
          </label>
          <label>
            <span className="count">
              {Object.keys(followInfo?.followings).length}
            </span>
            <span className="static-string">following</span>
          </label>
        </div>
        <div className="edit-profile">
          <MBorderButton onClick={onEditProfile}>
            <Settings sx={{ fontSize: "16px" }} />
            &nbsp;Edit Profile
          </MBorderButton>
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
