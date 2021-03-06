// gallery component for displaying the user gallery
import React from "react";
// import closeImg from '../assets/images/close.png';
// import "../styles/register.css";
import { connect } from "react-redux";

// material-ui components
import { Card } from "material-ui/Card";
import { Link } from "react-router-dom";

function Gallery({ regData }) {
  // renders the list of user obtained
  return (
    <div>
      {regData.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h3> Empty Gallery </h3>
          <p>
            Register person <Link to={"/register"}> Here</Link> and play with
            applicaton
          </p>
        </div>
      ) : (
        regData.map((person, i) => (
          <Card className="gallery-card">
            <p className="gallery-data">
              <b>{person.name} </b>
              <img src={person.faceID} />
            </p>
          </Card>
        ))
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    regData: state.regData,
  };
}

export default connect(mapStateToProps)(Gallery);
