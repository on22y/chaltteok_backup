import React from 'react';
import './TextArea.css';
import TextareaAutosize from 'react-textarea-autosize';

function TextArea({ text, value, onChange }) {
  return (
    <div className="textAreaContainer">
      <TextareaAutosize
        cacheMeasurements
        placeholder={text}
        value={value}
        onChange={onChange}
        maxRows={3}
        minRows={1}
        className="textArea"
      />
    </div>
  );
}

export default TextArea;
