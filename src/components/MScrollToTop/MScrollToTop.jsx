import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ location, match, history, children }) => {
  const pathname = window.location.pathname;
  console.log(location);
  console.log(match);
  console.log(history);

  console.log("pathname", pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [[window.location.pathname]]);

  return children || null;
};

export default ScrollToTop;
