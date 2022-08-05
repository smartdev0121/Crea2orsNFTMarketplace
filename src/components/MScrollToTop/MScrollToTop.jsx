import { useEffect } from "react";

const ScrollToTop = ({ children }) => {
  const pathname = window.location.pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [[window.location.pathname]]);

  return children || null;
};

export default ScrollToTop;
