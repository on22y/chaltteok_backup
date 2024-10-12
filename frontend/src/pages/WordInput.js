import React, { useState, useEffect, useContext } from 'react';
import './Word.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainBtn from '../components/MainBtn';
import BoxComponent from '../components/BoxComponent';
import TextComponent from '../components/TextComponent';
import InputBox from '../components/InputBox';
import SelectBtn from '../components/SelectBtn';
import backBtn from '../assets/images/backBtn.png';
import { LoadingContext } from '../components/LoadingContext';
import wordTitle from '../assets/images/wordTitle.png';
import wordSubtitle1 from '../assets/images/wordSubtitle1.png';
import wordSubtitle2 from '../assets/images/wordSubtitle2.png';
import wordSubtitle3 from '../assets/images/wordSubtitle3.png';
import wordSubtitle4 from '../assets/images/wordSubtitle4.png';
import wordinputBtn from '../assets/images/wordinputBtn.png';

function WordInput() {
  const [word, setWord] = useState('');
  const [chat_first, setChat_first] = useState('');
  const [chat_second, setChat_second] = useState('');
  const [answer, setAnswer] = useState('');
  const [year, setYear] = useState('');
  const { startLoading, stopLoading } = useContext(LoadingContext);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (word && chat_first && chat_second && answer && year) {
      const wordData = {
        word,
        chat_first,
        chat_second,
        answer,
        year,
      };
      startLoading(); // 로딩 시작
      try {
        // 서버로 신조어 제보 요청을 보냄
        const response = await axios.post('/process/word', wordData);
        const result = response.data;

        if (result.success) {
          alert('신조어 등록 성공!');
          // 페이지를 새로고침
          window.location.reload();
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('신조어 등록 중 오류 발생:', error);
        alert('신조어 등록 중 오류가 발생했습니다.');
      } finally {
        stopLoading(); // 로딩 종료
      }
    } else {
      alert('모든 정보를 입력해주세요.');
    }
  };

  // 뒤로 가기 버튼 클릭 시 이전 페이지로 이동
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="wordPage">
      <div className="backBtn-content">
        <img className="backBtn" src={backBtn} width={19.35} height={38.35} onClick={handleBackClick} />
      </div>

      <img className="wordTitle" src={wordTitle} alt="wordTitle" />

      <BoxComponent height="468px">
        <img className="wordSubtitle1" src={wordSubtitle1} alt="wordSubtitle" />
        <InputBox text="단어를 입력해주세요." value={word} onChange={(e) => setWord(e.target.value)} />

        <div className="yearSelectionRow">
          <img className="wordSubtitle2" src={wordSubtitle2} alt="wordSubtitle" />
          <SelectBtn onYearChange={setYear} />
        </div>

        <img className="wordSubtitle3" src={wordSubtitle3} alt="wordSubtitle" />
        <div className="inputBoxForChat">
          <InputBox
            text="첫번째 대화를 입력해주세요."
            value={chat_first}
            onChange={(e) => setChat_first(e.target.value)}
          />
        </div>
        <InputBox
          text="두번째 대화를 입력해주세요."
          value={chat_second}
          onChange={(e) => setChat_second(e.target.value)}
        />

        <img className="wordSubtitle4" src={wordSubtitle4} alt="wordSubtitle" />
        <InputBox text="대화의 정답을 입력해주세요." value={answer} onChange={(e) => setAnswer(e.target.value)} />
      </BoxComponent>
      <MainBtn
        imgSrc={wordinputBtn}
        imgAlt="신조어 제보"
        imgWidth="80%"
        subText="라떼는 단어도 언젠가는 신조어!"
        onClick={handleSubmit}
      />
    </div>
  );
}

export default WordInput;
