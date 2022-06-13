import Web3 from "web3";

import { CONTRACT_TYPE } from "src/config/global";
import { uploadContractMetadata, uploadAssetMetaData } from "./pinata";
import web3Modal, { getCurrentWalletAddress, switchNetwork, signMsg } from "./wallet";
import { showNotify } from "./notify";
import "dotenv/config";
const contract_source_arr = [
  "/Crea2orsContracts/compiled/Crea2orsNFT/Crea2orsNFT",
  "/Crea2orsContracts/compiled/CR2/CR2",
];

let provider;

const readContractABI = async (contract_type) =>
  new Promise((resolve, reject) => {
    let contract_data;
    let contract_source = contract_source_arr[contract_type];

    fetch(`${contract_source}.abi`)
      .then((response) => response.text())
      .then((data) => {
        contract_data = JSON.parse(data);
        return resolve(contract_data);
      })
      .catch((e) => {
        return reject();
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

export const holdEvent = async (eventName, contractAddress) =>
  new Promise(async (resolve, reject) => {
    if (web3Modal.cachedProvider) {
      provider = await web3Modal.connect();
    } else {
      return reject(null);
    }
    const web3 = new Web3(provider);
    let latest_block = await web3.eth.getBlockNumber();
    let historical_block = latest_block - 10000;
    const contract_data = await readContractABI(0);
    const contract = new web3.eth.Contract(contract_data, contractAddress);
    console.log("block", latest_block, historical_block, contract);
    const events = await contract.getPastEvents(eventName, {
      fromBlock: historical_block,
      toBlock: "latest",
    });
    return resolve(events);
  });

export const getValuefromEvent = async (eventData, myAccount) => {
  let curData;
  for (let i = 0; i < eventData.length; i++) {
    let sender = eventData[i]["returnValues"]["to"];
    if (sender == myAccount) {
      curData = eventData[i]["returnValues"];
    }
  }
  return curData;
};

export const deployContract = (contract_type, contract_metadata) =>
  new Promise(async (resolve, reject) => {
    try {
      const { name, tokenLimit, symbol } = contract_metadata;

      if (tokenLimit > process.env.REACT_APP_TOKEN_LIMI)
        return reject("Can't mint more than 10");

      const { contract_uri, image_uri } = await uploadContractMetadata(
        contract_metadata
      );

      if (web3Modal.cachedProvider) {
        provider = await web3Modal.connect();
      } else {
        return reject("Cannot connect to wallet");
      }

      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();

      const bytecode = await readContractByteCode(contract_type);
      const contract_data = await readContractABI(contract_type);

      const contract = new web3.eth.Contract(contract_data);

      contract
        .deploy({
          data: bytecode,
          arguments: [
            name,
            symbol,
            contract_uri,
            process.env.REACT_APP_BATCH_SIZE,
            tokenLimit,
          ],
        })
        .send({ from: accounts[0] })
        .then(async (deployment) => {
          return resolve({
            contractAddress: deployment.options.address,
            contractUri: contract_uri,
            imageUri: image_uri,
          });
        })
        .catch((e) => {
          return reject();
        });
    } catch (e) {
      console.log(e);
      showNotify("Failed", "Failed", "failed", 3);
      return reject("Could not deploy smart contract");
    }
  });

export const createVoucher = (metaDataUri, fileUri, price = -1, royaltyFee,batchSize, from) => 
  new Promise(async(resolve, reject) => {
  const voucher = {metaDataUri, price, royaltyFee, batchSize};
  const msgParams = [
    {
      type: "string",
      name: 'metaDataUri',
      value: metaDataUri,
    },
    {
      type: "uint32",
      name: 'price',
      value: price,
    },{
      type: "uint32",
      name: "fee",
      value: royaltyFee
    }, {
      type: "uint32",
      name: "batchSize",
      value: batchSize,
    }
  ]
  const signature = await signMsg(msgParams, from);
  console.log("signature", signature);
  return signature ? resolve(signature) : reject();
});

export const createNFT = (metadata) =>
  new Promise(async (resolve, reject) => {
    try {
      const { metadata_uri, file_uri } = await uploadAssetMetaData(metadata);
      return resolve({ metaDataUri: metadata_uri, fileUri: file_uri });
    } catch (e) {
      console.log(e);
      return reject();
    }
  });

export const mintAsset = (contract_type, contract_address, metadata) =>
  new Promise(async (resolve, reject) => {
    try {
      if (web3Modal.cachedProvider) {
        provider = await web3Modal.connect();
      } else {
        provider = await web3Modal.connect();
        window.location.reload();
      }

      const web3 = new Web3(provider);

      const { metadata_uri, file_uri } = await uploadAssetMetaData(metadata);

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
          .create(
            Number(metadata.batchSize),
            wallet_address,
            Number(metadata.royaltyFee),
            metadata_uri,
            []
          )
          .send(tx);
      }

      showNotify("Success", "Successfully minted", "success", 3);

      return resolve({ metaDataUri: metadata_uri, fileUri: file_uri });
    } catch (e) {
      console.log(e);
      showNotify("Failed", "Failed", "failed", 3);
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

      showNotify("Waiting", "Waiting ...", "waiting");

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

      showNotify("Success", "Successfully updated", "success", 3);

      return resolve({ success: true });
    } catch (e) {
      showNotify("Failed", "Failed", "failed", 3);
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

      showNotify("Waiting", "Waiting ...", "waiting");

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

      showNotify("Success", "Successfully updated", "success", 3);

      return resolve({ success: true });
    } catch (e) {
      showNotify("Failed", "Failed", "failed", 3);
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

      showNotify("Waiting", "Waiting ...", "waiting");

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
      showNotify("Success", "Successfully sent", "success", 3);

      return resolve();
    } catch (e) {
      showNotify("Failed", "Failed", "failed", 3);
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

      showNotify("Waiting", "Waiting ...", "waiting");

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
      showNotify("Success", "Successfully burned", "success", 3);
      return resolve({ success: true });
    } catch (e) {
      showNotify("Failed", "Failed", "failed", 3);
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

      showNotify("Waiting", "Waiting ...", "waiting");

      const contract_data = await readContractABI(CONTRACT_TYPE.ERC1155);
      const current_address = await getCurrentWalletAddress();

      const mContract = new web3.eth.Contract(contract_data, address);

      const tx = {
        from: current_address,
        to: address,
        data: mContract.methods.mint(id, amount, []).encodeABI(),
      };

      await web3.eth.sendTransaction(tx);
      showNotify("Success", "Successfully minted", "success", 3);
      return resolve({ success: true });
    } catch (e) {
      showNotify("Failed", "Failed", "failed", 3);
      return reject();
    }
  });

export const setApprovalForAll = (
  contract_address,
  asset_address,
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

      showNotify("Waiting", "Approving ...", "waiting");

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

      showNotify("Success", "Approved successfully", "success", 3);
      return resolve({ success: true });
    } catch (e) {
      showNotify("Failed", "Failed", "failed", 3);
      return reject();
    }
  });

export const approve = (
  contract_address,
  asset_address,
  amount,
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

      showNotify("Waiting", "Approving ...", "waiting");

      const contract_data = await readContractABI(contract_type);
      const current_address = await getCurrentWalletAddress();

      const mContract = new web3.eth.Contract(contract_data, asset_address);

      const tx = {
        from: current_address,
        to: asset_address,
        data: mContract.methods.approve(contract_address, amount).encodeABI(),
      };

      await web3.eth.sendTransaction(tx);

      showNotify("Success", "Approved successfully", "success", 3);
      return resolve({ success: true });
    } catch (e) {
      showNotify("Failed", "Failed", "failed", 3);
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
