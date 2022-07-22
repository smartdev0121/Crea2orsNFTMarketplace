import React from "react";
import { Box, Avatar, IconButton } from "@mui/material";
import MColorButton from "../../components/MInput/MColorButton";
import { ContentCopy, PlayArrow } from "@mui/icons-material";
import MClipboard from "src/components/MClipboard";

const DetailInfo = (props) => {
  return (
    <Box>
      <div className="image-part">
        {props.url && (
          <>
            {/* <video width="100%" height="100%" controls>
              <source src={props.url}></source>
            </video> */}
            <div>
              <iframe
                src={props.url}
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen
                width="100%"
                height="500px"
                title="video"
              />{" "}
            </div>
            <div className="creator-detail">
              <Avatar
                sx={{
                  borderRadius: "50% !important",
                  border: "1px solid #999",
                  width: "24px",
                  height: "24px",
                }}
                alt="Remy Sharp"
                src={
                  process.env.REACT_APP_BACKEND_URL +
                    props.userProfile?.avatar_url || "/images/avatar.png"
                }
              />
              &nbsp;{props.userProfile?.nickName}
            </div>
            <div className="content-copy">
              <MClipboard>
                {({ copy }) => (
                  <>
                    <IconButton
                      onClick={() => {
                        return copy(props?.url);
                      }}
                    >
                      <ContentCopy sx={{ color: "white" }} />
                    </IconButton>
                    <label>Copy link</label>
                  </>
                )}
              </MClipboard>
            </div>
            {/* <div className="watch-video">
              Watch on{" "}
              <IconButton type="button">
                <PlayArrow />
                Youtubu
              </IconButton>
            </div> */}
          </>
        )}
      </div>
      <p>{props?.desc}</p>
      <MColorButton>READ LESS</MColorButton>
    </Box>
  );
};

export default DetailInfo;
