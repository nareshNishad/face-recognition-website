import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import "../styles/register.css";

// material-ui component
import RaisedButton from "material-ui/RaisedButton";
import RefreshIndicator from "material-ui/RefreshIndicator";

import { Grid, Row, Col } from "react-flexbox-grid";
import axios from "axios";

import { connect } from "react-redux";
import { recognizeUser, clearDisplayData } from "../actions";

import UserRecognize from "./user-recognize";

// loader styling
const style = {
  container: {
    position: "absolute",
  },
  refresh: {
    display: "inline-block",
    position: "absolute",
  },
  hide: {
    display: "none",
    position: "absolute",
  },
};

const Recognize = () => {
  const [load, setLoad] = useState(false);
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    clearDisplayData();
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const reset = () => {
    setImgSrc(null);
  };

  return (
    <Grid fluid>
      <Row>
        <Col xs={12} md={4} mdOffset={4}>
          <div style={{ textAlign: "center" }}>
            <h3>DETECT FACE</h3>
            {!imgSrc && (
              <Webcam
                audio={false}
                height={320}
                ref={webcamRef}
                screenshotFormat="image/png"
                width={320}
              />
            )}

            {imgSrc && <img src={imgSrc} />}
            <RefreshIndicator
              className="css-loader"
              size={80}
              left={70}
              top={0}
              loadingColor="#ADD8E6"
              status="loading"
              style={load === false ? style.hide : style.refresh}
            />
            <br />
            {imgSrc && (
              <RaisedButton
                onClick={reset}
                label="RESET"
                primary={true}
                style={{ margin: 16 }}
              />
            )}
            <RaisedButton
              onClick={capture}
              label="DETECT"
              primary={true}
              style={{ margin: 16 }}
            />
            {/* <UserRecognize detect={props.detData} /> */}
          </div>
        </Col>
      </Row>
    </Grid>
  );
};

function mapStateToProps(state) {
  console.log({ state });
  return {
    detData: state.detData,
  };
}

export default connect(mapStateToProps, { recognizeUser, clearDisplayData })(
  Recognize
);
