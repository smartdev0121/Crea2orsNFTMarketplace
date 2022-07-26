import React from "react";
import MColorButtonView from "./MInput/MColorButtonView";

const MViewCollection = ({ name, category, history, contractAddress, id }) => {
  const onCollectionView = () => {
    history.push(`/collection-view/${contractAddress}`);
  };
  return (
    <>
      <div className="view-collection-back"></div>
      <div className="view-collection">
        <h4 className="category-name">
          {category ? category[0]?.name : "EMPTY"}
        </h4>
        <h4 className="collection-name">
          {name || "Landscape of Canadian mountains"}
        </h4>
        <MColorButtonView
          className="view-collection-btn"
          onClick={onCollectionView}
        >
          View Collection
        </MColorButtonView>
      </div>
    </>
  );
};

export default MViewCollection;
