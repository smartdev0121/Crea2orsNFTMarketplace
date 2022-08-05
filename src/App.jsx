import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "./layout/MainLayout";
import reduce from "lodash/reduce";
import guestRoutes from "./routes/guests";
import authRoutes from "./routes/auth";
import MSpinner from "./components/MSpinner";
import { getProfile as getProfileReducer } from "./store/profile/reducer";
import { getSpinner } from "./store/app/reducer";
import AOS from "aos";
import "aos/dist/aos.css";
import "please-wait/build/please-wait.css";
import "./spinner.css";
import "./App.css";
import "./styles/styles.css";

const App = (props) => {
  const user = useSelector((state) => getProfileReducer(state));
  const isLoading = useSelector((state) => getSpinner(state, "PROFILE_INFO"));

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 500,
      easing: "ease-in-sine",
    });
  }, []);

  let routes = user ? authRoutes : guestRoutes;
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
        </Switch>
      )}
    </MainLayout>
  );
};

// export default withRouter(App);
export default App;
