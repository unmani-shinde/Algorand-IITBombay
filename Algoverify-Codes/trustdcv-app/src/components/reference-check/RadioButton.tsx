import React, { useState } from "react";
import "./RadioButton.css";
export interface IRadioButtonProps {
  answer: any;
  setAnswer: any;
}
function RadioButton({ answer, setAnswer }: IRadioButtonProps) {
  const handleClickYes = () => {
    setAnswer(true);
  };
  const handleClickNo = () => {
    setAnswer(false);
  };
  return (
    <div className="radioButtonContainer">
      <button
        type="button"
        className={answer === true ? "yesbtn active" : "yesBtn"}
        onClick={handleClickYes}
      >
        Yes
      </button>
      <button
        type="button"
        className={answer === false ? "nobtn active" : "noBtn"}
        onClick={handleClickNo}
      >
        No
      </button>
    </div>
  );
}

export default RadioButton;
