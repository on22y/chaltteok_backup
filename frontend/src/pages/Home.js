import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import axios from 'axios';
import MainBtn from '../components/MainBtn';
import BoxComponent from '../components/BoxComponent';
import TextComponent from '../components/TextComponent';
import mainImg from '../assets/images/mainImg.png';
import UnderlineBtn from '../components/UnderlineBtn';
import { LoadingContext } from '../components/LoadingContext';
import mainTitle from '../assets/images/mainTitle.png';
import mainSubtitle from '../assets/images/mainSubtitle.png';
import testBtn from '../assets/images/testBtn.png';

function Home() {
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios
      .get('/api/get-count')
      .then((response) => {
        setCount(response.data.count);
      })
      .catch((error) => {
        console.error('Error fetching count:', error);
      });
  }, []);

  // 이미지가 로드되면 로딩을 멈춤
  const handleImageLoad = () => {
    setImageLoaded(true);
    stopLoading();
  };

  const handleLogin = () => {
    navigate('/loginpage');
  };

  const handleTestClick = () => {
    axios
      .get('/api/get-count')
      .then((countResponse) => {
        const currentCount = countResponse.data.count;
        const generatedNickname = `user_${currentCount}`;

        axios
          .post('/api/create-anonymous-user', { nickname: generatedNickname })
          .then((response) => {
            if (response.data.success) {
              // 닉네임을 localStorage에 저장
              localStorage.setItem('nickname', generatedNickname);

              // 카운트 증가 후 다음 페이지로 이동
              axios.post('/api/increase-count').then((increaseResponse) => {
                setCount(increaseResponse.data.count);
                navigate('/isLogged/test');
              });
            }
          })
          .catch((error) => {
            console.error('Error creating anonymous user:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching current count:', error);
      });
  };

  return (
    <div className="homePage">
      <UnderlineBtn subText="테스트 경험이 있다면!" text="로그인" onClick={handleLogin} />
      <div className="homePage-content">
        <BoxComponent height="482px">
          <img className="mainTitle" src={mainTitle} alt="Main Title" />
          {!imageLoaded && <TextComponent text="Loading image..." fontSize="18px" shadowSize="1.9px" />}
          <img className="imgComponent" src={mainImg} width={198} onLoad={handleImageLoad} alt="Login visual" />
          <img className="mainSubtitle" src={mainSubtitle} alt="Main Subtitle" />
        </BoxComponent>
        <MainBtn
          imgSrc={testBtn}
          imgAlt="진단하기"
          subText={`지금까지 ${count}명이 참여했어요`}
          onClick={handleTestClick}
        />
      </div>
    </div>
  );
}

export default Home;
