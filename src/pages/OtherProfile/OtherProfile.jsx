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
import styled from "styled-components";
import { showNotify } from "../../utils/notify";
import { setItem, deleteItem } from "../../utils/storage";
import Tooltip from "@material-ui/core/Tooltip";
import {
  InsertEmoticon,
  MailOutline,
  DownloadForOffline,
  MoreHoriz,
  ContentCopy,
} from "@mui/icons-material";
import MBorderButton from "src/components/MButtons/MBorderButton";
import { useDispatch, useSelector } from "react-redux";
import ProfileTab from "./ProfileTab";
import { getOtherProfile, follow, unFollow } from "../../store/users/actions";
import { getCurrentWalletAddress } from "src/utils/wallet";
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
import ReportDialog from "../MyProfile/ReportDialog";
import { reportPage } from "src/store/profile/actions";
import "dotenv/config";
import "./OtherProfile.scss";

const OtherProfile = (props) => {
  const [connectBtnTxt, setConnectBtnTxt] = useState("Connect");
  const [active, setActive] = useState(false);
  const [value, setValue] = React.useState("1");
  const params = props?.match?.params;
  const profileStatus = useSelector((state) => state.users.status);
  const otherInfo = useSelector((state) => state.users.otherUserInfo);
  const profile = useSelector((state) => state.profile);
  const [popperOpen, setPopperOpen] = useState(false);
  const [popperOpen2, setPopperOPen2] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const followInfo = useSelector((state) => state.users.otherFollow);
  const [alreadyFollowed, setAlreadyFollowed] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(getOtherProfile(params.customUrl));
  }, []);

  useEffect(() => {
    for (let i = 0; i < followInfo.followers.length; i++) {
      if (followInfo.followers[i].follower_id === profile?.id) {
        setAlreadyFollowed(true);
        break;
      }
    }
  }, [followInfo]);

  const connectWallet = async () => {
    try {
      getCurrentWalletAddress();
      setItem("walletStatus", true);
    } catch (err) {
      console.log(err);
    }
  };

  const onFollow = () => {
    profile
      ? dispatch(follow(otherInfo.email))
      : showNotify("You can follow after sign-in.", "warning");
  };

  const onUnFollow = () => {
    profile
      ? dispatch(unFollow(otherInfo.email))
      : showNotify("You can unfollow after sign-in.", "warning");
    setAlreadyFollowed(false);
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
      {!profileStatus ? (
        <div className="no-profile">No one exists in our marketplace</div>
      ) : (
        <>
          <section className="profile-info-bar">
            <ReportDialog
              open={reportOpen}
              onClose={reportDlgClosed}
              onSubmit={onSubmit}
            />
            <div
              style={{
                width: "100%",
                top: "-33px",
                position: "absolute",
                height: "200px",
                backgroundImage: `url(${process.env.REACT_APP_BACKEND_URL}${otherInfo?.backgroundImageUrl})`,
                backgroundSize: "cover",
              }}
            ></div>

            <Tooltip title="Edit Profile">
              <Button className="profile-image">
                <img
                  src={
                    (otherInfo?.avatar_url &&
                      process.env.REACT_APP_BACKEND_URL +
                        otherInfo?.avatar_url) ||
                    "/images/profile-images/profile-empty.png"
                  }
                />
              </Button>
            </Tooltip>
            <p className="nick_name">@{otherInfo?.nickName}</p>

            <div className="bio-text">
              <p>{otherInfo?.bio || ""}</p>
            </div>
            <div className="personal">
              <a
                href={`https://${otherInfo?.personalSite}`}
                target="_blank"
                style={{ color: "#999" }}
              >
                <b>@{otherInfo?.personalSite || ""}</b>
              </a>
            </div>
            <div className="following-bar">
              <label>
                <span className="count">
                  {Object.keys(followInfo.followers).length}
                </span>
                <span className="static-string">followers</span>
              </label>
              <label>
                <span className="count">
                  {Object.keys(followInfo.followings).length}
                </span>
                <span className="static-string">following</span>
              </label>
            </div>
            <div className="edit-profile">
              {!alreadyFollowed ? (
                <MBorderButton className="edit-btn" onClick={onFollow}>
                  <InsertEmoticon sx={{ fontSize: "16px" }} />
                  &nbsp;Follow
                </MBorderButton>
              ) : (
                <MBorderButton className="edit-btn" onClick={onUnFollow}>
                  <InsertEmoticon sx={{ fontSize: "16px" }} />
                  &nbsp;Unfollow
                </MBorderButton>
              )}

              {/* <MBorderButton className="edit-btn" onClick={onFollow}>
                <MailOutline sx={{ fontSize: "16px" }} />
                &nbsp;Send Message
              </MBorderButton> */}
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
                              otherInfo?.customUrl
                            }
                            quote={""}
                          >
                            <FacebookIcon round size={32} />
                          </FacebookShareButton>
                          <TwitterShareButton
                            url={
                              process.env.REACT_APP_FRONT_URL +
                              "user/" +
                              otherInfo?.customUrl
                            }
                          >
                            <TwitterIcon round size={32} />
                          </TwitterShareButton>
                          <TelegramShareButton
                            url={
                              process.env.REACT_APP_FRONT_URL +
                              "user/" +
                              otherInfo?.customUrl
                            }
                          >
                            <TelegramIcon round size={32} />
                          </TelegramShareButton>
                          <EmailShareButton
                            url={
                              process.env.REACT_APP_FRONT_URL +
                              "user/" +
                              otherInfo?.customUrl
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
                                      otherInfo?.customUrl
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
          </section>
          <section className="tab-bar">
            <ProfileTab />
          </section>
        </>
      )}
    </Container>
  );
};

export default OtherProfile;

const InlineDiv = styled.div`
  display: inline-block;
`;
