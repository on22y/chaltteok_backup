import React from 'react';
import { useNavigate } from 'react-router-dom';
import qrImg from '../assets/images/qrImg.png';
import './VoiceQR.css';

function VoiceQR() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/voice/talk');
  };

  return (
    <div className="voiceQRPage">
      <img className="qrImg" src={qrImg} alt="QR" />
    </div>
  );
}

export default VoiceQR;
