// gallery component for displaying the user gallery
import React, { Component } from "react";
// import closeImg from '../assets/images/close.png';
import "../styles/register.css";
import { connect } from "react-redux";

// material-ui components
import { Grid, Row, Col } from "react-flexbox-grid";
import { Card } from "material-ui/Card";
import { Link } from "react-router-dom";

function Gallery({ regData }) {
  // renders the list of user obtained
  return (
    <Col xs={12} md={12}>
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
    </Col>
  );
}

function mapStateToProps(state) {
  return {
    regData: state.regData,
  };
}

export default connect(mapStateToProps)(Gallery);
