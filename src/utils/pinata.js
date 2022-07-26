import axios from "axios";
import showNotification from "src/config/notification";

// const pinata_gateway_url = "https://nftymeta.mypinata.cloud/ipfs/";
const pinata_gateway_url = "https://crea2ors.mypinata.cloud/ipfs/";

export const uploadContractMetadata = async (mt) =>
  new Promise(async (resolve, reject) => {
    try {
      let pinata_image_response = null;

      if (mt.file) {
        showNotification("Waiting", "Uploading Attachment Image...", "waiting");
        console.log("File uploading to IPFS...");
        pinata_image_response = await pinFileToIPFS(mt.file);
        if (!pinata_image_response.success) {
          console.log("File UPLOAD failed");
          showNotification("Failed", "Uploading Image Failed", "failed", 3);
          return reject();
        }
      }
      console.log("PINATA image URL", pinata_image_response?.pinataUrl);
      showNotification("Waiting", "Uploading Metadata...", "waiting");

      let metadata = {
        ...mt,
        image_url: pinata_image_response?.pinataUrl || mt.ImageUrl,
      };

      const pinata_response = await pinJSONToIPFS(metadata);
      if (!pinata_response.success) {
        showNotification("Failed", "Uploading Metadata Failed", "failed", 2000);
        return reject();
      }

      return resolve({
        contract_uri: pinata_response.pinataUrl,
        image_uri: pinata_image_response?.pinataUrl,
      });
    } catch (e) {
      return reject();
    }
  });

export const fetchMetaData = (uri) => {
  return new Promise(async (resolve, reject) => {
    try {
      axios
        .get(uri)
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => reject("Can't fetch metadata"));
    } catch (err) {
      return reject("Connection problem is occured!");
    }
  });
};

export const uploadAssetMetaData = async (mt) =>
  new Promise(async (resolve, reject) => {
    // upload image to IPFS

    try {
      let pinataImageResponse;

      showNotification("Waiting", "Uploading Attachment Files...", "waiting");

      if (mt.file) {
        pinataImageResponse = await pinFileToIPFS(mt.file);
        if (!pinataImageResponse.success) {
          showNotification("Failed", "Uploading Image Failed", "failed", 3);
          return reject();
        }
      }

      showNotification("Waiting", "Uploading Metadata...", "waiting");

      // make metadata
      let metadata = {
        ...mt,
        fileUrl: pinataImageResponse?.pinataUrl,
      };

      // const attributes = mt.Traits?.filter(
      //   (item) => item.display_type && item.value
      // ).map((item) => {
      //   if (item.display_type === "text") {
      //     delete item.display_type;
      //   } else if (item.display_type === "number") {
      //     item.value = Number(item.value);
      //   }
      //   return item;
      // });

      // metadata.attributes = attributes;
      //make pinata call
      const pinataResponse = await pinJSONToIPFS(metadata);
      if (!pinataResponse.success) {
        showNotification("Failed", "Uploading Metadata Failed", "failed", 2000);
        return reject();
      }
      const tokenURI = pinataResponse.pinataUrl;

      return resolve({
        file_uri: pinataImageResponse?.pinataUrl,
        metadata_uri: tokenURI,
      });
    } catch (err) {
      console.log(err);
      return reject();
    }
  });

const pinJSONToIPFS = async (JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
      },
    })
    .then(function (response) {
      return {
        success: true,
        pinataUrl: pinata_gateway_url + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      return { success: false, message: error.message };
    });
};

const pinFileToIPFS = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  // prepare form data
  let data = new FormData();

  data.append("file", file);

  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: "FRA1",
          desiredReplicationCount: 1,
        },
        {
          id: "NYC1",
          desiredReplicationCount: 2,
        },
      ],
    },
  });

  data.append("pinataOptions", pinataOptions);

  return axios
    .post(url, data, {
      maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
      },
    })
    .then(function (response) {
      //handle response here
      return {
        success: true,
        pinataUrl: pinata_gateway_url + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      //handle error here
      return {
        success: false,
        status: "Something went wrong: " + error.message,
      };
    });
};
