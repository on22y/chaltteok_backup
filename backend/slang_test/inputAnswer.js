const express = require("express");
const mysql = require("mysql");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const db_config = require("../config/db_config.json");

// MySQL 객량 설정
const pool = mysql.createPool({
  connectionLimit: 50,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  charset: "utf8mb4", // 여기서 utf8mb4 설정
  debug: false,
});

// 형상적인 접근을 제한하기 위한 rate limit 설정
const submitLimiter = rateLimit({
  windowMs: 1000, // 1초
  max: 2, // 1초 내에 2번이상 요청을 부여할 수 없음
  message: { success: false, message: "비정상적인 접근입니다." },
});

// 로그인 상태에서 답변 제출
router.post("/Logged/test/submitAnswer", submitLimiter, (req, res) => {
  const { questionId, answer } = req.body;

  // 세션에서 nickname을 가져온다
  const nickname = req.session?.user?.nickname;
  if (!nickname) {
    return res
      .status(401)
      .json({ success: false, message: "사용자 인증이 필요합니다." });
  }

  if (!questionId || !answer) {
    return res
      .status(400)
      .json({ success: false, message: "필수 데이터가 누르게 되었습니다." });
  }

  pool.getConnection((err, conn) => {
    if (err) {
      console.error("MySQL Connection Error", err);
      res.status(500).json({ success: false, message: "DB 서버 연결 실패" });
      return;
    }

    // question 테이블에서 질문 데이터 가져오기
    const getQuestionQuery = `SELECT * FROM question WHERE id = ?`;
    conn.query(getQuestionQuery, [questionId], (error, questionResults) => {
      if (error || questionResults.length === 0) {
        conn.release();
        console.error("Question Lookup Error", error);
        return res
          .status(500)
          .json({ success: false, message: "질문을 찾을 수 없습니다." });
      }

      // value 값에 따라 text1 또는 text2 선택
      const questionData = questionResults[0];
      let selectedQuestion;
      let questionYear = questionData.year;
      let questionword = questionData.slang_word;
      let questionexplain = questionData.meaning;
      let realanswer = questionData.answer;

      if (questionData.value === "L") {
        selectedQuestion = questionData.text1;
      } else if (questionData.value === "R") {
        selectedQuestion = questionData.text2;
      } else {
        conn.release();
        return res
          .status(400)
          .json({ success: false, message: "잘못된 value 값입니다." });
      }

      // 답변과 선택된 질문을 저장하는 콰리
      const insertAnswerQuery = `INSERT INTO user_answers (question_id, nickname, answer, question, year, word, meaning) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      conn.query(
        insertAnswerQuery,
        [
          questionId,
          nickname,
          realanswer,
          selectedQuestion,
          questionYear,
          questionword,
          questionexplain,
        ],
        (error, results) => {
          if (error) {
            conn.release();
            console.error("Query Error", error);
            res.status(500).json({ success: false, message: "답변 저장 실패" });
            return;
          }

          // 이미 가져온 questionData에서 answer 사용
          const realAnswer = questionData.answer; // 실제 답안

          // FastAPI 호출
          const fastApiUrl =
            "https://nuclear-swift-yeeun-13a9bed3.koyeb.app/calculate_similarity";
          axios
            .get(fastApiUrl, {
              params: {
                key: "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",
                question: selectedQuestion,
                answer: realAnswer, // 정답과 유사도 비교
                user_answer: answer, // 사용자의 입력
              },
              timeout: 4000, // 타임아웃을 4초로 설정
            })
            .then((apiResponse) => {
              const similarity = apiResponse.data; // API에서 발현된 유사도

              // 유사도 결과를 DB에 저장
              const updateSimilarityQuery = `UPDATE user_answers SET similarity = ? WHERE question_id = ? AND nickname = ?`;
              conn.query(
                updateSimilarityQuery,
                [similarity, questionId, nickname],
                (error) => {
                  conn.release();
                  if (error) {
                    console.error("Similarity Update Error", error);
                    res.status(500).json({
                      success: false,
                      message: "유사도 업데이트 실패",
                    });
                    return;
                  }

                  res.json({
                    success: true,
                    message: "답변과 유사도가 성공적으로 저장되었습니다.",
                    similarity: similarity,
                  });
                }
              );
            })
            .catch((apiError) => {
              // 타임아웃이 발생하거나 API 호출 오류가 발생한 경우
              const similarity = -50; // 유사도를 -50으로 설정

              // 유사도 결과를 DB에 저장
              const updateSimilarityQuery = `UPDATE user_answers SET similarity = ? WHERE question_id = ? AND nickname = ?`;
              conn.query(
                updateSimilarityQuery,
                [similarity, questionId, nickname],
                (error) => {
                  conn.release();
                  if (error) {
                    console.error("Similarity Update Error", error);
                    res.status(500).json({
                      success: false,
                      message: "유사도 업데이트 실패",
                    });
                    return;
                  }

                  res.json({
                    success: true,
                    message: "API 호출 실패로 유사도가 -50으로 설정되었습니다.",
                    similarity: similarity,
                  });
                }
              );

              console.error("API Request Error or Timeout", apiError);
            });
        }
      );
    });
  });
});

// 비로그인 상태에서 답변 제출
router.post("/isLogged/test/submitAnswer", submitLimiter, (req, res) => {
  const { questionId, answer, nickname } = req.body;

  if (!questionId || !answer || !nickname) {
    return res
      .status(400)
      .json({ success: false, message: "필수 데이터가 누락되었습니다." });
  }

  pool.getConnection((err, conn) => {
    if (err) {
      console.error("MySQL Connection Error", err);
      res.status(500).json({ success: false, message: "DB 서버 연결 실패" });
      return;
    }

    // question 테이블에서 질문 데이터 가져오기
    const getQuestionQuery = `SELECT * FROM question WHERE id = ?`;
    conn.query(getQuestionQuery, [questionId], (error, questionResults) => {
      if (error || questionResults.length === 0) {
        conn.release();
        console.error("Question Lookup Error", error);
        return res
          .status(500)
          .json({ success: false, message: "질문을 찾을 수 없습니다." });
      }

      // value 값에 따라 text1 또는 text2 선택
      const questionData = questionResults[0];
      let selectedQuestion;
      let questionYear = questionData.year;
      let questionword = questionData.slang_word;
      let questionexplain = questionData.meaning;
      let realanswer = questionData.answer;

      if (questionData.value === "L") {
        selectedQuestion = questionData.text1;
      } else if (questionData.value === "R") {
        selectedQuestion = questionData.text2;
      } else {
        conn.release();
        return res
          .status(400)
          .json({ success: false, message: "잘못된 value 값입니다." });
      }

      // 답변과 선택된 질문을 저장하는 콰리
      const insertAnswerQuery = `INSERT INTO user_answers (question_id, nickname, answer, question, year, word, meaning) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      conn.query(
        insertAnswerQuery,
        [
          questionId,
          nickname,
          realanswer,
          selectedQuestion,
          questionYear,
          questionword,
          questionexplain,
        ],
        (error, results) => {
          if (error) {
            conn.release();
            console.error("Query Error", error);
            res.status(500).json({ success: false, message: "답변 저장 실패" });
            return;
          }

          // 이미 가져온 questionData에서 answer 사용
          const realAnswer = questionData.answer; // 실제 답안

          // FastAPI 호출
          const fastApiUrl =
            "https://nuclear-swift-yeeun-13a9bed3.koyeb.app/calculate_similarity";
          axios
            .get(fastApiUrl, {
              params: {
                key: "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",
                question: selectedQuestion,
                answer: realAnswer, // 정답과 유사도 비교
                user_answer: answer, // 사용자의 입력
              },
              timeout: 4000, // 타임아웃을 4초로 설정
            })
            .then((apiResponse) => {
              const similarity = apiResponse.data; // API에서 발현된 유사도

              // 유사도 결과를 DB에 저장
              const updateSimilarityQuery = `UPDATE user_answers SET similarity = ? WHERE question_id = ? AND nickname = ?`;
              conn.query(
                updateSimilarityQuery,
                [similarity, questionId, nickname],
                (error) => {
                  conn.release();
                  if (error) {
                    console.error("Similarity Update Error", error);
                    res.status(500).json({
                      success: false,
                      message: "유사도 업데이트 실패",
                    });
                    return;
                  }

                  res.json({
                    success: true,
                    message: "답변과 유사도가 성공적으로 저장되었습니다.",
                    similarity: similarity,
                  });
                }
              );
            })
            .catch((apiError) => {
              // 타임아웃이 발생하거나 API 호출 오류가 발생한 경우
              const similarity = -50; // 유사도를 -50으로 설정

              // 유사도 결과를 DB에 저장
              const updateSimilarityQuery = `UPDATE user_answers SET similarity = ? WHERE question_id = ? AND nickname = ?`;
              conn.query(
                updateSimilarityQuery,
                [similarity, questionId, nickname],
                (error) => {
                  conn.release();
                  if (error) {
                    console.error("Similarity Update Error", error);
                    res.status(500).json({
                      success: false,
                      message: "유사도 업데이트 실패",
                    });
                    return;
                  }

                  res.json({
                    success: true,
                    message: "API 호출 실패로 유사도가 -50으로 설정되었습니다.",
                    similarity: similarity,
                  });
                }
              );

              console.error("API Request Error or Timeout", apiError);
            });
        }
      );
    });
  });
});

module.exports = router;
