import React, { useEffect, useState } from "react";
import { Container, Box, Stack, Button } from "@mui/material";
import MTextField from "../../components/MInput/MTextField";
import MColorButtonView from "../../components/MInput/MColorButtonView";
import { Form, Field } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { getSpinner } from "../../store/app/reducer";
import MSpinner from "../../components/MSpinner";
import InputAdornment from "@mui/material/InputAdornment";
import { Edit } from "@mui/icons-material";
import { getUserInfo, setUserInfo } from "../../store/users/actions";
import MImageCropper from "src/components/MImageCropper";
import { verify } from "src/store/auth/actions";
import "dotenv/config";
import "./EditProfile.scss";

const FileField = ({ name, ...props }) => (
  <Field name={name}>
    {({ input: { value, onChange, ...input } }) => (
      <input
        {...input}
        type="file"
        onChange={({ target }) => onChange(target.files)} // instead of the default target.value
        {...props}
      />
    )}
  </Field>
);

const EditProfile = (props) => {
  const dispatch = useDispatch();
  const [sidebarWidth, setSidebarWidth] = useState(undefined);
  const [file, setFile] = useState(null);
  const [sidebarTop, setSidebarTop] = useState(undefined);
  const [email, setEmail] = useState();
  const [boxBottom, setBoxBottom] = useState(undefined);
  const userInfo = useSelector((state) => state.users.userInfo);
  console.log("USeromf", userInfo);
  const hiddenFileInput = React.useRef(null);
  const [confirmedFile, setConfirmedFile] = useState(undefined);
  const [handled, setHandled] = useState(false);
  const [verified, setVerified] = useState("unverified");
  const [mailSent, setMailSent] = useState(false);
  const handleFileChange = (e) => {
    uploader(e);

    setFile(e.target.files[0]);
    !!e.target.files[0] ? setHandled(true) : setHandled(false);
  };

  const handleImageClick = () => {
    hiddenFileInput.current.click();
  };

  const useDisplayImage = () => {
    const [result, setResult] = useState("");

    const uploader = (e) => {
      const imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", (e) => {
        setResult(e.target.result);
      });

      reader.readAsDataURL(imageFile);
    };

    return { result, uploader };
  };

  useEffect(() => {
    const sidebarEl = document
      .querySelector(".sidebar")
      .getBoundingClientRect();

    setSidebarWidth(sidebarEl.width);
    setSidebarTop(sidebarEl.top);

    const boxEl = document
      .querySelector(".MuiBox-root")
      .getBoundingClientRect();
    setBoxBottom(boxEl.bottom);

    dispatch(getUserInfo(dispatch));
  }, []);

  useEffect(() => {
    if (!sidebarTop) return;
    userInfo.verified == 1
      ? setVerified("verified")
      : setVerified("unverified");
    window.addEventListener("scroll", isSticky);

    setEmail(userInfo.email);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  }, [sidebarTop, userInfo]);

  const isSticky = (e) => {
    const sidebarEl = document.querySelector(".sidebar");
    const scrollTop = window.scrollY;
    if (scrollTop >= sidebarTop - 10 && scrollTop < sidebarTop + 200) {
      sidebarEl.classList.add("is-sticky");
    } else {
      sidebarEl.classList.remove("is-sticky");
    }
  };

  const isSubmitting = useSelector((state) =>
    getSpinner(state, "get_user_info")
  );

  const onSubmit = (values) => {
    const data = new FormData();
    data.append("name", "Image Upload");
    data.append("nick_name", values.nickName);
    data.append("file_attachment", file);
    data.append("email", values.email);
    data.append("handled", handled);
    data.append("bio", values.bio);
    data.append("customUrl", values.customUrl);
    data.append("personalSite", values.personalSite);
    data.append("facebook_username", values.facebookUsername);
    data.append("twitter_username", values.twitterUsername);
    data.append("instagram_username", values.instagramName);
    dispatch(setUserInfo(data, props.history));
  };

  const onEmailChange = (eve) => {
    setEmail(eve.target.value);
  };

  const getVerify = () => {
    dispatch(verify(email));
    setMailSent(true);
  };

  const { result, uploader } = useDisplayImage();
  return (
    <Container maxWidth="md" sx={{ marginTop: "100px", marginBottom: "20px" }}>
      {isSubmitting && <MSpinner />}
      <Box
        sx={{
          p: 2,
          backgroundColor: "#36363666",
          padding: "20px",
        }}
      >
        <section className="header">
          <Edit
            fontSize="large"
            sx={{
              backgroundColor: "#da4bfd",
              borderRadius: "50%",
              padding: "5px",
              color: "white",
            }}
          />
          <h2>Edit Profile</h2>
          <p className="grey-txt">
            You can set preferred display name, create your branded profile URL
            and manage other personal settings
          </p>
        </section>
        <Form
          onSubmit={onSubmit}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "Email address is required!";
            }
            if (!values.password) {
              errors.password = "Password is required!";
            }
          }}
          render={({ handleSubmit, submitting, form, values, pristine }) => (
            <form onSubmit={handleSubmit} noValidate>
              <Stack direction="row" spacing={2}>
                <Stack className="input-part" spacing={2}>
                  <Field
                    type="text"
                    name="nickName"
                    label="Display name"
                    placeholder="Enter your display name"
                    InputLabelProps={{ shrink: true }}
                    initialValue={userInfo?.nickName || ""}
                    component={MTextField}
                    variant="standard"
                  />
                  <Field
                    type="text"
                    name="customUrl"
                    label="Custom URL"
                    placeholder="Enter your custom url"
                    InputLabelProps={{ shrink: true }}
                    initialValue={userInfo?.customUrl || ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          crea2ors.com/user/
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    component={MTextField}
                  />
                  <Field
                    type="text"
                    name="bio"
                    label="Bio"
                    placeholder="Tell about yourself in a few words"
                    InputLabelProps={{ shrink: true }}
                    multiline={true}
                    initialValue={userInfo?.bio || ""}
                    variant="standard"
                    component={MTextField}
                  />
                  <Field
                    type="text"
                    name="facebookUsername"
                    label="Facebook Username"
                    placeholder="Enter your name in Facebook"
                    helperText="Link Facebook account to gain more trust on the marketplace"
                    InputLabelProps={{ shrink: true }}
                    initialValue={userInfo?.facebook_username || ""}
                    multiline={true}
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">@</InputAdornment>
                      ),
                    }}
                    component={MTextField}
                  />
                  <Field
                    type="text"
                    name="twitterUsername"
                    label="Twitter Username"
                    placeholder="Enter your name in Twitter"
                    helperText="Link Twitter account to gain more trust on the marketplace"
                    InputLabelProps={{ shrink: true }}
                    initialValue={userInfo?.twitter_username || ""}
                    multiline={true}
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">@</InputAdornment>
                      ),
                    }}
                    component={MTextField}
                  />
                  <Field
                    type="text"
                    name="instagramName"
                    label="Instagram Username"
                    placeholder="Enter your name in Instagram"
                    helperText="Link Instagram account to gain more trust on the marketplace"
                    InputLabelProps={{ shrink: true }}
                    initialValue={userInfo?.instagram_username || ""}
                    multiline={true}
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">@</InputAdornment>
                      ),
                      endAdorment: (
                        <InputAdornment position="end">
                          <Button>Verify</Button>
                        </InputAdornment>
                      ),
                    }}
                    component={MTextField}
                  />
                  <Field
                    type="text"
                    name="personalSite"
                    label="Personal Site or Portfolio"
                    InputLabelProps={{ shrink: true }}
                    variant="standard"
                    initialValue={userInfo?.personalSite || ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          https://
                        </InputAdornment>
                      ),
                    }}
                    component={MTextField}
                  />
                  {/* <Field
                    type="email"
                    name="email"
                    label="Email"
                    onChange={onEmailChange}
                    initialValue={email == "null" ? "" : email}
                    variant="standard"
                    placeholder="Enter your email address"
                    InputLabelProps={{ shrink: true }}
                    component={MTextField}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {verified}
                        </InputAdornment>
                      ),
                    }}
                  /> */}
                  {/* <section className="veri-part">
                    <div>
                      <h3>Verification</h3>
                      <p className="grey-txt">
                        Proceed with verification proceed to get more visibility
                        and gain trust on our Marketplace. Please allow up to
                        several weeks for the process
                      </p>
                    </div>

                    <div>
                      <Button className="blue-btn" onClick={getVerify}>
                        {mailSent ? "Resend" : "Get verified"}
                      </Button>
                    </div>
                  </section> */}

                  <MColorButtonView type="submit" disabled={submitting}>
                    Update Profile
                  </MColorButtonView>
                </Stack>
                <div className="sticky-container">
                  <div className="sidebar" style={{ maxWidth: sidebarWidth }}>
                    <input
                      type="file"
                      ref={hiddenFileInput}
                      name="avatar"
                      id="image-file"
                      accept=".jpg, .png, .jpeg, .bmp, .gif"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    {/* <MImageCropper
                      file={file}
                      onConfirm={(croppedFile) => {
                        setResizedImage(
                          window.URL.createObjectURL(croppedFile)
                        );

                        setConfirmedFile(croppedFile);
                      }}
                      onCompleted={() => setFile(null)}
                    /> */}
                    <div className="profile-image" onClick={handleImageClick}>
                      <img
                        src={
                          result ||
                          (userInfo.avatar_url
                            ? process.env.REACT_APP_BACKEND_URL +
                              userInfo.avatar_url
                            : "/images/profile-images/profile-empty.png")
                        }
                      />
                    </div>
                    <p>
                      We recommend an image of at least 300X300. Gifs work too.
                      Max 5mb
                    </p>
                    <Button className="blue-btn" onClick={handleImageClick}>
                      Choose File
                    </Button>
                  </div>
                </div>
              </Stack>
            </form>
          )}
        ></Form>
      </Box>
    </Container>
  );
};

export default EditProfile;
