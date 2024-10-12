import React, { useState, useEffect } from "react";
import "./AnswerComponent.css";
import TextComponent from "./TextComponent";
import BoxComponent from "./BoxComponent";

function AnswerComponent({ word, about_word, answer }) {
  return (
    <div className="solution">
      <div className="solution-main">핵심 단어 - {word}</div>
      <div className="solution-sub">{about_word}</div>

      <div className="solution-main">
        정답 문장 <br />
      </div>
      <div className="solution-sub">{answer}</div>
    </div>
  );
}

export default AnswerComponent;
