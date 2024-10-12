import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Answer.css';
import axios from 'axios';
import NumList from '../components/NumList';
import TextComponent from '../components/TextComponent';
import TestComponent from '../components/TestComponent';
import MainBtn from '../components/MainBtn';
import BoxComponent from '../components/BoxComponent';
import BoxComponent_copy from '../components/BoxComponent_copy';
import trueImg from '../assets/images/trueImg.png';
import falseImg from '../assets/images/falseImg.png';
import middleImg from '../assets/images/middleImg.png';
import AnswerComponent from '../components/AnswerComponent';
import CustomLeftArrowIcon from '../components/CustomLeftArrowIcon';
import CustomRightArrowIcon from '../components/CustomRightArrowIcon';
import answercomponentText from '../assets/images/answercomponentText.png';
import signupBtn from '../assets/images/signupBtn.png';

function IsLoggedAnswer() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]); // 문제 데이터 배열
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 현재 문제 인덱스
  const [selectedQuestion, setSelectedQuestion] = useState(1); // 선택된 문제 번호
  const [scores, setScores] = useState([]); // 각 문제의 점수를 저장할 배열

  const [word, setWord] = useState(''); // 신조어 단어
  const [about_word, setAbout_Word] = useState(''); // 신조어 단어 해설
  const [answer, setAnswer] = useState(''); // 정답 문장
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(true);

  // 로컬 스토리지에서 문제 리스트를 가져옴
  useEffect(() => {
    const savedQuestions = JSON.parse(localStorage.getItem('isloggedtestQuestions'));

    if (savedQuestions && savedQuestions.length > 0) {
      setQuestions(savedQuestions);
    }
  }, []); // 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 실행

  // 해당 문제의 해설 데이터를 서버에서 가져옴
  useEffect(() => {
    const fetchAnswerData = async () => {
      try {
        const nickname = localStorage.getItem('nickname'); // localStorage에서 닉네임 가져오기
        const response = await axios.post('/islogged/answer', { nickname });
        const answers = response.data.answers;

        if (answers.length > 0) {
          const currentAnswer = answers[currentQuestionIndex]; // 현재 문제에 맞는 해설 가져오기
          setWord(currentAnswer.word);
          setAbout_Word(currentAnswer.about_word);
          setAnswer(currentAnswer.answer);
          setScores(answers.map((answer) => answer.score)); // 모든 문제의 점수 설정
        }
      } catch (error) {
        console.error('Error fetching the answer data:', error);
      } finally {
        setIsLoadingAnswers(false); // 답변 로딩 상태 해제
      }
    };

    if (questions.length > 0) {
      fetchAnswerData();
    }
  }, [currentQuestionIndex, questions]);

  const handleQuestionClick = (questionNum) => {
    setCurrentQuestionIndex(questionNum - 1); // 클릭한 문제 번호로 currentQuestionIndex 업데이트
    setSelectedQuestion(questionNum); // 선택된 문제 번호 업데이트
    setIsLoadingAnswers(true); // 답변을 다시 로딩 상태로 설정
  };

  const handleLeftArrowClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedQuestion(currentQuestionIndex); // selectedQuestion과 동기화
      setIsLoadingAnswers(true); // 이전 질문으로 넘어가면 다시 로딩
    }
  };

  const handleRightArrowClick = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedQuestion(currentQuestionIndex + 2); // selectedQuestion과 동기화
      setIsLoadingAnswers(true); // 다음 질문으로 넘어가면 다시 로딩
    }
  };

  const handleSignupClick = async () => {
    try {
      const nickname = localStorage.getItem('nickname'); // localStorage에서 닉네임 가져오기
      console.log(nickname);
      await axios.post('/isLogged/deleteAnswers', { nickname });
      console.log(nickname);
      // 삭제 후 회원가입으로 이동
      navigate('/signuppage');
    } catch (error) {
      console.error('Error deleting user answers:', error);
    }
  };

  const handleGoHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="answerPage">
      <BoxComponent height="604px">
        <div className="numListWithArrows">
          <div onClick={handleLeftArrowClick} style={{ cursor: 'pointer' }}>
            <CustomLeftArrowIcon />
          </div>
          <NumList
            totalQuestions={questions.length}
            onQuestionClick={handleQuestionClick}
            selectedQuestion={selectedQuestion}
            scores={scores}
          />
          <div onClick={handleRightArrowClick} style={{ cursor: 'pointer' }}>
            <CustomRightArrowIcon />
          </div>
        </div>

        <div className="imgWrapper">
          {scores[currentQuestionIndex] === -50 ? (
            <img className="middleImg" src={middleImg} alt="Middle" />
          ) : scores[currentQuestionIndex] >= 75 ? (
            <img className="trueImg" src={trueImg} alt="True" />
          ) : (
            <img className="falseImg" src={falseImg} alt="False" />
          )}
        </div>

        {questions.length > 0 && (
          <>
            <TestComponent
              num={`Q${currentQuestionIndex + 1}.`} // 현재 문제 번호 1부터 시작
              question={questions[currentQuestionIndex]} // 저장된 문제에서 가져옴
            />

            <div className="answerComponent">
              <img className="answercomponentText" src={answercomponentText} alt="answercomponentText" />
              <BoxComponent_copy height="177px">
                {isLoadingAnswers ? (
                  <TextComponent text="Loading answer..." fontSize="24px" shadowSize="2.1px" colorClass="textRed" />
                ) : (
                  <AnswerComponent word={word} about_word={about_word} answer={answer} />
                )}
              </BoxComponent_copy>
            </div>
          </>
        )}
      </BoxComponent>
      <MainBtn
        imgSrc={signupBtn}
        imgAlt="회원가입"
        subText="홈으로 돌아가기"
        onClick={handleSignupClick}
        onSubTextClick={handleGoHomeClick}
      />
    </div>
  );
}

export default IsLoggedAnswer;
