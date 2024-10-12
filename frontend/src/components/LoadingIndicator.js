import React, { useContext } from 'react';
import { LoadingContext } from '../components/LoadingContext';
import './LoadingIndicator.css';
import TextComponent from './TextComponent';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function LoadingIndicator() {
  const { loading } = useContext(LoadingContext);

  if (!loading) return null; // 로딩 중이 아니면 아무것도 표시하지 않음

  return (
    <div className="loading-overlay">
      <AiOutlineLoading3Quarters className="loading-spin" size={48} />
    </div>
  );
}

export default LoadingIndicator;
