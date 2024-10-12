import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import MainBtn from '../components/MainBtn';
import BoxComponent from '../components/BoxComponent';
import TextComponent from '../components/TextComponent';
import InputBox from '../components/InputBox';
import loginpageImg from '../assets/images/loginpageImg.png';
import backBtn from '../assets/images/backBtn.png';
import { LoadingContext } from '../components/LoadingContext';
import loginTitle from '../assets/images/loginTitle.png';
import loginSubtitle from '../assets/images/loginSubtitle.png';
import loginBtn from '../assets/images/loginBtn.png';

function Login() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (nickname && password) {
      startLoading(); // 로딩 시작
      try {
        const response = await axios.post('/process/login', {
          nickname,
          password,
        });
        const data = response.data;

        if (data.success) {
          alert('로그인 성공!');
          navigate('/mypage'); // 로그인 성공 시 마이페이지로 이동
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('로그인 요청 중 오류 발생:', error);
        alert('아이디 또는 비밀번호를 확인하세요.');
      } finally {
        stopLoading(); // 로딩 종료
      }
    } else {
      alert('아이디와 비밀번호를 입력해주세요.');
    }
  };

  // 이미지가 로드되면 로딩을 멈춤
  const handleImageLoad = () => {
    setImageLoaded(true);
    stopLoading();
  };

  // 뒤로 가기 버튼 클릭 시 이전 페이지로 이동
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="loginPage">
      <div className="backBtn-content">
        <img className="backBtn" src={backBtn} width={19.35} height={38.35} onClick={handleBackClick} />
      </div>

      <img className="loginTitle" src={loginTitle} alt="logintitle" />

      <BoxComponent height="426px">
        <img className="loginSubtitle" src={loginSubtitle} alt="loginsubtitle" />
        {!imageLoaded && <TextComponent text="Loading image..." fontSize="18px" shadowSize="1.9px" />}
        <img className="imgComponent" src={loginpageImg} width={185} onLoad={handleImageLoad} alt="Login visual" />
        <InputBox text="닉네임을 입력해주세요." value={nickname} onChange={handleNicknameChange} />
        <InputBox
          text="비밀번호를 입력해주세요."
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </BoxComponent>
      <MainBtn imgSrc={loginBtn} imgAlt="로그인" subText="비밀번호 까먹었어요 .." onClick={handleSubmit} />
    </div>
  );
}

export default Login;
