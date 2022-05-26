import * as api from "../../utils/magicApi";
import * as appActions from "../app/actions";

export const types = {
  PROFILE_INFO: "PROFILE_INFO",
  PROFILE_INFO_UPDATE: "PROFILE_INFO_UPDATE",
  PROFILE_MESSAGE_COUNT: "PROFILE_MESSAGE_COUNT",
};

export const updateProfile = (newProfile) => ({
  type: types.PROFILE_INFO_UPDATE,
  payload: newProfile,
});

export const getProfile = (walletAddress) => (dispatch) => {
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
