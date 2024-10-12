import React from 'react';
import './UnderlineBtn.css';

function UnderlineBtn({ text, subText, onClick }) {
  return (
    <div className="underlineBtnContainer">
      <div className="underlineBtnsubText">{subText}</div>
      <button type="submit" className="underlineBtn" onClick={onClick}>
        {text}
      </button>
    </div>
  );
}

export default UnderlineBtn;
