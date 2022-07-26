import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import networks from "src/config/network";

let web3Modal;

let provider;

let selectedAccount;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
    },
  },
};

web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

export const getCachedProvider = () => {
  return web3Modal.cachedProvider;
};

export const signMsg = (msg, from) =>
  new Promise((resolve, reject) => {
    const web3 = new Web3(provider);
    web3.currentProvider.sendAsync(
      {
        method: "eth_signTypedData",
        params: [msg, from],
        from: from,
      },
      (err, result) => {
        if (err) return reject(err);
        if (result.error) {
          return reject(result.error.message);
        }
        return resolve(result.result);
      }
    );
  });

export const disconnectWallet = async () => {
  try {
    return await web3Modal.clearCachedProvider();
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const showWeb3WalletModal = async () => {
  try {
    provider = await web3Modal.connect();
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return null;
  }

  return provider;
};

export const getCurrentWalletAddress = async () => {
  try {
    if (web3Modal.cachedProvider) {
      provider = await web3Modal.connect();
    } else {
      return null;
    }
    // Get a Web3 instance for the wallet
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();

    if (accounts && accounts.length > 0) {
      selectedAccount = accounts[0];

      return selectedAccount;
    } else {
      return null;
    }
  } catch (e) {
    // console.error('Could not getCurrentWalletAddress', e);
    return null;
  }
};

export const getCurrentNetworkId = async () => {
  try {
    if (web3Modal.cachedProvider) {
      provider = await web3Modal.connect();
    } else {
      return null;
    }
    const web3 = new Web3(provider);
    return await web3.eth.net.getId();
  } catch (e) {
    // console.error('Could not getCurrentNetworkId', e);
    return null;
  }
};

export const switchNetwork = async (network) => {
  if (network === (await getCurrentNetworkId())) {
    return true;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: networks[network].chainId }],
    });
    return true;
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [networks[network]],
        });
        return true;
      } catch (addError) {
        return false;
      }
    }
    return false;
  }
};

export default web3Modal;
