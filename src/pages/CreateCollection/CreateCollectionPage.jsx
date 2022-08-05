import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { marketplace_contract_address } from "src/config/contracts";
import {
  deployContract,
  holdEvent,
  addCollection2Manager,
} from "src/utils/contract";
import {
  Button,
  Box,
  Container,
  Stack,
  Divider,
  Checkbox,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import MTextField from "src/components/MInput/MTextField";
import MSelectBox from "src/components/MInput/MSelectBox";
import InputAdornment from "@mui/material/InputAdornment";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import { styled } from "@mui/system";
import MColorButtonView from "src/components/MInput/MColorButtonView";
import { Form, Field } from "react-final-form";
import MImageCropper from "src/components/MImageCropper";
import { showNotify } from "src/utils/notify";
import {
  saveCollection,
  submitCollectionPreview,
} from "../../store/contract/actions";
import { formValidation } from "./form-validation";
import { progressDisplay } from "src/utils/pleaseWait";
import { userStatus } from "src/store/profile/reducer";
import "./CreateCollectionPage.scss";
import "dotenv/config";
import MScrollToTop from "src/components/MScrollToTop";

const CreateCollectionPage = (props) => {
  console.log(props);
  const collectionPreview = useSelector(
    (state) => state.contract.collectionPreview
  );

  const [inputValues, setInputValues] = useState(
    collectionPreview || {
      collectionName: "",
      symbol: "",
      description: "",
      vidUrl: "",
      intro: "",
      type: "",
      subCategory: "",
      tokenLimit: "",
      image: "",
    }
  );

  const [vidStatus, setVidStatus] = useState(false);
  const hiddenFileInput = React.useRef(null);
  const [type, setType] = useState(1);
  const [file, setFile] = useState(null);
  const status = useSelector((state) => userStatus(state));

  const categories = useSelector((state) => state.contract.categories);
  const dispatch = useDispatch();
  const [result, setResult] = React.useState("");

  useEffect(() => {
    setType(collectionPreview ? collectionPreview.type : 1);
    setResult(collectionPreview ? collectionPreview.image : null);
    setFile(collectionPreview ? collectionPreview.file : null);
  }, []);

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

  const handleInputChange = (e) => {
    setInputValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    uploader(e);
    e ? setFile(e.target.files[0]) : setFile(null);
  };

  const handleImageClick = (e) => {
    hiddenFileInput.current.click();
  };

  const handleCheckboxChange = (e) => {
    setVidStatus(e.target.checked);
  };

  const onPreview = () => {
    const newCollectionInfo = {
      ...inputValues,
      type: type,
      image: result,
      file: file,
    };
    console.log("before preview", newCollectionInfo);
    dispatch(submitCollectionPreview(newCollectionInfo));
    props.history.push("/collection-preview");
  };

  const onSubmit = async (values) => {
    let register_wait;
    let deploy_wait = progressDisplay("Deploying collection...");

    const metadata = {
      name: values.collectionName,
      symbol: values.symbol,
      description: values.description,
      videoUrl: values.vidUrl,
      highLight: values.intro,
      category: type,
      subCategory: values.subCategory,
      tokenLimit: values.tokenLimit,
      file: file,
    };
    try {
      const { contractAddress, contractUri, imageUri } = await deployContract(
        0,
        metadata
      );

      deploy_wait?.finish();

      register_wait = progressDisplay("Registering collection ...");

      const result = await addCollection2Manager(
        marketplace_contract_address[process.env.REACT_APP_CUR_CHAIN_ID],
        contractAddress
      );

      if (!result) {
        showNotify("Sorry, We can't add your collection", "error");
      }

      register_wait?.finish();

      const events = await holdEvent("ContractDeployed", contractAddress);
      dispatch(
        saveCollection(
          contractUri,
          contractAddress,
          metadata,
          imageUri,
          props.history
        )
      );
      showNotify(`Collection is successfully created: ${contractAddress}`);
      deploy_wait?.finish();
      register_wait?.finish();
    } catch (err) {
      console.log(err);
      showNotify(`Unfortunately, error occurred`, "error");
      deploy_wait?.finish();
      register_wait?.finish();
    }
  };

  const valueChanged = (value) => {
    setType(value);
  };

  const onDiscard = (file) => {
    setFile(null);
  };

  return (
    <div className="whole-container">
      <MScrollToTop history={props.history} />
      <Container
        maxWidth="md"
        sx={{ paddingTop: "100px", paddingBottom: "20px" }}
      >
        <Box
          sx={{
            p: 2,
            padding: "16px",
            border: "1px solid #363636",
            backgroundColor: "#2c2c2c61",
            borderRadius: "10px",
          }}
        >
          <h4 level={4} className="create-nft-title">
            Create a New NFT Collection
          </h4>
          <Form
            onSubmit={onSubmit}
            validate={(values) => formValidation.validateForm(values)}
            render={({ handleSubmit, submitting, form, values, pristine }) => {
              return (
                <form onSubmit={handleSubmit} noValidate>
                  <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={2}
                    justifyContent="space-around"
                  >
                    <Stack
                      className="create-collection-card"
                      spacing={1}
                      flex="1 1"
                    >
                      <Field
                        type="text"
                        name="collectionName"
                        label="Collection name"
                        component={MTextField}
                        autoComplete="off"
                        onChange={handleInputChange}
                        initialValue={inputValues.collectionName}
                        variant="outlined"
                      />

                      <Field
                        type="text"
                        name="symbol"
                        label="Symbol"
                        onChange={handleInputChange}
                        initialValue={inputValues.symbol}
                        component={MTextField}
                        variant="outlined"
                      />

                      <Field
                        type="text"
                        name="intro"
                        multiline
                        label="Highlight Intro"
                        onChange={handleInputChange}
                        initialValue={inputValues.intro}
                        component={MTextField}
                        variant="outlined"
                      />

                      <Field
                        type="text"
                        placeholder="Description"
                        label="Collection details and information"
                        name="description"
                        onChange={handleInputChange}
                        initialValue={inputValues.description}
                        component={MTextField}
                        variant="outlined"
                        multiline
                      />
                      <Stack direction="row" alignItems="center">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={vidStatus}
                              onChange={handleCheckboxChange}
                            />
                          }
                          label="Add video"
                        />
                        <Field
                          type="text"
                          label="URL"
                          onChange={handleInputChange}
                          initialValue={inputValues.vidUrl}
                          name="vidUrl"
                          component={MTextField}
                          disabled={!vidStatus}
                          helperText="Youtube url format must be like this:
                          https://www.youtube.com/embed/VIDEO_ID"
                        />
                      </Stack>
                      <Field
                        name="type"
                        values={categories?.filter(
                          (item) => item.parent_id == 0
                        )}
                        selectValue={type}
                        label="Category"
                        component={MSelectBox}
                        onChangeValue={valueChanged}
                      ></Field>
                      <p>
                        If you coudln't define your category in this list,
                        please include it with #
                      </p>
                      <Field
                        type="text"
                        name="subCategory"
                        label="Subcategory"
                        multiline
                        component={MTextField}
                        onChange={handleInputChange}
                        initialValue={inputValues.subCategory}
                        placeholder="#Abstract"
                        variant="outlined"
                      />
                      <Stack
                        direction="row"
                        sx={{ alignItems: "center" }}
                        spacing={2}
                      >
                        <label>NFTs quantity (min: 1, max: 10) :</label>
                        <Field
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ProductionQuantityLimitsIcon
                                  sx={{ color: "#bdbdbd" }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          name="tokenLimit"
                          label="Quantity"
                          sx={{ maxWidth: "100px" }}
                          variant="outlined"
                          onChange={handleInputChange}
                          initialValue={inputValues.tokenLimit}
                          component={MTextField}
                          inputProps={{
                            min: 1,
                            max: 10,
                            type: "number",
                          }}
                        />
                      </Stack>
                      <PreviewBtn onClick={onPreview}>Preview</PreviewBtn>

                      <Paragraph className="grey-txt">
                        All our collections are Free or Lazy minted. This means
                        the buyer will pay for the minting of the collectable
                      </Paragraph>
                      <MColorButtonView type="submit">
                        Create a collection
                      </MColorButtonView>
                    </Stack>
                    <div data-aos="flip-up">
                      <Stack spacing={1} flex="1 1">
                        <label className="choose-image-text">
                          Choose Image:
                        </label>
                        <input
                          ref={hiddenFileInput}
                          type="file"
                          id="image-file"
                          accept=".jpg, .png, .jpeg, .bmp"
                          onChange={handleFileChange}
                          className="file-input"
                        />
                        <div
                          onClick={handleImageClick}
                          className="img-click-part"
                        >
                          <img
                            src={
                              result ||
                              (collectionPreview?.image
                                ? collectionPreview?.image
                                : "/images/img_empty.png")
                            }
                            style={{ width: 300, height: "auto" }}
                            alt="collection"
                          />
                          <p className="grey-txt">
                            Upload file jpg, jpeg, png 900x400px max: 100MB
                          </p>
                        </div>
                      </Stack>
                    </div>
                  </Stack>
                </form>
              );
            }}
          />
        </Box>
      </Container>
    </div>
  );
};

export default CreateCollectionPage;

const Paragraph = styled("p")(
  ({ theme }) =>
    `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  margin: 10px 0;
  color: "white";
  background: "transparent";
  `
);

const PreviewBtn = styled(Button)(
  ({}) => `
  background-color: #383838;
  color: white;
  `
);
