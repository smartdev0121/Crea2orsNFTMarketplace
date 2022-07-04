import * as api from "../../utils/magicApi";
import * as appActions from "../app/actions";
import { showNotify } from "../../utils/notify";
export const types = {
  PROFILE_INFO: "PROFILE_INFO",
  PROFILE_INFO_UPDATE: "PROFILE_INFO_UPDATE",
  PROFILE_MESSAGE_COUNT: "PROFILE_MESSAGE_COUNT",
};

export const updateProfile = (newProfile) => ({
  type: types.PROFILE_INFO_UPDATE,
  payload: newProfile,
});

export const reportPage = (content) => async (disaptch) => {
  return api
    .post("/reportpage", { content })
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
