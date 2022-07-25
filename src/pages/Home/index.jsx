import React, { useEffect, useState } from "react";

import WelcomeSection from "./Sections/WelcomeSection";
import ButtonBar from "./Sections/ButtonBar";
import styles from "./Home.module.scss";
import FeaturedArtist from "./Sections/FeaturedArtist";
import TopCollection1 from "./Sections/TopCollection1";
import TopCollection2 from "./Sections/TopCollection2";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchHomepageContent,
  fetchCollectionByCategory,
} from "src/store/app/actions";

const HomePage = (props) => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("All");
  const [subTypes, setSubTypes] = useState([]);
  const homepageContents = useSelector((state) => state.app.contents);
  const categories = useSelector((state) => state.contract.categories);
  const collectionsByCategory = useSelector(
    (state) => state.app.collectionsByCategory
  );

  console.log(collectionsByCategory);
  useEffect(() => {
    dispatch(fetchHomepageContent(keyword));
    dispatch(fetchCollectionByCategory(1));
  }, []);

  useEffect(() => {
    setSubTypes(categories?.filter((item) => item.parent_id != 0));
  }, [categories]);

  let topCollection = null,
    topLeftCollection = null,
    topRightCollection = null,
    mainCollection1 = null,
    mainCollection2 = null;
  for (let i = 0; i < homepageContents?.length; i++) {
    const item = homepageContents[i];
    if (item.mode == "Top") {
      topCollection = item;
    }
    if (item.mode == "Top_right") {
      topRightCollection = item;
    }
    if (item.mode == "Top_left") {
      topLeftCollection = item;
    }
    if (item.mode == "Main_1") {
      mainCollection1 = item;
    }
    if (item.mode == "Main_2") {
      mainCollection2 = item;
    }
  }

  const handleClicked = (eve, id) => {
    if (id == 1) {
      setSubTypes(categories?.filter((item) => item.parent_id != 0));
      dispatch(fetchCollectionByCategory(id));
      return;
    }
    setSubTypes(
      categories?.filter((item) => item.id != 0 && item.parent_id == id)
    );
    dispatch(fetchCollectionByCategory(id));
  };

  const onSubClicked = (eve, id) => {
    dispatch(fetchCollectionByCategory(id));
  };

  return (
    <main className={styles.homepage}>
      <WelcomeSection
        topCollection={topCollection}
        topLeftCollection={topLeftCollection}
        topRightCollection={topRightCollection}
        history={props.history}
      />
      <ButtonBar
        categories={categories?.filter((item) => item.parent_id == 0)}
        onClicked={(eve, id) => handleClicked(eve, id)}
      />

      <FeaturedArtist
        subCategories={subTypes}
        onSubClicked={(eve, id) => onSubClicked(eve, id)}
      />
      <TopCollection1
        key={111}
        collectionDatas={collectionsByCategory}
        history={props.history}
      />
    </main>
  );
};

export default HomePage;
