import * as api from "../../utils/magicApi";
import { showNotify } from "../../utils/notify";
import { showSpinner, hideSpinner } from "../app/actions";

export const types = {
  CONTRACT_DEPLOYED: "CONTRACT_DEPLOYED",
  NFT_FETCHED: "NFT_FETCHED",
  COLLECTIONS_FETCHED: "COLLECTIONS_FETCHED",
  COLLECTIONS_ALL_FETCHED: "COLLECTIONS_ALL_FETCHED",
  USER_NFTS_FETCHED: "USER_NFTS_FETCHED",
  COLLECTION_PREVIEW: "COLLECTION_PREVIEW",
  CATEGORY_FETCHED: "CATEGORY_FETCHED",
};

export const fetchCategories = () => (dispatch) => {
  return api
    .get("/categories")
    .then((res) => {
      dispatch({ type: types.CATEGORY_FETCHED, payload: res.categories });
    })
    .catch((err) => {});
};

export const getUserNFTs = () => async (dispatch) => {
  dispatch(showSpinner("USER_NFTS_LOADING"));
  console.log("___________________0000000000");
  return api
    .get("/get-user-nfts")
    .then((res) => {
      if (res.userNfts)
        dispatch({ type: types.USER_NFTS_FETCHED, payload: res.userNfts });
      hideSpinner("USER_NFTS_LOADING");
      console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
    })
    .catch((err) => {
      console.log(err);
      hideSpinner("USER_NFTS_LOADING");
    });
};

export const saveCollection =
  (contractUri, contractAddress, metaData, imageUri, history) => (dispatch) => {
    return api
      .post("/contract-deployed", {
        contractUri: contractUri,
        contractAddress: contractAddress,
        metaData,
        imageUri,
      })
      .then((res) => {
        if (res.result) {
          showNotify("Contract information is successfully stored!");
          history.push(`/collection-view/${contractAddress}`);
        }
      })
      .catch((err) => {
        if (!err.result) showNotify("Connection problem is occured!", "error");
      });
  };

export const getContractUri = (contractAddress) => (dispatch) => {
  return api
    .get(`/contract/${contractAddress}`)
    .then((res) => {
      dispatch({
        type: types.CONTRACT_DEPLOYED,
        payload: {
          contractUri: res.contractUri,
          contractAddress,
          id: res.id,
          userId: res.userId,
          nfts: res.nfts,
          tokenLimit: res.tokenLimit,
        },
      });
    })
    .catch((err) => {
      if (!err.result) showNotify("Connection problem is occured!", "error");
    });
};

export const saveNFT =
  (
    contractId,
    metaData,
    metaDataUri,
    fileUri,
    price,
    signature,
    curWalletAddress,
    contractAddress
  ) =>
  async (dispatch) => {
    dispatch(showSpinner("SAVING_NFT"));
    console.log("STRAT_SAVING_NFT");
    return api
      .post("/create-nft", {
        contractId,
        metaData,
        metaDataUri,
        fileUri,
        price,
        signature,
        curWalletAddress,
      })
      .then((res) => {
        if (res.name) {
          showNotify(`${res.name} is stored successfully!`);
          dispatch(getContractUri(contractAddress));
          dispatch(hideSpinner("SAVING_NFT"));
          return;
        }
        if (res.over) {
          showNotify(
            `You can't create more than ${res.over} in this collection`,
            "warning"
          );
          dispatch(hideSpinner("SAVING_NFT"));
          return;
        }
      })
      .catch((err) => {
        showNotify(
          `Can't store your nft information, confirm network connection!`,
          "error"
        );
        dispatch(hideSpinner("SAVING_NFT"));
        console.log(err);
      });
  };

export const getNFTInformation = (nftId) => async (dispatch) => {
  try {
    const res = await api.get(`/get-nft/${nftId}`);
    dispatch({ type: types.NFT_FETCHED, payload: res });
  } catch (err) {
    console.log(err);
  }
};

export const getUserCollections = () => (dispatch) => {
  return api
    .get("/get-user-collections")
    .then((res) => {
      dispatch({
        type: types.COLLECTIONS_FETCHED,
        payload: [...res.collections],
      });
    })
    .catch((err) => {});
};

export const getAllCollections = () => (dispatch) => {
  dispatch(showSpinner("ALL_COLLECTIONS"));
  return api
    .get("/get-all-collections")
    .then((res) => {
      dispatch({
        type: types.COLLECTIONS_ALL_FETCHED,
        payload: [...res.collections],
      });
      dispatch(hideSpinner("ALL_COLLECTIONS"));
    })
    .catch((err) => {
      dispatch(hideSpinner("ALL_COLLECTIONS"));
    });
};

export const submitCollectionPreview = (collectionInfo) => {
  return { type: types.COLLECTION_PREVIEW, payload: collectionInfo };
};
