import * as api from "../../utils/magicApi";
import { showNotify } from "../../utils/notify";
import { getNFTInformation } from "../contract/actions";

export const types = {
  ORDER_CREATED: "ORDER_CREATED",
  ORDERS_FETCHED: "ORDERS_FETCHED",
};

export const orderCreated = (orderData) => async (dispatch) => {
  try {
    const res = await api.post("/order-created", {
      orderData: { ...orderData },
    });

    if (res.result === "overflow") {
      showNotify(
        "You have been exceed the total amount of you owned",
        "warning"
      );
      return;
    }
    if (res.newOrder) {
      dispatch({ type: types.ORDER_CREATED, payload: { ...res.newOrder } });
      dispatch(fetchOrderData(orderData.nftDbId));
    }
  } catch (err) {
    console.log(err);
  }
};

export const nftMinted = (nftId, contractNftId, amount) => async (dispatch) => {
  return api
    .post(`/nft-minted`, { nftId, contractNftId, amount })
    .then((res) => {
      dispatch(getNFTInformation(nftId));
      showNotify("Successfully minted!");
    })
    .catch((err) => {
      console.log(err);
      showNotify("Error is counted!", "error");
    });
};

export const fetchOrderData = (nftId) => async (dispatch) => {
  return api
    .get(`/get-orders/${nftId}`)
    .then((res) => {
      console.log(res);
      dispatch({ type: types.ORDERS_FETCHED, payload: [...res.ordersData] });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const canceledOrder = (id) => (dispatch) => {
  return api
    .post("/cancel-order", { id: id })
    .then((res) => {
      if (res.result) {
        dispatch(fetchOrderData(Number(res.result)));
        showNotify("Order is successfully cancelled!");
      }
    })
    .catch((err) => {
      console.log(err);
      showNotify("Confirm internet connection!", "error");
    });
};

// export const orderFinialized = (orderData, orderId, nftId) => (dispatch) => {
//   return api
//     .post("/order-finalized", { orderData, orderId, nftId })
//     .then((res) => {
//       dispatch({ type: types.ORDERS_FETCHED, payload: [...res.ordersData] });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

export const orderFinialized = (orderId, amount, userId) => (dispatch) => {
  return api
    .post("/order-finalized", { orderId, userId, amount })
    .then((res) => {
      dispatch({ type: "NFT_FETCHED", payload: res.nftInfo });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const bidPlaced = (orderData, orderId, nftId) => (dispatch) => {
  return api
    .post("/new-bid-placed", { orderData, orderId, nftId })
    .then((res) => {
      dispatch({ type: types.ORDERS_FETCHED, payload: [...res.ordersData] });
    })
    .catch((err) => {});
};
