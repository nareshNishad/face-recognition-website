import React, { useEffect, useState, useRef, useCallback } from "react";
import "../styles/register.css";

import { Grid, Row, Col } from "react-flexbox-grid";

import { connect } from "react-redux";
import { registerUser } from "../actions";

import {
  detectSingleFace,
  TinyFaceDetectorOptions,
  resizeResults,
  matchDimensions,
  draw,
  fetchImage,
} from "face-api.js";

// material-ui components
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import RefreshIndicator from "material-ui/RefreshIndicator";

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

const Register = ({ dispatch }) => {
  const [username, setUserName] = useState("");
  const [video, setVideo] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [camera, setCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setVideo(videoRef.current);
    setCanvas(canvasRef.current);
    return () => {
      stopCamera();
    };
  }, []);

  const start = async () => {
    await launchCamera();
    const recognition = makeRecognition();
    await recognition.init();
    recognition.start();
  };

  const getFaceDetectorOptions = () =>
    new TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

  const makeRecognition = () => {
    let ctx;

    const init = async () => {
      setLoading(true);
      ctx = canvas.getContext("2d");
    };

    const start = async () => {
      await wait(0);
      if (video.readyState === 4) {
        const faces = await detectSingleFace(
          video,
          getFaceDetectorOptions()
        ).withFaceExpressions(true);
        setLoading(false);
        if (faces) {
          const dims = matchDimensions(canvas, video, true);
          const resizedResults = resizeResults(faces, dims);
          if (true) {
            draw.drawDetections(canvas, resizedResults);
            draw.drawFaceExpressions(canvas, resizedResults);
          }
        } else {
          ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
        }
      }
      start();
    };

    return { init, start };
  };

  const launchCamera = () =>
    new Promise((resolve) => {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            mandatory: {
              minWidth: 320,
              maxWidth: 320,
              minHeight: 240,
              maxHeight: 240,
              minFrameRate: 1,
              maxFrameRate: 10,
            },
          },
        })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
          setCamera(true);
          resolve();
        })
        .catch((err) => alert(err));
    });
  const stopCamera = () => {
    const video = document.querySelector("video");
    // A video's MediaStream object is available through its srcObject attribute
    const mediaStream = video.srcObject;
    if (mediaStream) {
      // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
      const tracks = mediaStream.getTracks();
      // Tracks are returned as an array, so if you know you only have one, you can stop it with:
      tracks[0].stop();
      // Or stop all like so:
      tracks.forEach((track) => track.stop());
    }
  };

  const capture = async () => {
    if (username.trim() === "") {
      alert("Username can't be empty");
    } else {
      console.log("Working Fine");
      setLoading(true);
      let canvas = document.querySelector("canvas");
      let ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      let Image = canvas.toDataURL("image/jpg");
      setImage(Image);
      //  check click image contain person
      const img = await fetchImage(Image);
      const fullFaceDescription = await detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!fullFaceDescription) {
        alert(`no faces detected in clicked image please Register again`);
        setLoading(false);
        return;
      }

      dispatch(registerUser({ name: username, img: Image }));
      console.log("face detected");
      setLoading(false);
    }
  };

  const handleUsername = (e) => {
    setUserName(e.target.value);
  };

  const resetGallery = () => {
    setImage(null);
  };

  return (
    <Grid fluid>
      <Row>
        <Col xs={12} md={4} mdOffset={4}>
          <div style={{ textAlign: "center" }}>
            <h3>REGISTER FACE</h3>
            {!camera && (
              <RaisedButton
                className="register-button"
                onClick={() => {
                  start();
                }}
                label="Start Camera"
                primary={true}
                style={{ margin: 16 }}
              />
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <video style={{ position: "absolute" }} ref={videoRef} />
              <canvas style={{ position: "absolute" }} ref={canvasRef} />
              <br />
            </div>
            <div style={{ marginTop: "250px" }}>
              <img src={image} />
              <div style={{ margin: "0 auto!important" }}>
                <TextField
                  hintText="provide identification name"
                  floatingLabelText="Username"
                  onChange={(event) => handleUsername(event)}
                />
              </div>
              <br />
              <RefreshIndicator
                className="css-loader"
                size={80}
                left={70}
                top={0}
                loadingColor="#ADD8E6"
                status="loading"
                style={loading === false ? style.hide : style.refresh}
              />
              <br />
              <RaisedButton
                className="register-button"
                onClick={capture}
                label={image ? "REGISTER" : "Capture"}
                primary={true}
                style={{ margin: 16 }}
              />
              {image && (
                <RaisedButton
                  className="register-button"
                  onClick={resetGallery}
                  label="Retake"
                  primary={true}
                  style={{ margin: 16 }}
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Grid>
  );
};

function mapStateToProps(state) {
  return {
    regData: state.regData,
  };
}
const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));
export default connect(mapStateToProps)(Register);
