import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CONTRACT_TYPE } from "src/config/global";
import {
  deployContract,
  holdEvent,
  getValuefromEvent,
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
import { showSpinner, hideSpinner } from "src/store/app/actions";
import MSpinner from "src/components/MSpinner";
import { getSpinner } from "src/store/app/reducer";
import { showNotify } from "src/utils/notify";
import {
  saveCollection,
  submitCollectionPreview,
} from "../../store/contract/actions";
import "./CreateCollectionPage.scss";

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

const CreateCollectionPage = (props) => {
  const categories = [
    "Art",
    "Music",
    "Ticket",
    "Community",
    "Moments",
    "Asset",
  ];
  const [contractType, setContractType] = useState(0);
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
  const [file, setFile] = useState();
  const [metadata, setMetadata] = useState({});
  const [vidStatus, setVidStatus] = useState(false);
  const hiddenFileInput = React.useRef(null);
  const [type, setType] = useState();
  const isDeploying = useSelector((state) =>
    getSpinner(state, "DEPLOY_CONTRACT")
  );
  const [result, setResult] = React.useState("");

  useEffect(() => {
    setType(collectionPreview ? categories.indexOf(collectionPreview.type) : 0);
    console.log(typeof categories.indexOf(collectionPreview?.type));
    setResult(collectionPreview ? collectionPreview.image : null);
  }, []);
  const dispatch = useDispatch();

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

  const handleInputChange = (e) => {
    setInputValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    uploader(e);
    setFile(e.target.files[0]);
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
      type: categories[type],
      image: result,
    };
    dispatch(submitCollectionPreview(newCollectionInfo));
    props.history.push("/collection-preview");
  };

  const onSubmit = async (values) => {
    const metadata = {
      name: values.collectionName,
      symbol: values.symbol,
      description: values.description,
      videoUrl: values.vidUrl,
      highLight: values.intro,
      category: values.type,
      subCategory: values.subCategory,
      tokenLimit: values.tokenLimit,
      file: file,
    };
    try {
      dispatch(showSpinner("DEPLOY_CONTRACT"));

      const { contractAddress, contractUri, imageUri } = await deployContract(
        0,
        metadata
      );

      const events = await holdEvent("ContractDeployed", contractAddress);
      console.log("Collection Event", events);
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
      dispatch(hideSpinner("DEPLOY_CONTRACT"));
    } catch (err) {
      console.log(err);
      showNotify(
        `Unfortunately, can't create collection for an network error`,
        "error"
      );

      dispatch(hideSpinner("DEPLOY_CONTRACT"));
    }
  };

  const { uploader } = useDisplayImage();

  const valueChanged = (value) => {
    setType(value);
  };

  return (
    <div className="whole-container">
      {isDeploying && <MSpinner />}
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
            validate={(values) => {
              const errors = {};
            }}
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
                        />
                      </Stack>
                      <Field
                        name="type"
                        values={categories}
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
                        placeholder="#Weapon"
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
                    <Stack spacing={1} flex="1 1">
                      <label className="choose-image-text">Choose Image:</label>
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
