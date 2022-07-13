import ConfirmEmailModal from "./ConfirmEmailModal";
import { useSelector } from "react-redux";
const MODAL_COMPONENTS = {
  CONFIRM_EMAIL: ConfirmEmailModal,
};

const MRootModal = () => {
  const { modalType, modalProps } = useSelector((state) => state.modal);
  if (!modalType) {
    return <span />;
  }

  const SpecificModal = MODAL_COMPONENTS[modalType];
  return <SpecificModal {...modalProps} />;
};
export default MRootModal;
