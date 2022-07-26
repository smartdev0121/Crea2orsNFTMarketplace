import { pleaseWait } from "please-wait";

export const progressDisplay = (text) => {
  return pleaseWait({
    logo: "/favicon.ico",
    backgroundColor: "#343434",
    loadingHtml: `<div class="spinner">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
    <div>
      <h4 class="wait-text">${text} ...</h4>
    </div>`,
    transitionSupport: false,
  });
};
