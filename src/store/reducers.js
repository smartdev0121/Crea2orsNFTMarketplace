import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import { reducer as form } from "redux-form";
import profile from "./profile/reducer";
import app from "./app/reducer";
import modal from "./modal/reducer";
import users from "./users/reducer";

const rootReducer = (history) => {
  return combineReducers({
    router: connectRouter(history),
    form,
    profile,
    app,
    modal,
    users,
  });
};

export default rootReducer;
