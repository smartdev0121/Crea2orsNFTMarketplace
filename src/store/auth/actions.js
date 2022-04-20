import { replace } from "connected-react-router";

import * as api from "../../utils/magicApi";
import { setToken, clearInfo } from "../../utils/storage";
import * as appActions from "../app/actions";
import { getProfile } from "../../store/profile/actions";
import { showNotify } from "../../utils/notify";

export const types = {
  AUTH_LOGIN: "AUTH_LOGIN",
  AUTH_LOGUT: "AUTH_LOGUT",
};

export const login = (values) => (dispatch) => {
  dispatch(appActions.showSpinner("login"));
  return api
    .post("/auth/login", values)
    .then((res) => {
      setToken(res.token);
      return getProfile()(dispatch);
    })
    .then((firstName) => {
      showNotify(`Hi, ${firstName}. You are logged successfully`);
      dispatch(replace("/connect-wallet"));
    })
    .catch((err) => {
      if (err) showNotify("Connection Problem occured!", "error");
    })
    .finally(() => {
      dispatch(appActions.hideSpinner("login"));
    });
};

export const logout = () => {
  clearInfo();
  document.location.href = "/";
};

export const forgotPassword = (values) => (dispatch) => {
  console.log(values);
  return api.post("/auth/forgot_password", values);
};

export const resetPassword = (values) => (dispatch) => {
  console.log(values);
  return api.post("/auth/reset_password", values);
};
