import React from 'react';
import './MainVoiceBtn.css';

function MainVoiceBtn({ text, onClick, width, height, fontSize, backgroundColor }) {
  const buttonStyle = {
    width: width ? `${width}` : '304px',
    height: height ? `${height}` : '87px',
    fontSize: fontSize ? `${fontSize}` : '36px',
    backgroundColor: backgroundColor || '#1E1E1E',
  };

  return (
    <div className="mainVoiceBtnContainer">
      <button type="submit" className="mainVoiceBtn" onClick={onClick} style={buttonStyle}>
        {text}
      </button>
    </div>
  );
}

export default MainVoiceBtn;
