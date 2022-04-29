import React from "react";
import * as PropTypes from "prop-types";
import ReactCropper from "react-cropper";
import { Button, Modal, Row, Col } from "react-bootstrap";
import Slider from "rc-slider";

// Utils
import { getFileInfo } from "./utils";

// Styles
import "cropperjs/dist/cropper.css";
import "rc-slider/assets/index.css";

/**
 * CropperModel `props` type
 * @type {Object}
 */

/** CropperModel functional component */
function CropperModel(props) {
  const { labels, file } = props;
  const [cropper, setCropper] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [zoom, setZoom] = React.useState(props.initialZoom);
  const [rotate, setRotate] = React.useState(props.initialRotate);

  React.useEffect(() => {
    if (file !== null) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImage(reader.result);
        cropper &&
          cropper.zoomTo(props.initialZoom).rotateTo(props.initialRotate);
      });
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setCropper(null);
    }
  }, [props, file, cropper]);

  /**
   * Crop image
   * @returns {void}
   * @event {Props:onConfirm}
   */
  const onConfirm = () => {
    if (!cropper) {
      return;
    }

    const croppedCanvas = {
      minWidth: 854,
      maxWidth: 1200,
      minHeight: 480,
      maxHeight: 600,
      imageSmoothingQuality: "medium",
      ...props.croppedCanvasProps,
    };

    const canvasData = cropper.getCroppedCanvas(croppedCanvas);

    const fileInfo = getFileInfo(file, props.mime);

    canvasData.toBlob(
      (blob) => {
        const croppedFile = new File([blob], fileInfo.filename, {
          type: blob.type,
          lastModified: new Date(),
        });
        typeof props.onConfirm === "function" && props.onConfirm(croppedFile);
        typeof props.onCompleted === "function" && props.onCompleted();
        setImage(null);
        setCropper(null);
      },
      fileInfo.mime,
      props.quality
    );
  };

  const handleClose = () => {
    setCropper(false);
    setImage(null);
    typeof props.onDiscard === "function" && props.onDiscard(file);
    typeof props.onCompleted === "function" && props.onCompleted();
  };

  return (
    <Modal
      show={!!file && !!image}
      onHide={handleClose}
      animation={false}
      size="xl"
      {...props.modalProps}
    >
      <Modal.Header closeButton>
        <Modal.Title>{labels.heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {image && (
          <ReactCropper
            src={image}
            style={{ height: 500, width: "100%" }}
            initialAspectRatio={16 / 9}
            viewMode={1}
            dragMode="move"
            cropBoxResizable={false}
            cropBoxMovable={false}
            center={true}
            toggleDragModeOnDblclick={false}
            checkOrientation={true}
            onInitialized={(instance) => setCropper(instance)}
            minCropBoxWidth={854}
            minCropBoxHeight={480}
            {...props.cropperProps}
          />
        )}
      </Modal.Body>
      <Modal.Footer className="d-block">
        <Row>
          <Col xs={6}>
            <div
              className="float-left mb-4 d-block"
              style={{ width: 200, marginRight: "65px" }}
            >
              <small>{labels.zoom}</small>{" "}
              <Slider
                min={0}
                step={0.1}
                max={4}
                marks={{
                  0: "0x",
                  1: "1x",
                  2: "2x",
                  3: "3x",
                  4: "4x",
                }}
                value={zoom}
                onChange={(value) => {
                  setZoom(value);
                  cropper.zoomTo(value);
                }}
              />
            </div>
            <div className="float-left mb-3 d-block" style={{ width: 200 }}>
              <small>{labels.rotate}</small>{" "}
              <Slider
                min={-180}
                max={180}
                marks={{
                  "-180": "-180°",
                  0: "0°",
                  180: "180°",
                }}
                value={rotate}
                onChange={(value) => {
                  setRotate(value);
                  cropper.rotateTo(value);
                }}
              />
            </div>
            <div className="clearfix" />
          </Col>
          <Col
            xs={6}
            style={{
              display: "flex",
              alignSelf: "center",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="primary" className="mr-1" onClick={onConfirm}>
              {labels.confirm}
            </Button>{" "}
            <Button variant="secondary" onClick={handleClose}>
              {labels.discard}
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

CropperModel.propTypes = {
  initialZoom: PropTypes.number,
  initialRotate: PropTypes.number,
  mime: PropTypes.string,
  quality: PropTypes.number,
  file: PropTypes.object,
  labels: PropTypes.shape({
    heading: PropTypes.string,
    confirm: PropTypes.string,
    discard: PropTypes.string,
    zoom: PropTypes.string,
    rotate: PropTypes.string,
  }),
  cropperProps: PropTypes.object,
  modalProps: PropTypes.object,
  croppedCanvasProps: PropTypes.object,
  onDiscard: PropTypes.func,
  onCompleted: PropTypes.func,
};

CropperModel.defaultProps = {
  initialZoom: 0,
  initialRotate: 0,
  mime: null,
  quality: 70,
  labels: {
    heading: "Crop Image",
    confirm: "Confirm",
    discard: "Discard",
    zoom: "Zoom",
    rotate: "Rotate",
  },
  modalProps: {},
  cropperProps: {},
  croppedCanvasProps: {},
  onDiscard: () => {},
  onCompleted: () => {},
};

export default CropperModel;
