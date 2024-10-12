import React, { useState, useEffect, useContext } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainBtn from '../components/MainBtn';
import BoxComponent from '../components/BoxComponent';
import TextComponent from '../components/TextComponent';
import InputBox from '../components/InputBox';
import signuppageImg from '../assets/images/signuppageImg.png';
import backBtn from '../assets/images/backBtn.png';
import { LoadingContext } from '../components/LoadingContext';
import signupTitle from '../assets/images/signupTitle.png';
import signupSubtitle from '../assets/images/signupSubtitle.png';
import signupBtn from '../assets/images/signupBtn.png';

function Signup() {
  const [newnickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const [imageLoaded, setImageLoaded] = useState(false);

  const navigate = useNavigate();

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);
  };

  // 이미지가 로드되면 로딩을 멈춤
  const handleImageLoad = () => {
    setImageLoaded(true);
    stopLoading();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 로컬스토리지에서 기존 닉네임 가져오기
    const nickname = localStorage.getItem('nickname');

    if (nickname && newnickname && password) {
      const signupData = {
        nickname, // 기존 닉네임 (로컬스토리지에서 가져온 값)
        newnickname, // 새 닉네임 (입력 받은 값)
        password, // 새 비밀번호 (입력 받은 값)
      };
      startLoading(); // 로딩 시작
      try {
        // 서버로 회원가입 요청을 보냄
        const response = await axios.post('/process/signup', signupData);
        const result = response.data;

        if (result.success) {
          alert('회원가입 성공!');
          navigate('/loginpage');
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('회원가입 요청 중 오류 발생:', error);
        alert('회원가입 요청 중 오류가 발생했습니다.');
      } finally {
        stopLoading(); // 로딩 종료
      }
    } else {
      alert('필수 정보를 입력해주세요.');
    }
  };

  // 뒤로 가기 버튼 클릭 시 이전 페이지로 이동
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="signupPage">
      <div className="backBtn-content">
        <img className="backBtn" src={backBtn} width={19.35} height={38.35} onClick={handleBackClick} />
      </div>

      <img className="signupTitle" src={signupTitle} alt="signuptitle" />

      <BoxComponent height="467px">
        <img className="signupSubtitle" src={signupSubtitle} alt="signupsubtitle" />

        {!imageLoaded && <TextComponent text="Loading image..." fontSize="18px" shadowSize="1.9px" />}
        <img className="imgComponent" src={signuppageImg} width={198} onLoad={handleImageLoad} />

        <InputBox text="닉네임을 입력해주세요." value={newnickname} onChange={handleNicknameChange} />
        <InputBox
          text="비밀번호를 입력해주세요."
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </BoxComponent>
      <MainBtn imgSrc={signupBtn} imgAlt="회원가입" subText="동의한사람만눌러주세요." onClick={handleSubmit} />
    </div>
  );
}

export default Signup;
