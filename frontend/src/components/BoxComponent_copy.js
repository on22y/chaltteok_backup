import React from 'react';
import './BoxComponent_copy.css';

function BoxComponent_copy({ children, width, height }) {
  return (
    <div className="boxContainer_copy" style={{ width: `${width}`, height: `${height}` }}>
      {children}
    </div>
  );
}

export default BoxComponent_copy;
