import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import MViewCollection from "../../../components/MViewCollection";

const WelcomeSection = ({ homepageContent, history }) => {
  const [topCollection, setTopCollection] = useState(null);
  const [topRightCollection, setTopRightCollection] = useState(null);
  const [topLeftCollection, setTopLeftCollection] = useState(null);

  useEffect(() => {
    console.log(homepageContent);
    console.log(homepageContent?.filter((item) => item.mode == "Top")[0]);
    setTopCollection(homepageContent?.filter((item) => item.mode == "Top")[0]);
    setTopRightCollection(
      homepageContent?.filter((item) => item.mode == "Top_left")[0]
    );
    setTopLeftCollection(
      homepageContent?.filter((item) => item.mode == "Top_right")[0]
    );
  }, [homepageContent]);
  return (
    <Box className="section-welcome" sx={{ width: "90%", margin: "0 auto" }}>
      <div className="welcome-image">
        <div className="top-collection pulse">
          <img
            src={
              topCollection
                ? topCollection?.Collections.image_url
                : "/images/home/visual.png"
            }
            alt="Visual"
          />
          <MViewCollection
            category={topCollection?.Collections.category}
            name={topCollection?.Collections.name}
            contractAddress={topCollection?.Collections.contract_address}
            id={topCollection?.Collections.id}
            history={history}
          />
        </div>

        <div className="small-banner-collection">
          <div className="top-collection">
            <img
              src={
                topLeftCollection
                  ? topLeftCollection?.Collections.image_url
                  : "/images/home/visual.png"
              }
              alt="Visual"
            />
            <MViewCollection
              category={topLeftCollection?.Collections.category}
              name={topLeftCollection?.Collections.name}
              contractAddress={topLeftCollection?.Collections.contract_address}
              id={topLeftCollection?.Collections.id}
              history={history}
            />
          </div>
          <div className="top-collection">
            <img
              src={
                topRightCollection
                  ? topRightCollection?.Collections.image_url
                  : "/images/home/visual.png"
              }
              alt="Visual"
            />
            <MViewCollection
              category={topRightCollection?.Collections.category}
              name={topRightCollection?.Collections.name}
              contractAddress={topRightCollection?.Collections.contract_address}
              id={topRightCollection?.Collections.id}
              history={history}
            />
          </div>
        </div>
      </div>
    </Box>
  );
};

export default WelcomeSection;
