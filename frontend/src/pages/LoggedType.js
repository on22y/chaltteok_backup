import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoggedType.css';
import TextComponent from '../components/TextComponent';
import TypeComponent from '../components/TypeComponent';
import UnderlineBtn from '../components/UnderlineBtn';
import MainBtn from '../components/MainBtn';
import lineImg from '../assets/images/lineImg.png';
import textDecoImg from '../assets/images/textDecoImg.png';
import textDeco from '../assets/images/textDeco.png';
import retestBtn from '../assets/images/retestBtn.png';
import wordinputBtn from '../assets/images/wordinputBtn.png';

function LoggedType() {
  const [state, setState] = useState('');
  const [message1, setMessage1] = useState('');
  const [message2, setMessage2] = useState('');
  const [showTextDeco, setShowTextDeco] = useState(false);
  const navigate = useNavigate();

  const handleLoggedAnswerClick = () => {
    navigate('/Logged/answer');
  };

  const handleLoggedTestClick = async () => {
    try {
      // Make a POST request to delete the logged user's answers
      const response = await axios.post('/Logged/deleteAnswers');

      if (response.status === 200) {
        console.log(response.data.message); // Successfully deleted message

        // Redirect or refresh the page after successful deletion
        navigate('/Logged/test');
      } else {
        console.error('Failed to delete answers. Server returned:', response);
      }
    } catch (error) {
      console.error('Error deleting answers:', error);
    }
  };

  const handleWordClick = () => {
    navigate('/word');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/Logged/type/getResult');
        const { state, message1, message2 } = response.data; // 백엔드에서 state와 message를 받아옴
        setState(state);
        setMessage1(message1);
        setMessage2(message2);

        // 로컬 스토리지에서 이전 진단 결과 불러오기
        const previousState = localStorage.getItem('currentState');

        // 비교: 가장 최근의 결과와 바로 직전 결과가 동일한지 확인
        if (previousState && previousState === state) {
          setShowTextDeco(true);
        } else {
          setShowTextDeco(false);
        }

        // 현재 상태를 로컬 스토리지에 저장
        localStorage.setItem('previousState', previousState); // 기존 currentState를 previousState로 이동
        localStorage.setItem('currentState', state); // 새로운 state를 currentState로 저장
      } catch (error) {
        console.error('Error fetching the state and message:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="LoggedTypePage">
      <UnderlineBtn subText="인터넷 생활 오답노트가 필요하다면," text="해설지 확인" onClick={handleLoggedAnswerClick} />

      <div className="LoggedTypePage-content">
        <div className="stateWithTextDeco">
          {showTextDeco && (
            // <div className="LoggedTypePage-textDeco">
            <img
              className={
                state === '잼민이' || state === 'K-고딩' || state === '샌애기' ? 'textDecoImg' : 'textDecoImg-if'
              }
              src={textDeco}
            />
            // </div>
          )}

          <TypeComponent
            state={state}
            detail={
              <>
                {message1}
                <br></br>
                {message2}
              </>
            }
          />
        </div>

        <MainBtn
          imgSrc={retestBtn}
          imgAlt="진단 다시하기"
          imgWidth="80%"
          subText="여전히 내 나이 인정 못한다면?"
          onClick={handleLoggedTestClick}
        />
        <img className="lineImg" src={lineImg} width={318} />
        <MainBtn
          imgSrc={wordinputBtn}
          imgAlt="신조어 제보"
          imgWidth="80%"
          subText="요즘은 이런단어 쓴단다 ~"
          width="130px"
          height="48px"
          fontSize="18px"
          shadowSize={1.9}
          onClick={handleWordClick}
        />
      </div>
    </div>
  );
}

export default LoggedType;
