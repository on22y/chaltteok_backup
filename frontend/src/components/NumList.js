import React, { useState } from 'react';
import './NumList.css';

// 기본 문제 개수 10개로 설정
function NumList({ totalQuestions = 10, onQuestionClick, selectedQuestion, scores = [] }) {
  return (
    <div className="numListContainer">
      {Array.from({ length: totalQuestions }, (_, index) => {
        const questionNum = index + 1;
        const isSelected = questionNum === selectedQuestion; // 현재 선택된 문제 번호인지 확인
        const score = scores[index] || 0; // 각 문제의 점수를 가져옴, 기본값은 0
        const color = score === -50 ? 'gray' : score >= 75 ? '#357929' : '#FF4E4E';

        return (
          <div
            key={questionNum}
            className={`numList-Click ${isSelected ? 'selected' : ''}`}
            onClick={() => onQuestionClick(questionNum)}
            style={{ fontSize: '14px', color: color }}
          >
            {questionNum}
          </div>
        );
      })}
    </div>
  );
}

export default NumList;
