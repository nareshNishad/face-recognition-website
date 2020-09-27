import React, { useState } from "react";
import "./App.css";

// material-ui components
import AppBar from "material-ui/AppBar";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";

import { Route, Switch, Link } from "react-router-dom";

import LandingPage from "./components/landing-page";
import Recognize from "./components/recognize";
import Register from "./components/register";

const App = () => {
  const [toggle, setToggle] = useState(false);

  const toggleDrawerMenu = () => {
    setToggle(!toggle);
  };

  const handleClose = () => {
    setToggle(false);
  };

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
      </Drawer>

      <Switch>
        <Route exact path="/" render={(props) => <LandingPage {...props} />} />
        <Route path="/recognize" render={(props) => <Recognize {...props} />} />
        <Route path="/register" render={(props) => <Register {...props} />} />
        <Route path="**" render={(props) => <LandingPage {...props} />} />
      </Switch>
    </div>
  );
};

export default App;
