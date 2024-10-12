import React from 'react';
import './BoxComponent.css';

function BoxComponent({ children, width, height }) {
  return (
    <div className="boxContainer" style={{ width: `${width}`, height: `${height}` }}>
      {children}
    </div>
  );
}

export default BoxComponent;
