import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "src/slices/loadingSlice";
import { CONTRACT_TYPE } from "src/config/global";
import { deployContract } from "src/utils/contract";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import "./CreateCollectionPage.scss";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import MTextField from "src/components/MInput/MTextField";
import MSelectBox from "src/components/MInput/MSelectBox";
import InputAdornment from "@mui/material/InputAdornment";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import { styled } from "@mui/system";
import MColorButtonView from "src/components/MInput/MColorButtonView";
import { Form, Field } from "react-final-form";
import { useWeb3React } from "@web3-react/core";
import {showSpinner, hideSpinner} from "src/store/app/actions";
// import "./BackgroundAnimation.scss";

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

const CreateCollectionPage = () => {
  const categories = [
    "Art",
    "Music",
    "Ticket",
    "Community",
    "Moments",
    "Asset",
  ];
  const [contractType, setContractType] = useState(0);
  const [file, setFile] = useState();
  const [metadata, setMetadata] = useState({});
  const [vidStatus, setVidStatus] = useState(false);
  const hiddenFileInput = React.useRef(null);
  const [type, setType] = useState(categories[0]);
  const dispatch = useDispatch();

  const useDisplayImage = () => {
    const [result, setResult] = React.useState("");

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

  const handleInputChange = (e, key) => {
    setMetadata((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFileChange = (e) => {
    uploader(e);
    setFile(e.target.files[0]);
  };

  const handleImageClick = (e) => {
    hiddenFileInput.current.click();
  };

  const handleCreateCollection = async () => {
    dispatch(setLoading(true));
    try {
      await deployContract(contractType, { ...metadata, file: file });
      dispatch(setLoading(false));
    } catch {
      dispatch(setLoading(false));
    }
  };

  const handleCheckboxChange = (e) => {
    setVidStatus(e.target.checked);
  };

  const onSubmit = async (values) => {
    console.log(values);
    const parameter = {
      CollectionName: "A2FCreators",
      Symbol: "A2F",
      BatchSize: 5,
      TotalLimit: 20,
      Price: 100,
    };
    const metadata = {
      collectionName: values.collectionName,
      symbol: values.symbol,
      description: values.description,
      highLight: values.intro,
      category: values.type,
      subCategory: values.subCategory,
      tokenLimit: values.tokenLimit,
      videoUrl: values.vidUrl,
      imageFile: file,
      loyaltyAddress: values.loyaltyAddress,
      fee: values.fee,
    };
    dispatch(showSpinner("DEPLOY_CONTRACT"));
    await deployContract(0, metadata);
    dispatch(hideSpinner("DEPLOY_CONTRACT"));
  };

  const { result, uploader } = useDisplayImage();

  const valueChanged = (value) => {
    console.log(value);
    setType(categories[value]);
  };

  return (
    <div className="whole-container">
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
                        onChange={(e) => handleInputChange(e, "CollectionName")}
                        component={MTextField}
                        variant="standard"
                      />

                      <Field
                        type="text"
                        name="symbol"
                        label="Symbol"
                        onChange={(e) => handleInputChange(e, "Symbol")}
                        component={MTextField}
                        variant="standard"
                      />

                      <Field
                        type="text"
                        placeholder="Description"
                        onChange={(e) => handleInputChange(e, "Description")}
                        label="Collection details and information"
                        name="description"
                        component={MTextField}
                        variant="standard"
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
                          name="vidUrl"
                          component={MTextField}
                          disabled={!vidStatus}
                        />
                      </Stack>

                      <Field
                        type="text"
                        name="intro"
                        multiline
                        label="Highlight Intro"
                        component={MTextField}
                        variant="standard"
                      />
                      <Field
                        name="type"
                        values={categories}
                        initialValue={type}
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
                        multiline
                        component={MTextField}
                        placeholder="#Weapon"
                        variant="standard"
                      />
                      <Stack
                        direction="row"
                        sx={{ alignItems: "center" }}
                        spacing={2}
                      >
                        <label>NFTs quantity (min: 1, max: 25) :</label>
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
                          sx={{ maxWidth: "100px" }}
                          variant="standard"
                          max="25"
                          min="1"
                          label=""
                          component={MTextField}
                          inputProps={{
                            min: 1,
                            max: 25,
                            type: "number",
                          }}
                        />
                      </Stack>
                      <Stack
                        direction="row"
                        sx={{ justifyContent: "center", alignItems: "end" }}
                        spacing={2}
                      >
                        <Field
                          type="text"
                          name="loyaltyAddress"
                          label="Loyalty Address"
                          className="loyalty"
                          component={MTextField}
                          variant="standard"
                        />
                        <Field
                          name="fee"
                          variant="standard"
                          component={MTextField}
                          inputProps={{ min: 1, max: 100, type: "number" }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                        />
                      </Stack>

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
                            metadata.ImageUrl ||
                            "/images/img_empty.png"
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
