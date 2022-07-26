import * as api from "src/utils/magicApi";
import { showNotify } from "src/utils/notify";
import { setToken } from "src/utils/storage";
import { getProfile } from "../profile/actions";
import { fetchCategories } from "../contract/actions";
export const types = {
  CONNECTED_WALLET: "CONNECTED_WALLET",
  REJECT_WALLET: "REJECT_WALLET",
};

export const connectedWallet = (walletAddress) => async (dispatch) => {
  return api
    .post("/wallet-connected", { walletAddress: walletAddress })
    .then((res) => {
      if (res?.result == "blocked") {
        showNotify(
          "Your account is blocked. Ask for administrator. Email address: lo.egan918@gmail.com"
        );
        return;
      }
      if (res.token) {
        setToken(res.token);
      }
      if (res.result == "cr2") {
        showNotify("Reward time is expired or CR2 token is not sufficient!");
      } else if (res.result == "brise") {
        showNotify("Reward time is expired or Brise is not sufficient!");
      }
      dispatch({
        type: types.CONNECTED_WALLET,
        payload: "",
      });
      dispatch(getProfile(walletAddress));
      dispatch(fetchCategories());
    })
    .catch((err) => console.log(err));
};

export const rejectConnectWallet = () => {
  return {
    type: types.REJECT_WALLET,
    payload: "",
  };
};
