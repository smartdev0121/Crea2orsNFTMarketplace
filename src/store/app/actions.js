import * as api from "../../utils/magicApi";

export const types = {
  SHOW_SPINNER: "SHOW_SPINNER",
  HIDE_SPINNER: "HIDE_SPINNER",
  HOMEPAGE_CONTENT_FETCHED: "HOMEPAGE_CONTENT_FETCHED",
  COLLECTIONS_BY_CATEGORY: "COLLECTIONS_BY_CATEGORY",
};

export const showSpinner = (id = "app") => ({
  type: types.SHOW_SPINNER,
  payload: id,
});

export const hideSpinner = (id = "app") => ({
  type: types.HIDE_SPINNER,
  payload: id,
});

export const fetchCollectionByCategory = (id) => async (dispatch) => {
  return api
    .post("/fetch_collections_by_category", { id })
    .then((res) => {
      // console.log("RES COLLECTIONS", res.collectionsByCategory);
      dispatch({
        type: types.COLLECTIONS_BY_CATEGORY,
        payload: res.collectionsByCategory,
      });
    })
    .catch((err) => console.log(err));
};
export const fetchHomepageContent = () => async (dispatch) => {
  return api
    .get(`/fetch_homepage`)
    .then((res) => {
      dispatch({ type: types.HOMEPAGE_CONTENT_FETCHED, payload: res.contents });
    })
    .catch((err) => {});
};
