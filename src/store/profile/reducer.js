import { types } from "./actions";
import { showNotify } from "src/utils/notify";

const initialState = null;

export default (appState = initialState, { type, payload }) => {
  switch (type) {
    case types.PROFILE_INFO:
      return payload;
    case types.PROFILE_INFO_UPDATE:
      return { ...appState, ...payload };
    case types.PROFILE_ON_SALE_DATA:
      return { ...appState, ...payload };
    case types.PROFILE_OWNED:
      return { ...appState, ...payload };
    case types.PROFILE_CREATED:
      return { ...appState, ...payload };
    case types.PROFILE_ACTIVITY:
      return { ...appState, ...payload };
    default:
      return appState;
  }
};

export const getProfile = (state) => state.profile;

export const blockStatus = (state) => {
  if (state.profile.verified == -1) {
    // showNotify(
    //   "We discovered your suspicious actions. So you are blocked. If you want to unblock your account, please leave a message to lo.egan918@gmail.com"
    // );
    return true;
  }
  return true;
};
export const userStatus = (state) => {
  if (state.profile.verified == 0) {
    // showNotify(
    //   "Your email are not verified yet. Go to the edit profile page and please verify your email."
    // );
    return true;
  }
  return true;
};
