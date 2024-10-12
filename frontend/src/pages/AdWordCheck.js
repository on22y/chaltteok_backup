import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MainBtn from '../components/MainBtn';
import BoxComponent from '../components/BoxComponent';
import TextComponent from '../components/TextComponent';
import backBtn from '../assets/images/backBtn.png';
import './Word.css';
import InputBox from '../components/InputBox';
import approveBtn from '../assets/images/approveBtn.png';
import rejectBtn from '../assets/images/rejectBtn.png';

function AdWordCheck() {
  const [wordData, setWordData] = useState({});
  const [aboutWord, setAboutWord] = useState(''); // First input state
  const [directionInput, setDirectionInput] = useState(''); // New input state for "R or L"
  const navigate = useNavigate();
  const location = useLocation();

  // URLSearchParams for extracting 'id' from the query
  const queryParams = new URLSearchParams(location.search);
  const wordId = queryParams.get('id');

  useEffect(() => {
    if (wordId) {
      axios
        .get(`/admin/word/check/${wordId}`)
        .then((response) => {
          setWordData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching word data:', error);
        });
    }
  }, [wordId]);

  const handleApprove = () => {
    axios
      .post('/admin/approve', {
        id: wordData.id,
        action: 'approve',
        about_word: aboutWord,
        directionInput: directionInput,
      })
      .then(() => {
        navigate('/admin/word/list');
      })
      .catch((error) => {
        console.error('Error approving word:', error);
      });
  };

  const handleReject = () => {
    axios
      .post('/admin/approve', { id: wordData.id, action: 'reject' })
      .then(() => {
        navigate('/admin/word/list');
      })
      .catch((error) => {
        console.error('Error rejecting word:', error);
      });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="wordPage">
      <div className="backBtn-content">
        <img className="backBtn" src={backBtn} width={19.35} height={38.35} onClick={handleBackClick} alt="Back" />
      </div>

      <TextComponent text="단어 정보 확인" fontSize="28px" shadowSize="2.2px" />

      <BoxComponent width="356px" height="454px">
        <div className="wordCheckMain">
          <div className="wordCheckMaintitle">
            <TextComponent text="단어 : " colorClass="textYellow" fontSize="24px" shadowSize="2.1px" />
            <TextComponent text="유행 년도 : " colorClass="textYellow" fontSize="20px" shadowSize="2px" />
          </div>

          <div className="wordCheckMainContent">
            <TextComponent text={wordData.word} fontSize="24px" shadowSize="2.1px" />
            <TextComponent text={wordData.year} fontSize="20px" shadowSize="2px" />
          </div>
        </div>

        <div className="textWithLine">
          <TextComponent text="첫번째대화 :" colorClass="textYellow" fontSize="20px" shadowSize="2px" />
          <div className="chats">{wordData.text1}</div>
        </div>

        <div className="textWithLine">
          <TextComponent text="두번째대화 :" colorClass="textYellow" fontSize="20px" shadowSize="2px" />
          <div className="chats">{wordData.text2}</div>
        </div>

        <div className="textWithLine">
          <TextComponent text="뜻 :" colorClass="textYellow" fontSize="20px" shadowSize="2px" />
          <div className="chats">{wordData.meaning}</div>
        </div>

        {/* First input box for word entry */}
        <InputBox
          text="단어 입력"
          value={aboutWord}
          onChange={(e) => setAboutWord(e.target.value)}
          style={{ width: '50%' }} // Half-width input box
        />

        {/* New input box for R or L entry */}
        <InputBox
          text="R or L 입력"
          value={directionInput}
          onChange={(e) => setDirectionInput(e.target.value)}
          style={{ width: '50%' }} // Same half-width style for alignment
        />
      </BoxComponent>

      <MainBtn
        imgSrc={approveBtn}
        imgAlt="등록하기"
        width="161px"
        height="57px"
        fontSize="20px"
        onClick={handleApprove}
        shadowSize={2}
      />
      <MainBtn
        imgSrc={rejectBtn}
        imgAlt="반려하기"
        width="161px"
        height="57px"
        fontSize="20px"
        backgroundColor="#FF4E4E"
        onClick={handleReject}
        shadowSize={2}
      />
    </div>
  );
}

export default AdWordCheck;
