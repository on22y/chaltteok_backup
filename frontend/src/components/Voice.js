import React, { useState, useRef } from "react";

const Voice = () => {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState(""); // 중간 결과 저장
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null); // recognition 객체를 ref로 관리

  const handleStartRecording = () => {
    if (
      !("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
      return;
    }

    // Web Speech API 사용을 위한 SpeechRecognition 객체 생성
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR"; // 한국어 인식
    recognition.continuous = true; // 연속적으로 인식
    recognition.interimResults = true; // 중간 결과 실시간 표시

    recognition.onresult = async (event) => {
      let finalTranscript = ""; // 최종 결과 저장
      let interimTranscriptTemp = ""; // 임시 중간 결과

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcriptSegment; // 최종 결과는 따로 저장
        } else {
          interimTranscriptTemp += transcriptSegment; // 중간 결과는 임시 저장
        }
      }

      // 최종 결과를 신조어에서 평어로 변환하는 API 호출
      const updatedTranscript = await replaceSlangWithNormalWords(
        finalTranscript
      );
      setTranscript((prev) => prev + updatedTranscript); // 변환된 최종 결과만 누적
      setInterimTranscript(interimTranscriptTemp); // 중간 결과는 실시간으로 표시
    };

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    // 음성 인식 시작
    recognition.start();
    recognitionRef.current = recognition; // recognition 객체를 ref로 저장
  };

  const handleStopRecording = () => {
    // 녹음 중지 함수
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // recognition 종료
      setIsRecording(false);
    }
  };

  // 서버로 신조어 변환 요청
  const replaceSlangWithNormalWords = async (transcript) => {
    try {
      const response = await fetch("/replace-slang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();
      return data.updatedTranscript; // 변환된 텍스트 반환
    } catch (error) {
      console.error("신조어 변환 중 오류 발생:", error);
      return transcript; // 오류 시 원래 텍스트 반환
    }
  };

  return (
    <div className="voice">
      <h1>실시간 음성 인식 테스트 페이지</h1>
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
      >
        {isRecording ? "녹음 중지" : "녹음 시작"}
      </button>
      <h2>인식된 텍스트</h2>
      <p>{transcript}</p>
      <p style={{ color: "gray" }}>{interimTranscript}</p>{" "}
      {/* 중간 결과는 회색으로 표시 */}
    </div>
  );
};

export default Voice;
