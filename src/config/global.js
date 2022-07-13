export const CONTRACT_TYPE = {
  ERC1155: 0,
  ERC20: 1,
  MANAGER: 2,
};

export const TRANSACTION_TYPE = [
  "ContractDeployed",
  "TokenURIChanged",
  "ContractURIChanged",
  "Transfer",
  "Listing(Fixed)",
  "Listing(Timed Auction)",
  "SellCanceled",
  "SellFinished",
  "AuctionCanceled",
  "AuctionFinished",
  "TransferSingle",
  "TransferBatch",
  "Bid",
  "OfferMade",
  "OfferAccepted",
  "OfferCanceled",
];

export const CURRENCYDECIMAL = 9;

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
