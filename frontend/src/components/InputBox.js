import React from 'react';
import './InputBox.css';

function InputBox({ text, value, onChange, type = 'text' }) {
  return (
    <div className="inputBoxContainer">
      <input type={type} placeholder={text} value={value} onChange={onChange} className="inputBox" />
    </div>
  );
}

export default InputBox;
