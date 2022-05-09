import React from "react";
import {
  Box,
  Container,
  Switch,
  Stack,
  ToggleButton,
  TextField,
  FormControl,
  Button,
  IconButton,
  Input,
  InputLabel,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { Form, Field } from "react-final-form";
import { styled } from "@mui/material/styles";
import { CONTRACT_TYPE } from "src/config/global";
import MFileInput from "../../components/MInput/MFileInput";
import {
  LocalOffer,
  AllInclusive,
  DeleteForever,
  Add,
  Public,
  HelpOutline,
} from "@mui/icons-material";
import MTextField from "../../components/MInput/MTextField";
import MColorButtonView from "../../components/MInput/MColorButtonView";
import MSpinner from "src/components/MSpinner";
import { MPanButton } from "../../components/MButtons/MPanButton";
import { useDispatch, useSelector } from "react-redux";
import { showNotify } from "src/utils/notify";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { showSpinner, hideSpinner } from "src/store/app/actions";
import { getSpinner } from "src/store/app/reducer";
import { saveNFT } from "src/store/contract/actions";
import { mintAsset, holdEvent, getValuefromEvent } from "src/utils/contract";
import { getCurrentWalletAddress } from "../../utils/wallet";
import "./CreateNFTPage.scss";

const CustomButton = styled(Button)((theme) => ({
  color: "#e0dfff",
  background: "#394dd966",
  borderRadius: "20px",
  textTransform: "none",
  padding: "7px 30px",
  "&:hover": {
    backgroundColor: "#394dd999",
  },
}));

const HideButton = styled(Button)((theme) => ({
  color: "#e0dfff",
  background: "transparent",
  borderRadius: "20px",
  textTransform: "none",
  border: "1px solid #5c5c5c",
  "&:hover": {
    backgroundColor: "#394dd999",
  },
  "&:active": {
    borderColor: "#394dd999",
  },
}));

const UnsavedButton = styled(Button)((theme) => ({
  color: "#e0dfff",
  background: "transparent",
  textTransform: "none",
  border: "none",
  "&:hover": {
    backgroundColor: "#394dd999",
  },
  "&:active": {
    borderColor: "#394dd999",
  },
}));

export default function CreateNFTPage(props) {
  const { contractAddress, contractId } = props.match.params;
  const [file, setFile] = React.useState(null);
  const [formInitialValues, setFormInitialValues] = React.useState({});
  const [result, setResult] = React.useState(null);
  const [saleStatus, setSaleStatus] = React.useState(true);
  const [value, setValue] = React.useState(new Date());
  const [show, setShow] = React.useState(false);
  const [property, setProperty] = React.useState([0]);
  const hiddenFileInput = React.useRef(null);
  const dispatch = useDispatch();
  const isMinting = useSelector((state) => getSpinner(state, "NFT_MINTING"));

  const useDisplayImage = () => {
    const uploader = (e) => {
      const imageFile = e.target.files[0];
      const reader = new FileReader();

      reader.addEventListener("load", (e) => {
        setResult(e.target.result);
      });

      reader.readAsDataURL(imageFile);
    };
    return { uploader };
  };

  const { uploader } = useDisplayImage();

  const onFileChanged = (e) => {
    uploader(e);
    setFile(e.target.files[0]);
  };

  const onUploadClicked = () => {
    hiddenFileInput.current.click();
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
  };

  const addProperty = () => {
    let newPropArray = [...property];
    newPropArray.push(Number(property.length));
    setProperty(newPropArray);
  };

  const onSubmit = async (values) => {
    let traits = [];

    traits = property.map((item) => {
      return {
        [`propName_${item}`]: values[`propName_${item}`],
        [`propValue_${item}`]: values[`propValue_${item}`],
      };
    });

    let metaData = {
      name: values.name,
      description: values.description,
      batchSize: values.batchSize,
      alterText: values.alternativeText,
      royaltyFee: values.royaltyFee,
      file: file,
      traits,
    };

    try {
      dispatch(showSpinner("NFT_MINTING"));

      const { metaDataUri, fileUri } = await mintAsset(
        CONTRACT_TYPE.ERC1155,
        contractAddress,
        metaData
      );

      const event = await holdEvent("TransferSingle", contractAddress);
      const curWalletAddress = await getCurrentWalletAddress();
      const returnValues = await getValuefromEvent(event, curWalletAddress);
      console.log(returnValues.id);

      if (metaDataUri) {
        showNotify("NFT is minted successfully!");
        dispatch(
          saveNFT(
            contractId,
            metaData,
            metaDataUri,
            fileUri,
            props.history,
            returnValues.id
          )
        );
        setFormInitialValues({});
      } else {
        showNotify("Error is occured on minting!", "error");
      }

      dispatch(hideSpinner("NFT_MINTING"));
    } catch (err) {
      showNotify(
        "You can't mint your nft by some issue, confirm input values and try again!",
        "error"
      );
      dispatch(hideSpinner("NFT_MINTING"));
    }
  };
  return (
    <div className="whole-container">
      {isMinting && <MSpinner />}
      <Container
        maxWidth="md"
        sx={{ paddingTop: "100px", paddingBottom: "20px" }}
      >
        <div className="title">
          <h1>Create NFT-Collectible 1</h1>
        </div>
        <Form
          onSubmit={onSubmit}
          initialValues={formInitialValues}
          validate={(values) => {
            const errors = {};
          }}
          render={({ handleSubmit, submitting, form, values, pristine }) => {
            return (
              <form onSubmit={handleSubmit} noValidate>
                <Stack direction="row" sx={{ flexWrap: "wrap" }}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#00000075",
                    }}
                  >
                    <label className="subtitle">Upload file</label>

                    <div className="file-upload-part">
                      {result && (
                        <IconButton className="delete-btn" onClick={removeFile}>
                          <DeleteForever sx={{ color: "white" }} />
                        </IconButton>
                      )}

                      <input
                        type="file"
                        hidden
                        ref={hiddenFileInput}
                        id="media_file"
                        onChange={onFileChanged}
                        accept=".PNG, .GIF, .WEBP, .MP4, .MP3, .jpg, .jpeg"
                      />
                      {result ? (
                        <img src={result || ""} className="viewport" />
                      ) : (
                        <>
                          <h6 className="grey-txt multi-txt">
                            PNG, GIF, WEBP, MP4 or MP3. Max: 100MB
                          </h6>
                          <CustomButton onClick={onUploadClicked}>
                            Upload a File
                          </CustomButton>
                        </>
                      )}
                    </div>
                    <div>
                      <Field
                        type="text"
                        label="Name"
                        name="name"
                        placeholder='e.g. "Redeemable T-Shirt with logo"'
                        component={MTextField}
                      />

                      <Field
                        name="description"
                        type="text"
                        label="Description"
                        placeholder='e.g. "After purchasing you will be able to get the real T-shirt"'
                        component={MTextField}
                        multiline
                      />
                    </div>

                    <Stack direction="row">
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, mt: 3, width: "25ch", flex: "1 1" }}
                      >
                        <Field
                          name="royaltyFee"
                          label="Royalties"
                          inputProps={{
                            min: 0,
                            max: 50,
                            type: "number",
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                          component={MTextField}
                        />

                        <FormHelperText
                          id="standard-weight-helper-text"
                          className="grey-txt"
                        >
                          Suggested: 0%, 10%, 20%, 30%<br></br>
                          Maximum is 50%
                        </FormHelperText>
                      </FormControl>

                      <FormControl
                        variant="standard"
                        sx={{ m: 1, mt: 3, width: "25ch", flex: "1 1" }}
                      >
                        <Field
                          type="number"
                          name="batchSize"
                          label="Number of copies"
                          placeholder="e.g. M"
                          inputProps={{
                            min: 1,
                            type: "number",
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          component={MTextField}
                        />
                        <FormHelperText
                          className="grey-txt"
                          id="standard-weight-helper-text"
                        >
                          Amount of tokens
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                    <div className="hide-btn-part">
                      <HideButton
                        onClick={() => {
                          setShow(!show);
                        }}
                      >
                        {!show ? "Show" : "Hide"} advanced settings
                      </HideButton>
                    </div>
                    {show && (
                      <>
                        <div className="property">
                          <label className="subtitle">
                            Properties <span>(Optional)</span>
                          </label>
                          <IconButton
                            sx={{ border: "1px solid #999", padding: "5px" }}
                            onClick={addProperty}
                          >
                            <Add sx={{ color: "white" }} />
                          </IconButton>
                          {property.map((item) => {
                            return (
                              <Stack
                                direction="row"
                                spacing={3}
                                key={"property" + item}
                              >
                                <Field
                                  name={`propName_${item}`}
                                  component={MTextField}
                                  placeholder="e.g.Size"
                                  label="Prop name"
                                  InputLabelProps={{ shrink: true }}
                                />
                                <Field
                                  name={`propValue_${item}`}
                                  component={MTextField}
                                  placeholder="e.g.M"
                                  label="Prop value"
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Stack>
                            );
                          })}
                        </div>
                        <div>
                          <Field
                            name="alternativeText"
                            label="Alternative text(Optional)"
                            component={MTextField}
                            placeholder='Image description in details (do not start with word "image"'
                            multiline
                          />
                          <FormHelperText
                            id="component-helper-text"
                            className="grey-txt"
                          >
                            Text that will be used in VoiceOver for people with
                            disabilities
                          </FormHelperText>
                        </div>
                      </>
                    )}

                    <div className="create-item-part">
                      <MColorButtonView type="submit">
                        Create Item
                      </MColorButtonView>
                      <UnsavedButton>
                        Unsaved changes
                        <HelpOutline />
                      </UnsavedButton>
                    </div>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#00000075",
                    }}
                  >
                    <div className="preview-part">
                      {result ? (
                        <img src={result || ""} className="viewport" />
                      ) : (
                        <h6 className="grey-txt">
                          Upload file to preview your brand new NFT
                        </h6>
                      )}
                    </div>
                  </Box>
                </Stack>
              </form>
            );
          }}
        />
      </Container>
    </div>
  );
}
