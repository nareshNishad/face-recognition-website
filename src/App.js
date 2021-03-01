import React, { useState } from "react";
import "./App.css";

// material-ui components
import AppBar from "material-ui/AppBar";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";

import { Route, Switch, Link, Redirect } from "react-router-dom";

import LandingPage from "./components/Landing";
import Recognize from "./components/Recognize";
import Register from "./components/Register";
import Gallery from "./components/Gallery";

import {
  loadFaceRecognitionModel,
  loadSsdMobilenetv1Model,
  loadFaceLandmarkModel,
  loadTinyFaceDetectorModel,
  loadFaceLandmarkTinyModel,
} from "face-api.js";

const App = () => {
  const [toggle, setToggle] = useState(false);

  const toggleDrawerMenu = () => {
    setToggle(!toggle);
  };

  const handleClose = () => {
    setToggle(false);
  };

  React.useEffect(() => {
    async function fetchModal() {
      Promise.all([
        loadTinyFaceDetectorModel("/models"),
        loadFaceLandmarkTinyModel("/models"),
        loadSsdMobilenetv1Model("/models"),
        loadFaceLandmarkModel("/models"),
        loadFaceRecognitionModel("/models"),
      ]);
    }
    fetchModal();
  }, []);

  return (
    <div>
      <AppBar
        className="app-bar"
        title="CAMERIA"
        onLeftIconButtonClick={() => toggleDrawerMenu()}
        zDepth={2}
      />
      <Drawer
        docked={false}
        width={200}
        open={toggle}
        onRequestChange={(toggle) => setToggle(toggle)}
      >
        <Link to={"/"} className="link">
          <MenuItem onClick={() => handleClose()}>Home</MenuItem>
        </Link>
        <Link to={"/recognize"} className="link">
          <MenuItem onClick={() => handleClose()}>Recognize</MenuItem>
        </Link>
        <Link to={"/register"} className="link">
          <MenuItem onClick={() => handleClose()}>Register</MenuItem>
        </Link>
        <Link to={"/gallery"} className="link">
          <MenuItem onClick={() => handleClose()}>Gallery</MenuItem>
        </Link>
      </Drawer>

      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/recognize" component={Recognize} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/gallery" component={Gallery} />
        <Redirect component={LandingPage} />
      </Switch>
    </div>
  );
};

export default App;
