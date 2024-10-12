import React, { useState, useEffect } from 'react';
import './TestComponent.css';
import TextComponent from './TextComponent';

function TestComponent({ question, num, onNext }) {
  const [leftChat, setLeftChat] = useState('');
  const [rightChat, setRightChat] = useState('');
  const [chatValue, setChatValue] = useState(''); // value 값을 저장할 state

  useEffect(() => {
    if (question) {
      setLeftChat(question.text1);
      setRightChat(question.text2);
      setChatValue(question.value);
    }
  }, [question]);

  return (
    <div className="testComponent">
      <div className="questionContent">
        <TextComponent text={num} fontSize="64px" shadowSize="3.7px" />
        <div className="question">
          다음 대화를 보고, 녹색 대화창의 <br />
          의미를 작성하시오.
        </div>
      </div>

      <div className="chatContainer">
        <div className={`chatBubble leftBubble ${chatValue === 'L' ? 'greenBubble' : ''}`}>{leftChat}</div>
        <div className={`chatBubble rightBubble ${chatValue === 'R' ? 'greenBubble' : ''}`}>{rightChat}</div>
      </div>
    </div>
  );
}

export default TestComponent;
