import * as api from "../../utils/magicApi";
import { showSpinner, hideSpinner } from "../app/actions";
import { showNotify } from "../../utils/notify";
import { showModal } from "../modal/actions";

export const types = {
  CREATE_USER: "CREATE_USER",
  UPDATE_USER: "UPDATE_USER",
  DELETE_USER: "DELETE_USER",
  GET_USER_INFO: "GET_USER_INFO",
  SET_USER_INFO: "SET_USER_INFO",
  GET_AVATAR_URL: "GET_AVATAR_URL",
  NOT_PROFILE_FOUND: "NOT_PROFILE_FOUND",
  PROFILE_FOUND: "PROFILE_FOUND",
};

export const setUserInfo = (data) => {
  const config = {
    headers: {
      "content-type": `multipart/form-data; boundary=${data._boundary}`,
      // "content-type": `application/x-www-form-urlencoded`,
    },
  };
  console.log("data", data.get("name"));
  return (dispatch) => {
    api
      .post("/set-user-info", data, config)
      .then((res) => {
        dispatch({ type: types.SET_USER_INFO, payload: res });
        showNotify("Profile information is successfully updated");
      })
      .catch((res) => {
        if (res.email)
          showNotify(
            "Email address you have entered newly is already used!",
            "error"
          );
      });
  };
};

export const getUserInfo = (dispatch) => {
  dispatch(showSpinner("get_user_info"));
  return (dispatch) => {
    api
      .get("/get-user-info")
      .then((res) => {
        console.log(res);
        dispatch({ type: types.GET_USER_INFO, payload: res });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(hideSpinner("get_user_info"));
      });
  };
};

export const createUser = (values, history) => {
  return (dispatch) =>
    api
      .post("/users", values)
      .then((res) => {
        dispatch({ type: types.CREATE_USER, payload: res });
        showNotify("User has been created successfully!");
        history.push("/sign-in");
        dispatch(showModal());
      })
      .catch((res) => {
        console.log(res);
        showNotify(
          res.email
            ? "Sorry! email already exists"
            : "Sorry! Connection problem happened!",
          "error"
        );
      });
};

export const emailVerified = (email, history) => (dispatch) => {
  console.log("email add", { email: email });
  return api
    .post("/email-verified", { email })
    .then((res) => {
      if (res.result === true) {
        showNotify(`${email} is successfully verified!`);
        setTimeout(() => {
          history.push("/");
        }, 3000);
      }
    })
    .catch((err) => {
      console.log(err);
      showNotify("Connection problem!", "error");
    });
};

export const getAvatarUrl = () => (dispatch) => {
  return api.get("get-avatar-url").then((res) => {
    dispatch({ type: types.GET_AVATAR_URL, payload: res.avatar_url });
  });
};

export const getOtherProfile = (url) => {
  console.log("UUU", url);
  return (dispatch) => {
    api
      .get(`/custom/${url}`)
      .then((res) => {
        console.log("success", res);
        dispatch({ type: types.PROFILE_FOUND, payload: res });
      })
      .catch((err) => {
        console.log("Error", err);
        dispatch({ type: types.NOT_PROFILE_FOUND, payload: "" });
      });
  };
};
