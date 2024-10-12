import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Mypage.css';
import TypeComponent from '../components/TypeComponent';
import MainBtn from '../components/MainBtn';
import lineImg from '../assets/images/lineImg.png';
import retestBtn from '../assets/images/retestBtn.png';
import wordinputBtn from '../assets/images/wordinputBtn.png';

function Mypage() {
  const [state, setState] = useState('');
  const [message1, setMessage1] = useState('');
  const [message2, setMessage2] = useState('');

  const navigate = useNavigate();

  const handleLoggedTestClick = async () => {
    try {
      // user_answers 테이블에서 사용자의 모든 행 삭제 요청
      await axios.post('/Logged/deleteAnswers');

      // 삭제 후 진단 페이지로 이동
      navigate('/Logged/test');
    } catch (error) {
      console.error('Error deleting user answers:', error);
    }
  };
  const handleWordClick = () => {
    navigate('/word');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching user state and messages...');
        const response = await axios.get('/mypage/getResult');
        console.log('Response 전체:', response); // response 객체 전체를 로그로 출력
        const newState = response.data.state; // 서버에서 받아온 현재 상태
        setState(newState);
        setMessage1(response.data.message1);
        setMessage2(response.data.message2);

        // 로컬 스토리지에 저장된 이전 상태 불러오기
        const previousState = localStorage.getItem('previousState');
        console.log(`Previous state: ${previousState}, Current state: ${newState}`);

        // 로컬 스토리지에 새로운 state 저장
        localStorage.setItem('previousState', previousState);
        localStorage.setItem('currentState', newState);
        console.log('3번, state:', response.data.state);
      } catch (error) {
        console.error('Error fetching the type value:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mypage">
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
  );
}

export default Mypage;
