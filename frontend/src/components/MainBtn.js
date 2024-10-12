import React from 'react';
import './MainBtn.css';

function MainBtn({
  text,
  imgSrc,
  imgAlt,
  imgWidth,
  subText,
  onClick,
  onSubTextClick,
  width,
  height,
  fontSize,
  backgroundColor,
  shadowSize,
}) {
  const buttonStyle = {
    width: width ? `${width}` : '204px',
    height: height ? `${height}` : '72px',
    fontSize: fontSize ? `${fontSize}` : '28px',
    backgroundColor: backgroundColor || '#6ec207',
  };

  const textStyle = {
    textShadow: shadowSize
      ? `-${shadowSize}px 0 0 #2f2f2f, ${shadowSize}px 0 0 #2f2f2f, 0 -${shadowSize}px 0 #2f2f2f, 0 ${shadowSize}px 0 #2f2f2f, -${shadowSize}px -${shadowSize}px 0 #2f2f2f, ${shadowSize}px -${shadowSize}px 0 #2f2f2f, -${shadowSize}px ${shadowSize}px 0 #2f2f2f, ${shadowSize}px ${shadowSize}px 0 #2f2f2f`
      : '',
  };

  const imgStyle = {
    width: imgWidth || '55%',
    height: 'auto',
  };

  return (
    <div className="mainBtnContainer">
      <button type="submit" className="mainBtn" onClick={onClick} style={buttonStyle}>
        {imgSrc ? <img src={imgSrc} alt={imgAlt} style={imgStyle} /> : <span style={textStyle}>{text}</span>}
      </button>
      <div className="mainBtnsubText" onClick={onSubTextClick} style={{ cursor: 'pointer' }}>
        {subText}
      </div>
    </div>
  );
}

export default MainBtn;
