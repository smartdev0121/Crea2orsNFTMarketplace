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
};

export const getUserNFTs = () => (dispatch) => {
  showSpinner("USER_NFTS_LOADING");
  return api
    .get("/get-user-nfts")
    .then((res) => {
      if (res.userNfts)
        dispatch({ type: types.USER_NFTS_FETCHED, payload: res.userNfts });
      hideSpinner("USER_NFTS_LOADING");
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
          console.log("History", history);
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
      console.log(res);
      dispatch({
        type: types.CONTRACT_DEPLOYED,
        payload: {
          contractUri: res.contractUri,
          contractAddress,
          id: res.id,
          nfts: res.nfts,
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
    history,
    price,
    signature,
    // nftId,
    curWalletAddress
  ) =>
  (dispatch) => {
    console.log("//////////////", curWalletAddress);
    return api
      .post("/create-nft", {
        contractId,
        metaData,
        metaDataUri,
        fileUri,
        price,
        // nftId,
        signature,
        curWalletAddress,
      })
      .then((res) => {
        if (res.name) {
          showNotify(`${res.name} is stored successfully!`);
        }
        if (res.over) {
          showNotify(
            `You can't create more than ${res.over} in this collection`,
            "warning"
          );
        }
      })
      .catch((err) => {
        showNotify(
          `Can't store your nft information, confirm network connection!`,
          "error"
        );
        console.log(err);
      });
  };

export const getNFTInformation = (nftId) => (dispatch) => {
  return api
    .get(`/get-nft/${nftId}`)
    .then((res) => {
      dispatch({ type: types.NFT_FETCHED, payload: res });
    })
    .catch((err) => {
      console.log(err);
    });
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
