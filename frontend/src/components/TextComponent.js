import React from 'react';
import './TextComponent.css';

function TextComponent({ text, colorClass, fontSize, shadowSize = '3.7px', shadowColor = '#2f2f2f', style }) {
  const appliedClass = colorClass ? `textContainer ${colorClass}` : 'textContainer textGreen';

  const textStyle = {
    fontSize: `${fontSize}`,
    textShadow: `
      -${shadowSize} 0 0 ${shadowColor},
      ${shadowSize} 0 0 ${shadowColor},
      0 -${shadowSize} 0 ${shadowColor},
      0 ${shadowSize} 0 ${shadowColor},
      -${shadowSize} -${shadowSize} 0 ${shadowColor},
      ${shadowSize} -${shadowSize} 0 ${shadowColor},
      -${shadowSize} ${shadowSize} 0 ${shadowColor},
      ${shadowSize} ${shadowSize} 0 ${shadowColor},
      0px 0px 5px ${shadowColor}`,
    ...style,
  };

  return (
    <div className={appliedClass} style={textStyle}>
      {text}
    </div>
  );
}

export default TextComponent;
