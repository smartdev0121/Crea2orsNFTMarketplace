import React from "react";
import HeaderLogin from "./HeaderLogin";
import MScrollToTop from "src/components/MScrollToTop";
import Footer from "./Footer";
import styled from "styled-components";

const MainLayout = ({ children, history }) => {
  return (
    <>
      <HeaderLogin />
      <MBody>{children}</MBody>
      <Footer />
    </>
  );
};

export default MainLayout;

const MBody = styled.div`
  min-height: 65vh;
`;
