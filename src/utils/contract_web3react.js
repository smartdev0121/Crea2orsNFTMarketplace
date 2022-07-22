import Web3 from "web3";

import { CONTRACT_TYPE } from "src/config/global";
import { uploadContractMetadata, uploadAssetMetaData } from "./pinata";
import web3Modal, { getCurrentWalletAddress, switchNetwork } from "./wallet";
import showNotification from "src/config/notification";
const contract_source_arr = [
  "./contract/compiled/ERC721/A2F",
  "./contract/compiled/ERC1155",
  "./contract/compiled/ERC20_BASE",
];

let provider;

const readContractABI = async (contract_type) =>
  new Promise((resolve, reject) => {
    let contract_data;
    let contract_source = contract_source_arr[contract_type];

    fetch(`${contract_source}.abi`)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        contract_data = JSON.parse(data);
        return resolve(contract_data);
      })
      .catch((e) => {
        return reject("Could not fetch data");
      });
  });

const readContractByteCode = async (contract_type) =>
  new Promise((resolve, reject) => {
    let bytecode;
    let contract_source = contract_source_arr[contract_type];

    fetch(`${contract_source}.bin`)
      .then((response) => response.text())
      .then((data) => {
        bytecode = data;
        return resolve(bytecode);
      })
      .catch((e) => {
        return reject();
      });
  });

export const deployContract = (
  contract_type,
  contract_metadata,
  library,
  account
) =>
  new Promise(async (resolve, reject) => {
    try {
      const { CollectionName, Symbol, BatchSize, TotalLimit, Price } =
        contract_metadata;

      // const { contract_uri } = await uploadContractMetadata(contract_metadata);

      showNotification(
        "Waiting",
        "Please wait while deploying smart contract",
        "waiting"
      );

      // if (web3Modal.cachedProvider) {
      //   provider = await web3Modal.connect();
      // } else {
      //   return reject("Cannot connect to wallet");
      // }
      provider = library;

      const web3 = new Web3(provider);
      // const accounts = await web3.eth.getAccounts();

      const bytecode = await readContractByteCode(contract_type);

      const contract_data = await readContractABI(contract_type);

      const contract = new library.eth.Contract(contract_data);

      contract
        .deploy({
          data: bytecode,
          arguments: ["A", "S", 5, 20, 100],
        })
        .send({ from: account })
        .then(async (deployment) => {
          showNotification(
            "Success",
            `Contract was deployed successfully at ${deployment.options.address}`,
            "success",
            8
          );

          return resolve();
        })
        .catch((e) => {
          return reject();
        });
    } catch (e) {
      console.log(e);
      showNotification("Failed", "Failed", "failed", 3);
      return reject("Could not deploy smart contract");
    }
  });

export const mintAsset = (
  contract_type,
  contract_address,
  chain_id,
  metadata,
  initial_supply = 0,
  max_supply = 0
) =>
  new Promise(async (resolve, reject) => {
    try {
      if (web3Modal.cachedProvider) {
        provider = await web3Modal.connect();
      } else {
        provider = await web3Modal.connect();
        window.location.reload();
      }

      const web3 = new Web3(provider);

      await switchNetwork(chain_id);

      showNotification("Waiting", "Waiting ...", "waiting");

      const { metadata_uri } = await uploadAssetMetaData(metadata);
      const contract_data = await readContractABI(contract_type);
      const wallet_address = await getCurrentWalletAddress();

      const contract = new web3.eth.Contract(contract_data, contract_address);

      let tx = {
        from: wallet_address,
        to: contract_address,
        value: 0,
      };

      if (contract_type === CONTRACT_TYPE.ERC721) {
        await contract.methods.mint(metadata_uri).send(tx);
      } else {
        await contract.methods
          .create(max_supply, initial_supply, metadata_uri, [])
          .send(tx);
      }

      showNotification("Success", "Successfully minted", "success", 3);

      return resolve();
    } catch (e) {
      showNotification("Failed", "Failed", "failed", 3);
      return reject();
    }
  });

export const updateAsset = (
  contract_type,
  contract_address,
  chain_id,
  token_id,
  metadata
) =>
  new Promise(async (resolve, reject) => {
    try {
      if (web3Modal.cachedProvider) {
        provider = await web3Modal.connect();
      } else {
        provider = await web3Modal.connect();
        window.location.reload();
      }

      const web3 = new Web3(provider);

      await switchNetwork(chain_id);

      showNotification("Waiting", "Waiting ...", "waiting");

      const { metadata_uri } = await uploadAssetMetaData(metadata);
      const contractData = await readContractABI(contract_type);
      const currentAddress = await getCurrentWalletAddress();

      const contract = new web3.eth.Contract(contractData, contract_address);

      const tx_data =
        contract_type === CONTRACT_TYPE.ERC721
          ? contract.methods.setTokenURI(token_id, metadata_uri).encodeABI()
          : contract.methods.setURI(token_id, metadata_uri).encodeABI();

      const tx = {
        from: currentAddress,
        to: contract_address,
        data: tx_data,
      };

      await web3.eth.sendTransaction(tx);

      showNotification("Success", "Successfully updated", "success", 3);

      return resolve({ success: true });
    } catch (e) {
      showNotification("Failed", "Failed", "failed", 3);
      return reject();
    }
  });

export const updateCollection = (
  contract_type,
  contract_address,
  chain_id,
  contract_metadata
) =>
  new Promise(async (resolve, reject) => {
    try {
      if (web3Modal.cachedProvider) {
        provider = await web3Modal.connect();
      } else {
        provider = await web3Modal.connect();
        window.location.reload();
      }

      const web3 = new Web3(provider);

      await switchNetwork(chain_id);

      showNotification("Waiting", "Waiting ...", "waiting");

      const { RoyaltyFee, RoyaltyAddress } = contract_metadata;
      const { contract_uri } = await uploadContractMetadata(contract_metadata);
      const contractData = await readContractABI(contract_type);
      const currentAddress = await getCurrentWalletAddress();

      const contract = new web3.eth.Contract(contractData, contract_address);
      const tx_data = contract.methods
        .setContractURI(
          contract_uri,
          RoyaltyAddress || "0x0000000000000000000000000000000000000000",
          Number(RoyaltyFee || 0) * Math.pow(10, 6)
        )
        .encodeABI();

      const tx = {
        from: currentAddress,
        to: contract_address,
        data: tx_data,
      };

      await web3.eth.sendTransaction(tx);

      showNotification("Success", "Successfully updated", "success", 3);

      return resolve({ success: true });
    } catch (e) {
      showNotification("Failed", "Failed", "failed", 3);
      return reject();
    }
  });

export const batchTransferAssets = (
  contract_type,
  contract_address,
  chain_id,
  to_address,
  ids,
  amount = []
) =>
  new Promise(async (resolve, reject) => {
    try {
      if (web3Modal.cachedProvider) {
        provider = await web3Modal.connect();
      } else {
        provider = await web3Modal.connect();
        window.location.reload();
      }

      const web3 = new Web3(provider);

      await switchNetwork(chain_id);

      showNotification("Waiting", "Waiting ...", "waiting");

      const contract_data = await readContractABI(contract_type);
      const current_address = await getCurrentWalletAddress();

      const contract = new web3.eth.Contract(contract_data, contract_address);

      const tx_data =
        contract_type === CONTRACT_TYPE.ERC721
          ? contract.methods
              .safeBatchTransferFrom(current_address, to_address, ids)
              .encodeABI()
          : contract.methods
              .safeBatchTransferFrom(
                current_address,
                to_address,
                ids,
                amount,
                []
              )
              .encodeABI();

      const tx = {
        from: current_address,
        to: contract_address,
        value: 0,
        data: tx_data,
      };

      await web3.eth.sendTransaction(tx);
      showNotification("Success", "Successfully sent", "success", 3);

      return resolve();
    } catch (e) {
      showNotification("Failed", "Failed", "failed", 3);
      return reject();
    }
  });

export const burnAsset = (
  contract_type,
  contract_address,
  chain_id,
  id,
  burn_amount = 1
) =>
  new Promise(async (resolve, reject) => {
    try {
      if (web3Modal.cachedProvider) {
        provider = await web3Modal.connect();
      } else {
        provider = await web3Modal.connect();
        window.location.reload();
      }

      const web3 = new Web3(provider);

      await switchNetwork(chain_id);

      showNotification("Waiting", "Waiting ...", "waiting");

      const contract_data = await readContractABI(contract_type);
      const current_address = await getCurrentWalletAddress();

      const contract = new web3.eth.Contract(contract_data, contract_address);

      const tx = {
        from: current_address,
        to: contract_address,
        data:
          contract_type === CONTRACT_TYPE.ERC721
            ? contract.methods.burn(id).encodeABI()
            : contract.methods.burn(id, burn_amount).encodeABI(),
      };

      await web3.eth.sendTransaction(tx);
      showNotification("Success", "Successfully burned", "success", 3);
      return resolve({ success: true });
    } catch (e) {
      showNotification("Failed", "Failed", "failed", 3);
      return reject();
    }
  });

export const mintERC1155 = (address, chain_id, id, amount) =>
  new Promise(async (resolve, reject) => {
    try {
      if (web3Modal.cachedProvider) {
        provider = await web3Modal.connect();
      } else {
        provider = await web3Modal.connect();
        window.location.reload();
      }

      const web3 = new Web3(provider);

      await switchNetwork(chain_id);

      showNotification("Waiting", "Waiting ...", "waiting");

      const contract_data = await readContractABI(CONTRACT_TYPE.ERC1155);
      const current_address = await getCurrentWalletAddress();

      const mContract = new web3.eth.Contract(contract_data, address);

      const tx = {
        from: current_address,
        to: address,
        data: mContract.methods.mint(id, amount, []).encodeABI(),
      };

      await web3.eth.sendTransaction(tx);
      showNotification("Success", "Successfully minted", "success", 3);
      return resolve({ success: true });
    } catch (e) {
      showNotification("Failed", "Failed", "failed", 3);
      return reject();
    }
  });

export const setApprovalForAll = (
  contract_address,
  asset_address,
  chain_id,
  contract_type = 0
) =>
  new Promise(async (resolve, reject) => {
    try {
      if (web3Modal.cachedProvider) {
        provider = await web3Modal.connect();
      } else {
        provider = await web3Modal.connect();
        window.location.reload();
      }

      const web3 = new Web3(provider);

      await switchNetwork(chain_id);

      showNotification("Waiting", "Approving ...", "waiting");

      const contract_data = await readContractABI(contract_type);
      const current_address = await getCurrentWalletAddress();

      const mContract = new web3.eth.Contract(contract_data, asset_address);

      const isApproved = await mContract.methods
        .isApprovedForAll(current_address, contract_address)
        .call();

      if (!isApproved) {
        const tx = {
          from: current_address,
          to: asset_address,
          data: mContract.methods
            .setApprovalForAll(contract_address, true)
            .encodeABI(),
        };

        await web3.eth.sendTransaction(tx);
      }

      showNotification("Success", "Approved successfully", "success", 3);
      return resolve({ success: true });
    } catch (e) {
      showNotification("Failed", "Failed", "failed", 3);
      return reject();
    }
  });

export const approve = (
  contract_address,
  asset_address,
  amount,
  chain_id,
  contract_type = 0
) =>
  new Promise(async (resolve, reject) => {
    try {
      if (web3Modal.cachedProvider) {
        provider = await web3Modal.connect();
      } else {
        provider = await web3Modal.connect();
        window.location.reload();
      }

      const web3 = new Web3(provider);

      await switchNetwork(chain_id);

      showNotification("Waiting", "Approving ...", "waiting");

      const contract_data = await readContractABI(contract_type);
      const current_address = await getCurrentWalletAddress();

      const mContract = new web3.eth.Contract(contract_data, asset_address);

      const tx = {
        from: current_address,
        to: asset_address,
        data: mContract.methods.approve(contract_address, amount).encodeABI(),
      };

      await web3.eth.sendTransaction(tx);

      showNotification("Success", "Approved successfully", "success", 3);
      return resolve({ success: true });
    } catch (e) {
      showNotification("Failed", "Failed", "failed", 3);
      return reject();
    }
  });

export const getTokenInfo = async (address) => {
  try {
    if (web3Modal.cachedProvider) {
      provider = await web3Modal.connect();
    } else {
      return null;
    }
    // Get a Web3 instance for the wallet
    const web3 = new Web3(provider);
    const contract_data = await readContractABI(CONTRACT_TYPE.ERC20);
    const contract = new web3.eth.Contract(contract_data, address);
    const symbol = await contract.methods.symbol().call();
    const decimals = await contract.methods.decimals().call();
    return { symbol, decimals };
  } catch (e) {
    console.error("sdfsdf", e);
    return null;
  }
};

export const getTokenBalance = async (address) => {
  try {
    if (web3Modal.cachedProvider) {
      provider = await web3Modal.connect();
    } else {
      return null;
    }
    // Get a Web3 instance for the wallet
    const web3 = new Web3(provider);
    const contract_data = await readContractABI(CONTRACT_TYPE.ERC20);
    const wallet_address = await getCurrentWalletAddress();

    const contract = new web3.eth.Contract(contract_data, address);

    const balance = await contract.methods.balanceOf(wallet_address).call();
    return balance;
  } catch (e) {
    console.error("sdfsdf", e);
    return null;
  }
};
