import React, { useEffect } from "react";
import {
  Box,
  Container,
  Switch,
  Stack,
  FormControl,
  Button,
  IconButton,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { Form, Field } from "react-final-form";
import { DeleteForever, Add, HelpOutline } from "@mui/icons-material";
import MTextField from "../../components/MInput/MTextField";
import MColorButtonView from "../../components/MInput/MColorButtonView";
import MSpinner from "src/components/MSpinner";
import { useDispatch, useSelector } from "react-redux";
import { showNotify } from "src/utils/notify";
import { getSpinner } from "src/store/app/reducer";
import { saveNFT, getContractUri } from "src/store/contract/actions";
import { createNFT, createVoucher } from "src/utils/contract";
import { getCurrentWalletAddress } from "../../utils/wallet";
import styled from "styled-components";
import { formValidation } from "./form-validation";
import { progressDisplay } from "src/utils/pleaseWait";
import { userStatus } from "src/store/profile/reducer";

import "./CreateNFTPage.scss";
import MScrollToTop from "src/components/MScrollToTop";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CreateNFTPage(props) {
  const newCollectionInfo = useSelector(
    (state) => state.contract.collectionInfo
  );
  const isLoading = useSelector((state) => getSpinner(state, "SAVING_NFT"));
  console.log("LOADING", isLoading);
  const { contractAddress, contractId } = props.match.params;
  const [file, setFile] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const [show, setShow] = React.useState(false);
  const [property, setProperty] = React.useState([0]);
  const [isPut, setIsPut] = React.useState(true);
  const [nftNumber, setNftNumber] = React.useState(1);
  const hiddenFileInput = React.useRef(null);
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(getContractUri(contractAddress));
  }, []);

  useEffect(() => {
    setNftNumber(newCollectionInfo?.nfts?.length + 1);
  }, [newCollectionInfo]);

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

  const onPutonChange = (e) => {
    setIsPut(e.target.checked);
  };

  const onSubmit = async (values) => {
    if (newCollectionInfo.tokenLimit <= newCollectionInfo.nfts.length) {
      showNotify("Congratulation!. You created all NFTs of your collection.");
      props.history.push("/");
      return;
    }

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
    let loading_screen;
    try {
      loading_screen = progressDisplay("Signing NFT metadata...");

      const { metaDataUri, fileUri } = await createNFT(metaData);

      // const event = await holdEvent("TransferSingle", contractAddress);
      const curWalletAddress = await getCurrentWalletAddress();
      // const returnValues = await getValuefromEvent(event, curWalletAddress);
      const signature = await createVoucher(
        metaDataUri,
        values.royaltyFee,
        values.batchSize,
        curWalletAddress
      );

      if (metaDataUri) {
        showNotify("NFT is created successfully!");
        dispatch(
          saveNFT(
            contractId,
            metaData,
            metaDataUri,
            fileUri,
            values?.price ? values.price : -1,
            signature,
            curWalletAddress,
            contractAddress
          )
        );

        if (newCollectionInfo.tokenLimit <= newCollectionInfo.nfts.length + 1) {
          showNotify(
            "Congratulation!. You created all NFTs of your collection."
          );
          props.history.push("/");
          loading_screen?.finish();
          setResult(undefined);
          setFile(null);
          return;
        }
      } else {
        showNotify("Error is occured on minting!", "error");
      }

      loading_screen?.finish();
      setResult(undefined);
      setFile(null);
    } catch (err) {
      console.log(err);
      showNotify(
        "You can't mint your nft by some issue, confirm input values and try again!",
        "error"
      );
      loading_screen?.finish();
      setResult(undefined);
      setFile(null);
    }
  };
  return (
    <div className="whole-container">
      {isLoading && <MSpinner />}
      <MScrollToTop history={props.history} />
      <Container
        maxWidth="md"
        sx={{ paddingTop: "100px", paddingBottom: "20px" }}
      >
        <MBox>
          <div className="title">
            <h1 className="text">Create NFT-Collectible {nftNumber}</h1>
          </div>
          <Form
            onSubmit={onSubmit}
            validate={(values) => formValidation.validateForm(values)}
            render={({ handleSubmit, reset, form, values }) => {
              return (
                <form
                  onSubmit={async (event) => {
                    const error = await handleSubmit(event);
                    console.log("Form submit error", error);
                    if (error) return error;
                    form.reset();
                  }}
                >
                  <MFlexBox
                    direction="row"
                    sx={{ flexWrap: "wrap" }}
                    spacing={2}
                  >
                    <Box>
                      <label className="subtitle">Upload file</label>

                      <div className="file-upload-part">
                        {result && (
                          <IconButton
                            className="delete-btn"
                            onClick={removeFile}
                          >
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
                          <div>
                            {String(file?.type).split("/")[0] == "image" && (
                              <img src={result || ""} className="viewport" />
                            )}
                            {String(file?.type).split("/")[0] == "video" && (
                              <video width="600" controls className="viewport">
                                <source src={URL.createObjectURL(file)} />
                              </video>
                            )}
                          </div>
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
                      <div className="put-on">
                        <label>Put on marketplace</label>
                        <Switch
                          onChange={onPutonChange}
                          defaultChecked={true}
                        ></Switch>
                      </div>
                      <div>
                        {isPut && (
                          <Field
                            type="number"
                            label="Price"
                            name="price"
                            placeholder="Price on marketplace"
                            component={MTextField}
                            inputProps={{
                              min: 0,
                              type: "number",
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  CR2
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
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
                                <InputAdornment position="end">
                                  %
                                </InputAdornment>
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
                              Text that will be used in VoiceOver for people
                              with disabilities
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
                    <Box>
                      <div className="preview-part">
                        {result ? (
                          <div>
                            {String(file?.type).split("/")[0] == "image" && (
                              <img src={result || ""} className="viewport" />
                            )}
                            {String(file?.type).split("/")[0] == "video" && (
                              <video width="600" controls className="viewport">
                                <source src={URL.createObjectURL(file)} />
                              </video>
                            )}
                          </div>
                        ) : (
                          <h6 className="grey-txt">
                            Upload file to preview your brand new NFT
                          </h6>
                        )}
                      </div>
                    </Box>
                  </MFlexBox>
                </form>
              );
            }}
          />
        </MBox>
      </Container>
    </div>
  );
}

const CustomButton = styled(Button)`
  color: #e0dfff !important;
  background: #394dd966 !important;
  border-radius: 20px !important;
  text-transform: none !important;
  padding: 7px 30px !important;
  &:hover: {
    background-color: #394dd999 !important;
  }
`;

const HideButton = styled(Button)`
  color: #e0dfff !important;
  background: transparent !important;
  border-radius: 20px !important;
  text-transform: none !important;
  border: 1px solid #5c5c5c !important;
  &:hover: {
    background-color: #394dd999 !important;
  }
  &:active: {
    border-color: #394dd999 !important;
  }
`;

const UnsavedButton = styled(Button)`
  color: #e0dfff !important;
  background: transparent !important;
  text-transform: none !important;
  border: none !important;
  &:hover: {
    background-color: #394dd999 !important;
  }
  &:active: {
    border-color: #394dd999;
  }
`;

const MBox = styled(Box)`
  border-radius: 10px;
  border: 1px solid #333;
  background-color: #23263066;
  padding: 15px;
`;

const MFlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;
