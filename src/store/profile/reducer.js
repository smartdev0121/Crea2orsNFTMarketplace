import { types } from "./actions";

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
