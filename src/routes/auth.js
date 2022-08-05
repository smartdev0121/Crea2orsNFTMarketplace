import CreateCollectionPage from "../pages/CreateCollection/CreateCollectionPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import CollectionView from "../pages/CollectionView";
import CreateNFTPage from "../pages/CreateNFTPage";
import ConnectWallet from "../pages/ConnectWallet";
import HomePage from "../pages/Home";
import NFTView from "../pages/NFTView";
import MyProfile from "../pages/MyProfile";
import EditProfile from "../pages/EditProfile";
import OtherProfile from "../pages/OtherProfile";
import MyCollections from "../pages/MyCollections";
import AllCollections from "../pages/AllCollections";
import MyNFTs from "../pages/MyNFTs";
import CollectionPreview from "../pages/CollectionPreview";
import EmailConfirmed from "../pages/EmailConfirmed";

const routes = [
  {
    path: "/",
    component: HomePage,
    exact: true,
  },
  {
    path: "/collection-preview",
    component: CollectionPreview,
    exact: true,
  },
  {
    path: "/edit-profile",
    component: EditProfile,
    exact: true,
  },
  {
    path: "/my-nfts",
    component: MyNFTs,
    exact: true,
  },
  {
    path: "/all-collections",
    exact: true,
    component: AllCollections,
  },
  {
    path: "/user/:customUrl",
    component: MyProfile,
    exact: true,
  },
  {
    path: "/explore-assets",
    exact: true,
  },
  {
    path: "/collection-view/:contractAddress",
    component: CollectionView,
    exact: true,
  },
  {
    path: "/create-collection",
    component: CreateCollectionPage,
    exact: true,
  },
  {
    path: "/create-nft/:contractAddress/:contractId",
    component: CreateNFTPage,
    exact: true,
  },
  {
    path: "/email-confirm/:token/:email",
    component: EmailConfirmed,
    exact: true,
  },
  {
    path: "/nft-view/:nftId",
    component: NFTView,
    exact: true,
  },
  {
    path: "/create-collection",
    component: CreateCollectionPage,
  },
  {
    path: "/not-found",
    component: NotFoundPage,
  },
  {
    path: "/connect-wallet",
    component: ConnectWallet,
    exact: true,
  },
  {
    path: "/other_user/:customUrl",
    component: OtherProfile,
    exact: true,
  },
  {
    path: "/my-collections",
    component: MyCollections,
    exact: true,
  },
];

export default routes;
