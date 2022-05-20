import * as api from "../../utils/magicApi";

export const types = {
  SHOW_SPINNER: "SHOW_SPINNER",
  HIDE_SPINNER: "HIDE_SPINNER",
  HOMEPAGE_CONTENT_FETCHED: "HOMEPAGE_CONTENT_FETCHED",
};

export const showSpinner = (id = "app") => ({
  type: types.SHOW_SPINNER,
  payload: id,
});

export const hideSpinner = (id = "app") => ({
  type: types.HIDE_SPINNER,
  payload: id,
});

export const fetchHomepageContent = (keyword) => (dispatch) => {
  return api
    .get(`/fetch_homepage/${keyword}`)
    .then((res) => {
      dispatch({ type: types.HOMEPAGE_CONTENT_FETCHED, payload: res.contents });
    })
    .catch((err) => {});
};
