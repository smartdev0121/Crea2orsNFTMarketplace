import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import PasswordReset from "../pages/PasswordReset";
import HomePage from "../pages/Home";
import ResetComponent from "../pages/PasswordReset/ResetComponent";
import EmailConfirmed from "../pages/EmailConfirmed";
import OtherProfile from "../pages/OtherProfile";
import AllCollections from "../pages/AllCollections";

const routes = [
  // {
  //   path: "/sign-in",
  //   component: SignIn,
  //   exact: true,
  // },
  // {
  //   path: "/sign-up",
  //   component: SignUp,
  //   exact: true,
  // },
  // {
  //   path: "/password-reset",
  //   component: PasswordReset,
  //   exact: true,
  // },
  // {
  //   path: "/reset-password/:token/:email",
  //   component: ResetComponent,
  //   exact: true,
  // },
  {
    path: "/all-collections",
    exact: true,
    component: AllCollections,
  },
  {
    path: "/email-confirm/:token/:email",
    component: EmailConfirmed,
    exact: true,
  },
  {
    path: "/",
    component: HomePage,
    exact: true,
  },
  {
    path: "/user/:customUrl",
    component: OtherProfile,
    exact: true,
  },
];

export default routes;
