import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Box,
  Popper,
  Fade,
  Paper,
  IconButton,
  ClickAwayListener,
} from "@mui/material";
import MClipboard from "../../components/MClipboard";
import { setItem, deleteItem, getItem } from "../../utils/storage";
import {
  Settings,
  DownloadForOffline,
  MoreHoriz,
  Edit,
  Facebook,
  Twitter,
  Telegram,
  Email,
  ContentCopy,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import ProfileTab from "./ProfileTab";
import MBorderButton from "src/components/MButtons/MBorderButton";
import Tooltip from "@material-ui/core/Tooltip";
import MImageCropper from "src/components/MImageCropper";
import { profileBackgroundUpdate } from "src/store/users/actions";
import { getCurrentWalletAddress } from "src/utils/wallet";
import { connectedWallet, rejectConnectWallet } from "src/store/wallet/actions";
import { showNotify } from "src/utils/notify";
import {
  FacebookShareButton,
  EmailShareButton,
  TelegramShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
  TelegramIcon,
} from "react-share";
import ReportDialog from "./ReportDialog";
import { reportPage } from "src/store/profile/actions";
import SocialButtonsContainer from "react-social-media-buttons";
import "./MyProfile.scss";
import "dotenv/config";

const MyProfile = (props) => {
  console.log(props);
  const params = props?.match?.params;

  const hiddenBackImageFile = React.useRef(null);
  const [connectBtnTxt, setConnectBtnTxt] = useState("Connect");
  const [resizedImage, setResizedImage] = useState(null);
  const [confirmedFile, setConfirmedFile] = useState(undefined);
  const [file, setFile] = useState(null);
  const [walletAddress, setWalletAddress] = useState(undefined);
  const [account, setAccount] = useState("");
  const [value, setValue] = useState("1");
  const [popperOpen, setPopperOpen] = useState(false);
  const [popperOpen2, setPopperOPen2] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
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

  const handleClick = (type) => (eve) => {
    if (type == 1) {
      setPopperOpen(!popperOpen);
      setAnchorEl(eve.currentTarget);
    } else if (type == 2) {
      setPopperOPen2(!popperOpen2);
      setAnchorEl2(eve.currentTarget);
    }
  };

  const handleClickAway1 = (event) => {
    if (anchorEl?.current && anchorEl?.current.contains(event.target)) {
      return;
    }
    setPopperOpen(false);
  };

  const handleClickAway2 = (event) => {
    if (anchorEl2?.current && anchorEl2?.current.contains(event.target)) {
      return;
    }
    setPopperOPen2(false);
  };

  const reportBtnClicked = () => {
    setReportOpen(true);
  };

  const reportDlgClosed = () => {
    setReportOpen(false);
  };

  const onSubmit = (content) => {
    dispatch(reportPage(content, params.customUrl));
    setReportOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ marginTop: "100px" }}>
      <section className="profile-info-bar">
        <ReportDialog
          open={reportOpen}
          onClose={reportDlgClosed}
          onSubmit={onSubmit}
        />
        <div
          className="profile-background"
          style={{
            backgroundImage: `url(${process.env.REACT_APP_BACKEND_URL}${userInfo?.backgroundImageUrl})`,
          }}
        >
          <div className="edit-part">
            {!userInfo?.backgroundImage && (
              <p
                style={{
                  textAlign: "center",
                  color: "#c5c5c5 !important",
                  fontSize: "1.2rem",
                }}
              >
                We recommend that you use image with a ratio of 2.8
              </p>
            )}
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
              ratio="2.8"
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
                console.log(data);
                dispatch(profileBackgroundUpdate(data));
              }}
              onCompleted={() => setFile(null)}
            />
          </div>
        </div>

        <div className="profile-detail">
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
                  <Button
                    className="profile-connect-btn"
                    onClick={connectWallet}
                  >
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SocialButtonsContainer
              links={[
                `https://www.facebook.com/${userInfo?.facebook_username}`,
                `https://twitter.com/${userInfo?.twitter_username}`,
                `https://www.instagram.com/${userInfo?.instagram_username}`,
              ]}
              buttonStyle={{
                width: "46px",
                height: "46px",
                margin: "0px 10px",
                backgroundColor: "#969696",
                borderRadius: "30%",
              }}
              iconStyle={{ color: "#ffffff" }}
              openNewTab={true}
            />
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
            <ClickAwayListener onClickAway={handleClickAway1}>
              <InlineDiv>
                <IconButton
                  sx={{ color: "#888", marginLeft: "15px" }}
                  onClick={handleClick(1)}
                >
                  <DownloadForOffline />
                </IconButton>
                <Popper open={popperOpen} anchorEl={anchorEl} transition>
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeoout={350}>
                      <Paper sx={{ backgroundColor: "#141c38" }}>
                        <FacebookShareButton
                          url={
                            process.env.REACT_APP_FRONT_URL +
                            "user/" +
                            userInfo.customUrl
                          }
                          quote={""}
                        >
                          <FacebookIcon round size={32} />
                        </FacebookShareButton>
                        <TwitterShareButton
                          url={
                            process.env.REACT_APP_FRONT_URL +
                            "user/" +
                            userInfo.customUrl
                          }
                        >
                          <TwitterIcon round size={32} />
                        </TwitterShareButton>
                        <TelegramShareButton
                          url={
                            process.env.REACT_APP_FRONT_URL +
                            "user/" +
                            userInfo.customUrl
                          }
                        >
                          <TelegramIcon round size={32} />
                        </TelegramShareButton>
                        <EmailShareButton
                          url={
                            process.env.REACT_APP_FRONT_URL +
                            "user/" +
                            userInfo.customUrl
                          }
                        >
                          <EmailIcon round size={32} />
                        </EmailShareButton>
                        <MClipboard>
                          {({ copy }) => (
                            <IconButton
                              sx={{ color: "#888" }}
                              onClick={() =>
                                copy(
                                  process.env.REACT_APP_FRONT_URL +
                                    "user/" +
                                    userInfo.customUrl
                                )
                              }
                            >
                              <ContentCopy />
                            </IconButton>
                          )}
                        </MClipboard>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </InlineDiv>
            </ClickAwayListener>
            <ClickAwayListener onClickAway={handleClickAway2}>
              <InlineDiv>
                <IconButton sx={{ color: "#888" }} onClick={handleClick(2)}>
                  <MoreHoriz />
                </IconButton>
                <Popper anchorEl={anchorEl2} open={popperOpen2} transition>
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeoout={350}>
                      <Paper sx={{ backgroundColor: "#141c38" }}>
                        <Button
                          sx={{ color: "#888" }}
                          onClick={reportBtnClicked}
                        >
                          Report page
                        </Button>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </InlineDiv>
            </ClickAwayListener>
          </div>
        </div>
      </section>
      <section className="tab-bar">
        <ProfileTab history={props.history} />
      </section>
    </Container>
  );
};

export default MyProfile;

const InlineDiv = styled.div`
  display: inline-block;
`;
