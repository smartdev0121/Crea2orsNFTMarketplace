import React, { useEffect, useState } from "react";
import {
  Switch,
  Route,
  Redirect,
  withRouter,
  BrowserRouter,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NotificationContainer } from "react-notifications";
import MainLayout from "./layout/MainLayout";
import reduce from "lodash/reduce";
import guestRoutes from "./routes/guests";
import authRoutes from "./routes/auth";
import MSpinner from "./components/MSpinner";
import { getProfile as getProfileReducer } from "./store/profile/reducer";
import { getSpinner } from "./store/app/reducer";
import { getUserRole } from "src/utils/permission";

import "./App.css";
import "./styles/styles.css";

const App = () => {
  const [whitelisted, setWhitelisted] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => getProfileReducer(state));
  const isLoading = useSelector((state) => getSpinner(state, "PROFILE_INFO"));
  console.log("spi", isLoading);
  let routes;

  if (!user) {
    routes = guestRoutes;
  } else {
    routes = authRoutes;
  }
  const spreadRoutes = reduce(
    routes,
    (result, value) => {
      if (value.children) {
        return [...result, ...value.children];
      } else {
        return [...result, value];
      }
    },
    []
  );

  return (
    <MainLayout>
      {isLoading ? (
        <MSpinner />
      ) : (
        <Switch>
          {spreadRoutes.map((route, index) => {
            return (
              <Route
                key={index}
                path={route.path}
                component={route.component}
                exact={route.exact}
              />
            );
          })}
          {user ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
        </Switch>
      )}
    </MainLayout>
  );
};

// export default withRouter(App);
export default App;
