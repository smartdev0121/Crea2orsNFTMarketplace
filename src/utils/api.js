import api from "src/utils/axios";
import { convert } from "src/utils/config";

const api_url = "";

const apiGetResponse = (url) =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await api.get(url);
      return resolve(res);
    } catch {
      return reject();
    }
  });

export const apiGetWhitelist = async () => {
  const url = `${api_url}/users`;

  try {
    const res = await apiGetResponse(url);
    return res;
  } catch {
    return {};
  }
};

export const apiGetCollections = async (wallet_address = null) => {
  const url = wallet_address
    ? `${api_url}/collections/wallet/${wallet_address}`
    : `${api_url}/collections`;

  try {
    const res = await apiGetResponse(url);
    return res;
  } catch {
    return [];
  }
};

export const apiGetCollectionInfo = async (contract_address, network_id) => {
  const url = `${api_url}/collections/contract-address/${network_id}/${contract_address}`;

  try {
    const res = await apiGetResponse(url);
    return res;
  } catch {
    return {};
  }
};

export const apiGetCollectionInfoById = async (collection_id) => {
  const url = `${api_url}/collections/${collection_id}`;

  try {
    const res = await apiGetResponse(url);
    return res;
  } catch {
    return null;
  }
};

export const apiGetOwnerAssets = async (wallet_address = null) => {
  const url = `${api_url}/assets/owner/${wallet_address}`;

  try {
    const response = await apiGetResponse(url);
    let assets = [];

    for (let asset of response) {
      const collection = await apiGetCollectionInfoById(asset.CollectionId);

      assets.push({ ...asset, Collection: collection });
    }

    return assets;
  } catch {
    return [];
  }
};

export const apiGetAssets = async (
  contract_address = null,
  chain_id = null
) => {
  const url = contract_address
    ? `${api_url}/assets/${chain_id}/${contract_address}`
    : `${api_url}/assets`;

  try {
    const response = await apiGetResponse(url);
    let assets = [];

    for (let asset of response) {
      const collection = await apiGetCollectionInfoById(asset.CollectionId);

      assets.push({ ...asset, Collection: collection });
    }

    return assets;
  } catch {
    return [];
  }
};

export const apiGetAsset = async (contract_address, chain_id, token_id) => {
  const url = `${api_url}/assets/${chain_id}/${contract_address}/${token_id}`;

  try {
    const asset = await apiGetResponse(url);

    for (let order of asset.Orders) {
      order.BuyerPrice = convert(order.BuyerPrice);
      order.Price = convert(order.Price);
    }

    return asset;
  } catch {
    return {};
  }
};

export const apiGetSearchResult = async (term) => {
  const url = `${api_url}/search/search?keyword=${term}`;

  try {
    const searchResults = await apiGetResponse(url);
    return searchResults;
  } catch {
    return null;
  }
};

export const apiGetAccountInfo = async (wallet_address) => {
  const url = `${api_url}/users/${wallet_address}`;

  try {
    const result = await apiGetResponse(url);
    return result;
  } catch {
    return null;
  }
};

export const apiCreateORUpdateAccount = async (account_info) => {
  const url = `${api_url}/users`;

  try {
    let data = new FormData();

    data.append("Photo", account_info.file);
    data.append("Wallet", account_info.Wallet);
    data.append("Name", account_info.Name);
    data.append("Description", account_info.Description);
    data.append("Role", "1");

    const res = await api.post(url, data);
    return res;
  } catch {
    return null;
  }
};
