import React from 'react';
import './UnderlineVoiceBtn.css';

function UnderlineVoiceBtn({ text, subText, onClick }) {
  return (
    <div className="underlineVoiceBtnContainer">
      <div className="underlineVoiceBtnsubText">{subText}</div>
      <button type="submit" className="underlineVoiceBtn" onClick={onClick}>
        {text}
      </button>
    </div>
  );
}

export default UnderlineVoiceBtn;
