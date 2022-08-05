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
  const [keyword, setKeyword] = useState(1);
  const [subTypes, setSubTypes] = useState([]);
  const homepageContents = useSelector((state) => state.app.contents);
  console.log(homepageContents);
  const categories = useSelector((state) => state.contract.categories);

  const collectionsByCategory = useSelector(
    (state) => state.app.collectionsByCategory
  );

  console.log(collectionsByCategory);
  useEffect(() => {
    homepageContents.filter((item) => item.category == 1);
    dispatch(fetchHomepageContent());
    dispatch(fetchCollectionByCategory(1));
  }, []);

  useEffect(() => {
    setSubTypes(categories?.filter((item) => item.parent_id != 0));
  }, [categories]);

  const handleClicked = (eve, id) => {
    console.log(id);
    setKeyword(id);
    // if (id == 1) {
    //   setSubTypes(categories?.filter((item) => item.parent_id != 0));
    //   dispatch(fetchCollectionByCategory(id));
    //   return;
    // }
    // setSubTypes(
    //   categories?.filter((item) => item.id != 0 && item.parent_id == id)
    // );
    // dispatch(fetchCollectionByCategory(id));
  };

  // const onSubClicked = (eve, id) => {
  //   dispatch(fetchCollectionByCategory(id));
  // };

  return (
    <main className={styles.homepage}>
      <WelcomeSection
        homepageContent={homepageContents.filter((item) => item.category == 1)}
        history={props.history}
      />
      <ButtonBar
        categories={categories?.filter((item) => item.parent_id == 0)}
        onClicked={(eve, id) => handleClicked(eve, id)}
      />
      {/*
      <FeaturedArtist
        subCategories={subTypes}
        onSubClicked={(eve, id) => onSubClicked(eve, id)}
      /> */}
      {console.log(
        "updated",
        homepageContents.filter((item) => item.category == keyword)
      )}
      <WelcomeSection
        homepageContent={homepageContents.filter(
          (item) => item.category == keyword
        )}
        history={props.history}
      />
      {/* <TopCollection1
        key={111}
        collectionDatas={collectionsByCategory}
        history={props.history}
      /> */}
    </main>
  );
};

export default HomePage;
