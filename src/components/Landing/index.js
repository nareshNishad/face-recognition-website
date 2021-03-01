import React from "react";
import { useHistory } from "react-router-dom";
import "./landing.css";

// images being used
import detectImg from "../../assets/images/detect-img.jpg";
import registerImg from "../../assets/images/register-img.jpg";
import galleryImg from "../../assets/images/gallery-img.jpg";

import Card from "../Card";

const LandingPage = () => {
  let history = useHistory();
  return (
    <div className="landing_container">
      <div className="content">
        <h1>YOUR FACE IS YOUR IDENTITY</h1>
        <p>
          This application allows the user to capture an image and use facial
          recognition to recognize the face whose data has been captured
        </p>
        <p>
          <b>Register. Detect. Check.</b>
        </p>
      </div>
      <div className="card_main_container">
        <div className="card_container">
          <Card
            img={detectImg}
            title="Recognize Face"
            handleClick={() => history.push("/recognize")}
            buttonTitle="Recognize"
          />
        </div>
        <div className="card_container">
          <Card
            img={registerImg}
            title="Register Face"
            handleClick={() => history.push("/register")}
            buttonTitle="Register"
          />
        </div>
        <div className="card_container">
          <Card
            img={galleryImg}
            title="Face Gallery"
            handleClick={() => history.push("/gallery")}
            buttonTitle="Gallery"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
