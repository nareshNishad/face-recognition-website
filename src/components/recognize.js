import React, { useState, useEffect, useRef, useCallback } from "react";

import "../styles/register.css";

import {
  detectSingleFace,
  TinyFaceDetectorOptions,
  resizeResults,
  matchDimensions,
  draw,
  loadFaceRecognitionModel,
  loadSsdMobilenetv1Model,
  loadFaceLandmarkModel,
  fetchImage,
  LabeledFaceDescriptors,
  FaceMatcher,
  loadTinyFaceDetectorModel,
  loadFaceLandmarkTinyModel,
  detectAllFaces,
} from "face-api.js";

// material-ui component
import RaisedButton from "material-ui/RaisedButton";
import RefreshIndicator from "material-ui/RefreshIndicator";

import { Grid, Row, Col } from "react-flexbox-grid";

import { connect } from "react-redux";

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

const Recognize = ({ regData }) => {
  const [video, setVideo] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [camera, setCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [person, setPerson] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log("reco", regData);
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

  const labeledFaceDescriptors = async () =>
    Promise.all(
      regData.map(async (label) => {
        // fetch image data from urls and convert blob to HTMLImage element
        const imgUrl = `${label.faceID}`;
        const img = await fetchImage(imgUrl);
        console.log(`${label.name}`);
        // detect the face with the highest score in the image and compute it's landmarks and face descriptor
        const fullFaceDescription = await detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!fullFaceDescription) {
          alert(`no faces detected for ${label.name} please Register again`);
        }

        const faceDescriptors = [fullFaceDescription.descriptor];
        console.log({ faceDescriptors });
        return new LabeledFaceDescriptors(`${label.name}`, faceDescriptors);
      })
    );

  const getFaceDetectorOptions = () =>
    new TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

  const makeRecognition = () => {
    let ctx;

    const init = async () => {
      setLoading(true);
      await loadTinyFaceDetectorModel(`models`);
      await loadFaceLandmarkTinyModel("models");
      await loadSsdMobilenetv1Model("models");
      await loadFaceLandmarkModel("models");
      await loadFaceRecognitionModel("models");
      ctx = canvas.getContext("2d");
    };

    const start = async () => {
      await wait(0);
      let labelData = await labeledFaceDescriptors();
      if (video.readyState === 4) {
        const faces = await detectAllFaces(video, getFaceDetectorOptions())
          .withFaceLandmarks(true)
          .withFaceDescriptors(true);
        setLoading(false);
        if (faces) {
          const dims = matchDimensions(canvas, video, true);
          const resizedResults = resizeResults(faces, dims);
          if (true) {
            draw.drawDetections(canvas, resizedResults);
            console.log({ resizedResults, labelData });
            const maxDescriptorDistance = 0.6;
            if (labelData.length === 0) {
              alert("No image in Gallery First Register Person");
              return;
            }

            if (
              resizeResults.length > 0 &&
              labelData &&
              labelData.length !== 0
            ) {
              console.log("if condition");
              const faceMatcher = new FaceMatcher(
                labelData,
                maxDescriptorDistance
              );

              const results = resizedResults.map((fd) =>
                faceMatcher.findBestMatch(fd.descriptor)
              );

              results.forEach((bestMatch, i) => {
                const text = bestMatch.toString();
                console.log({ text });
                setPerson(text);
              });
            }
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
    // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      // Tracks are returned as an array, so if you know you only have one, you can stop it with:
      tracks[0].stop();
      // Or stop all like so:
      tracks.forEach((track) => track.stop());
    }
  };
  // const capture = async () => {
  //   let canvas = document.querySelector("canvas");
  //   let ctx = canvas.getContext("2d");
  //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  //   let Image = canvas.toDataURL("image/jpg");
  //   console.log({ Image });
  //   setImage(Image);
  //   Image = await fetchImage(Image);
  // };

  return (
    <Grid fluid>
      <Row>
        <Col xs={12} md={4} mdOffset={4}>
          <div style={{ textAlign: "center" }}>
            <h3>DETECT FACE</h3>
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
                marginTop: "20px",
              }}
            >
              <div>
                <video style={{ position: "absolute" }} ref={videoRef} />
                <canvas style={{ position: "absolute" }} ref={canvasRef} />
              </div>
              <br />
            </div>
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
            <div style={{ marginTop: "250px" }}>
              <h3>Detected Person {person}</h3>
              {/* <img src={image} />
              <RaisedButton
                onClick={capture}
                label="DETECT"
                primary={true}
                style={{ margin: 16 }}
              /> */}
            </div>
          </div>
        </Col>
      </Row>
    </Grid>
  );
};

function mapStateToProps(state) {
  console.log({ state });
  return {
    regData: state.regData,
  };
}
const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));
export default connect(mapStateToProps)(Recognize);
