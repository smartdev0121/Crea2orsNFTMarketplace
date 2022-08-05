import * as api from "../../utils/magicApi";
import * as appActions from "../app/actions";
import { showNotify } from "../../utils/notify";
export const types = {
  PROFILE_INFO: "PROFILE_INFO",
  PROFILE_INFO_UPDATE: "PROFILE_INFO_UPDATE",
  PROFILE_MESSAGE_COUNT: "PROFILE_MESSAGE_COUNT",
  PROFILE_ON_SALE_DATA: "PROFILE_ON_SALE_DATA",
  PROFILE_OWNED: "PROFILE_OWNED",
  PROFILE_CREATED: "PROFILE_CREATED",
  PROFILE_ACTIVITY: "PROFILE_ACTIVITY",
};

export const getActivity = () => async (dispatch) => {
  return api
    .post("/profile/activity")
    .then((res) => {
      console.log("Result", res);
      dispatch({
        type: types.PROFILE_ACTIVITY,
        payload: { activity: res.activity },
      });
    })
    .catch((err) => {});
};
export const updateProfile = (newProfile) => ({
  type: types.PROFILE_INFO_UPDATE,
  payload: newProfile,
});

export const reportPage = (content, customUrl) => async (disaptch) => {
  return api
    .post("/reportpage", { content, customUrl })
    .then((res) => {
      if (res.result) {
        showNotify("Successfully reported about this user!");
        return;
      }
    })
    .catch((err) => {
      console.log(err.result);
      return;
    });
};

export const getProfile = (walletAddress) => async (dispatch) => {
  dispatch(appActions.showSpinner("PROFILE_INFO"));
  return api
    .get(`/profile/info/${walletAddress}`)
    .then((res) => {
      console.log(res);
      dispatch({
        type: types.PROFILE_INFO,
        payload: { ...res },
      });
      dispatch(appActions.hideSpinner("PROFILE_INFO"));
      return res.nickName;
    })
    .catch((err) => {
      console.log(err);
      dispatch(appActions.hideSpinner("PROFILE_INFO"));
    })
    .finally(() => {
      dispatch(appActions.hideSpinner("PROFILE_INFO"));
    });
};

export const fetchOnSaleData = (category, collection) => async (dispatch) => {
  return api
    .post("/profile/onsale", { category, collection })
    .then((res) => {
      console.log("Result", res);
      dispatch({
        type: types.PROFILE_ON_SALE_DATA,
        payload: { saleDatas: JSON.parse(res.newOrders) },
      });
    })
    .catch((err) => {});
};

export const fetchOwnedData = () => async (dispatch) => {
  return api
    .post("/profile/owned")
    .then((res) => {
      console.log("Result", res);
      dispatch({
        type: types.PROFILE_OWNED,
        payload: { owner: res.owner },
      });
    })
    .catch((err) => {});
};

export const fetchCreatedData = () => async (dispatch) => {
  return api
    .post("/profile/created")
    .then((res) => {
      console.log("Result", res);
      dispatch({
        type: types.PROFILE_CREATED,
        payload: { creator: res.creator },
      });
    })
    .catch((err) => {});
};
