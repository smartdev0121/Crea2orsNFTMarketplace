import React, { useEffect, useState } from "react";

import WelcomeSection from "./Sections/WelcomeSection";
import ButtonBar from "./Sections/ButtonBar";
import styles from "./Home.module.scss";
import FeaturedArtist from "./Sections/FeaturedArtist";
import TopCollection1 from "./Sections/TopCollection1";
import TopCollection2 from "./Sections/TopCollection2";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomepageContent } from "src/store/app/actions";

const HomePage = (props) => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("All");
  const homepageContents = useSelector((state) => state.app.contents);

  useEffect(() => {
    dispatch(fetchHomepageContent(keyword));
  }, []);

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

  return (
    <main className={styles.homepage}>
      <WelcomeSection
        topCollection={topCollection}
        topLeftCollection={topLeftCollection}
        topRightCollection={topRightCollection}
        history={props.history}
      />
      <ButtonBar />

      <FeaturedArtist />
      <TopCollection1
        key={111}
        mainCollection1={mainCollection1}
        history={props.history}
      />
      <TopCollection2
        key={112}
        mainCollection2={mainCollection2}
        history={props.history}
      />
    </main>
  );
};

export default HomePage;
