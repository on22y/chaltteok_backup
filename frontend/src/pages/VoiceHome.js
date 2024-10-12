import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './VoiceHome.css';
import axios from 'axios';
import MainVoiceBtn from '../components/MainVoiceBtn';

function VoiceHome() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/voice/talk');
  };

  return (
    <div className="voicehomePage">
      <MainVoiceBtn text="대화 시작하기" onClick={handleStart} />

      <div className="voicehometext">
        버튼을 누르시면 여러분의 대화를 <br />
        <strong>'자막'</strong> 형태로 표현합니다. <br />
        <br />
        추가로, <br />
        대화 중에 활용되는 <strong>신조어</strong>의 의미를 <br />
        <strong>실시간</strong>으로 번역합니다.
      </div>
    </div>
  );
}

export default VoiceHome;
