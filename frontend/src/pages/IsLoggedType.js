import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './IsLoggedType.css';
import TypeComponent from '../components/TypeComponent';
import UnderlineBtn from '../components/UnderlineBtn';
import MainBtn from '../components/MainBtn';
import lineImg from '../assets/images/lineImg.png';
import signupBtn from '../assets/images/signupBtn.png';
import wordinputBtn from '../assets/images/wordinputBtn.png';

function IsLoggedType() {
  const [state, setState] = useState('');
  const [message1, setMessage1] = useState('');
  const [message2, setMessage2] = useState('');
  const navigate = useNavigate();

  const handleAnswerClick = () => {
    navigate('/isLogged/answer');
  };

  const handleSignupClick = () => {
    navigate('/signuppage');
  };

  const handleWordClick = () => {
    navigate('/word');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/isLogged/type/getResult');
        const { state, message1, message2 } = response.data; // 백엔드에서 state와 message를 받아옴
        setState(state);
        setMessage1(message1);
        setMessage2(message2);
      } catch (error) {
        console.error('Error fetching the state and message:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="isLoggedTypePage">
      <UnderlineBtn subText="인터넷 생활 오답노트가 필요하다면," text="해설지 확인" onClick={handleAnswerClick} />

      <div className="isLoggedTypePage-content">
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

        <MainBtn imgSrc={signupBtn} imgAlt="회원가입" subText="내 나이 인정 못한다면?" onClick={handleSignupClick} />
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

export default IsLoggedType;
