import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './VoiceTalk.css';
import axios from 'axios';
import MainVoiceBtn from '../components/MainVoiceBtn';
import UnderlineVoiceBtn from '../components/UnderlineVoiceBtn';
import voiceLineImg from '../assets/images/voiceLineImg.png';

function VoiceTalk() {
  const [transcript, setTranscript] = useState([]); // 문장 배열로 관리
  const [interimTranscript, setInterimTranscript] = useState(''); // 중간 결과 저장
  const [isRecording, setIsRecording] = useState(false);
  const [buttonText, setButtonText] = useState('시작하기'); // 버튼의 기본 텍스트
  const recognitionRef = useRef(null); // recognition 객체를 ref로 관리
  const bottomRef = useRef(null); // 자동 스크롤을 위한 ref

  const navigate = useNavigate();

  const handleStartRecording = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    // Web Speech API 사용을 위한 SpeechRecognition 객체 생성
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR'; // 한국어 인식
    recognition.continuous = true; // 연속적으로 인식
    recognition.interimResults = true; // 중간 결과 실시간 표시

    recognition.onresult = async (event) => {
      let finalTranscript = ''; // 최종 결과 저장
      let interimTranscriptTemp = ''; // 임시 중간 결과

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcriptSegment; // 최종 결과는 따로 저장
        } else {
          interimTranscriptTemp += transcriptSegment; // 중간 결과는 임시 저장
        }
      }

      // 최종 결과를 신조어에서 평어로 변환하는 API 호출
      const updatedTranscript = await replaceSlangWithNormalWords(finalTranscript);

      setTranscript((prev) => [...prev, updatedTranscript]); // 변환된 최종 결과만 누적
      setInterimTranscript(interimTranscriptTemp); // 중간 결과는 실시간으로 표시
    };

    recognition.onstart = () => {
      setIsRecording(true);
      setButtonText('그만하기'); // 녹음 시작 시 버튼 텍스트 변경
    };

    recognition.onend = () => {
      setIsRecording(false);
      setButtonText('시작하기'); // 녹음 종료 시 버튼 텍스트 변경
    };

    // 음성 인식 시작
    recognition.start();
    recognitionRef.current = recognition; // recognition 객체를 ref로 저장
  };

  const handleStopRecording = () => {
    // 녹음 중지 함수
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // recognition 종료
      setIsRecording(false);
      setButtonText('시작하기'); // 녹음 종료 시 버튼 텍스트 변경
    }
  };

  // 서버로 신조어 변환 요청
  const replaceSlangWithNormalWords = async (transcript) => {
    try {
      const response = await fetch('/voice/talk/replace-slang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();
      return data.updatedTranscript; // 변환된 텍스트 반환
    } catch (error) {
      console.error('신조어 변환 중 오류 발생:', error);
      return transcript; // 오류 시 원래 텍스트 반환
    }
  };

  const handleTest = () => {
    navigate('/QR');
  };

  // 새로운 텍스트가 추가될 때마다 자동으로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  return (
    <div className="voicetalkPage">
      <div className="textDisplay">
        {transcript
          .filter((line) => line.trim() !== '') // 빈 문자열을 필터링
          .slice(-4)
          .map((line, index) => (
            <p key={index}>{line}</p> // 줄바꿈된 문장 출력
          ))}
        <p className={`nowSpeak ${isRecording && interimTranscript ? 'speaking' : ''}`} style={{ color: '#ffffff' }}>
          {interimTranscript}
        </p>
        <div ref={bottomRef} /> {/* 자동 스크롤을 위한 요소 */}
      </div>

      <img className="voiceLineImg" src={voiceLineImg} />

      <div className="voicetalkPage-bottom">
        <MainVoiceBtn
          text={buttonText}
          width="165px"
          height="63.17px"
          fontSize="24px"
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        />
        <UnderlineVoiceBtn subText="또는," text="인터넷 나이 측정하기" onClick={handleTest} />
      </div>
    </div>
  );
}

export default VoiceTalk;
