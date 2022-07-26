import React, { useEffect } from "react";
import { MContainer, MBox, MFlexBox } from "src/components/MLayout";
import { MTitle, MDescription } from "src/components/MTextLabels";
import { Add } from "@mui/icons-material";
import MColorButtonView from "src/components/MInput/MColorButtonView";
import MCollectionCard from "src/components/MCards/MCollectionCard";
import { useDispatch, useSelector } from "react-redux";
import { getUserCollections } from "src/store/contract/actions";
import { userStatus } from "src/store/profile/reducer";
import { showNotify } from "src/utils/notify";

const MyCollections = (props) => {
  const dispatch = useDispatch();
  const myCollections = useSelector((state) => state.contract.myCollections);
  const status = useSelector((state) => userStatus(state));

  useEffect(() => {
    dispatch(getUserCollections());
  }, []);

  const onNewCollection = async () => {
    if (!status) {
      showNotify(
        "Your email are not verified yet. Go to the edit profile page and please verify your email."
      );
      return;
    }
    props.history.push("/create-collection");
  };

  return (
    <MContainer maxWidth="xl">
      <MBox>
        <MTitle className="text">My Collections</MTitle>
        <MDescription>You can create, view and mint asset here</MDescription>
        <MColorButtonView onClick={onNewCollection}>
          <Add />
          New collection
        </MColorButtonView>
      </MBox>
      <MFlexBox>
        {myCollections.map((item, index) => {
          return (
            <div data-aos="fade-up">
              <MCollectionCard data={item} key={item.id + index} />
            </div>
          );
        })}
      </MFlexBox>
    </MContainer>
  );
};

export default MyCollections;
