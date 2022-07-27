import { types } from "./actions";

const initialState = {
  spinners: {},
  contents: [],
  collectionsByCategory: [],
};

export default (appState = initialState, { type, payload }) => {
  switch (type) {
    case types.SHOW_SPINNER:
      console.log("SHOWING_SPINNER", payload);
      return {
        ...appState,
        spinners: {
          ...appState.spinners,
          [payload]: true,
        },
      };
    case types.HIDE_SPINNER:
      console.log("HIDING_SPINNER", payload);

      return {
        ...appState,
        spinners: {
          ...appState.spinners,
          [payload]: false,
        },
      };
    case types.HOMEPAGE_CONTENT_FETCHED:
      return {
        ...appState,
        contents: [...payload],
      };
    case types.COLLECTIONS_BY_CATEGORY:
      return {
        ...appState,
        collectionsByCategory: [...payload],
      };
    default:
      return appState;
  }
};

export const getSpinner = (state, id = "app") => state.app.spinners.id || false;
