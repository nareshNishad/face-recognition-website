import React from "react";
import "./card.css";

function Button({ handleClick, buttonTitle }) {
  return (
    <button className="custom_button" onClick={handleClick}>
      {buttonTitle}
    </button>
  );
}

function Card({ img, title, handleClick, buttonTitle }) {
  return (
    <div className="card_container">
      <img src={img} className="card_image" />
      <div className="card_bottom">
        <h5>{title}</h5>
        <Button handleClick={handleClick} buttonTitle={buttonTitle} />
      </div>
    </div>
  );
}

export default Card;
