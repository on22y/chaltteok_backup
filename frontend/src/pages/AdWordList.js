import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wordlist.css';
import axios from 'axios';
import BoxComponent from '../components/BoxComponent';
import TextComponent from '../components/TextComponent';

function AdWordList() {
  // const [wordData, setWordData] = useState({
  //   word: '',
  //   year: '',
  //   chat_first: '',
  // });

  // const [wordData, setWordData] = useState([]);
  const [wordDataList, setWordDataList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWordData = async () => {
      try {
        const response = await axios.post('/admin/word/list', {
          headers: { 'Cache-Control': 'no-cache' }, // 항상 최신 데이터를 불러옴
        });
        console.log('API 응답 데이터:', response.data);
        if (Array.isArray(response.data)) {
          // 서버에서 응답받은 데이터가 배열인지 확인
          setWordDataList(response.data);
        } else {
          console.error('데이터가 배열이 아닙니다:', response.data);
        }
      } catch (error) {
        console.error('단어 정보를 가져오는 중 오류 발생:', error);
        alert('단어 정보를 가져오는 중 오류가 발생했습니다.');
      }
    };

    fetchWordData();
  }, []);

  const handleWordClick = (wordId) => {
    navigate(`/admin/word/check?id=${wordId}`); // useLocation으로 넘어가는 경로에서 쿼리 파라미터로 id 전달
  };

  return (
    <div className="wordlistPage">
      <BoxComponent width="356px" height="695px">
        <div className="wordlist-container">
          <div className="wordlistTitle">
            <TextComponent text="단어" colorClass="textYellow" fontSize="16px" shadowSize="1.8px" />
            <TextComponent text="년도" colorClass="textYellow" fontSize="16px" shadowSize="1.8px" />
            <TextComponent text="예시 대화" colorClass="textYellow" fontSize="16px" shadowSize="1.8px" />
          </div>

          {/* <div className="wordlistContent">
            <div className="lists">word</div>
            <div className="lists">2024</div>
            <div className="lists">chatchat</div>
          </div> */}

          {/* 데이터를 배열로 받아와서 map을 통해 렌더링 */}
          {wordDataList.length > 0 ? (
            wordDataList.map((wordData) => (
              <div key={wordData.id} className="wordlistContent" onClick={() => handleWordClick(wordData.id)}>
                <div className="lists">{wordData.word}</div>
                <div className="lists">{wordData.year}</div>
                <div className="lists">{wordData.text1}</div>
              </div>
            ))
          ) : (
            <TextComponent text="표시할 단어가 없습니다." colorClass="textYellow" fontSize="16px" shadowSize="1.8px" />
          )}
        </div>
      </BoxComponent>
    </div>
  );
}

export default AdWordList;
