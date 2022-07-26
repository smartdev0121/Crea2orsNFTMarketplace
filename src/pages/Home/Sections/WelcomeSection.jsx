import { Box } from "@mui/material";
import MViewCollection from "../../../components/MViewCollection";

const WelcomeSection = ({
  topCollection,
  topRightCollection,
  topLeftCollection,
  history,
}) => {
  return (
    <Box className="section-welcome container">
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
