const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const db_config = require("../config/db_config.json");

// MySQL 연결 설정
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

router.post("/Logged/test/calledQuestion", (req, res) => {
  if (req.session && req.session.user) {
    const questionCount = 10; // 항상 10개의 문제를 요청
    const recentQuestionCount = 6; // 2023, 2024년 문제에서 6개
    const oldQuestionCount = 4; // 2022년 이하 문제에서 4개

    pool.getConnection((err, conn) => {
      if (err) {
        console.error("MySQL Connection Error", err);
        res.status(500).json({ success: false, message: "DB 서버 연결 실패" });
        return;
      }

      // 첫 번째 쿼리: year === 2023 또는 year === 2024에서 6개의 문제를 랜덤으로 가져옴
      const recentQuery = `SELECT id, text1, text2, value FROM question WHERE year IN (2023, 2024) ORDER BY RAND() LIMIT ?`;

      // 두 번째 쿼리: year <= 2022에서 4개의 문제를 랜덤으로 가져옴
      const oldQuery = `SELECT id, text1, text2, value FROM question WHERE year <= 2022 ORDER BY RAND() LIMIT ?`;

      // 첫 번째 쿼리 실행
      conn.query(recentQuery, [recentQuestionCount], (error, recentResults) => {
        if (error) {
          conn.release();
          console.error("Query Error", error);
          res.status(500).json({ success: false, message: "Query 실패" });
          return;
        }

        // 두 번째 쿼리 실행
        conn.query(oldQuery, [oldQuestionCount], (error, oldResults) => {
          conn.release();
          if (error) {
            console.error("Query Error", error);
            res.status(500).json({ success: false, message: "Query 실패" });
            return;
          }

          // 두 쿼리의 결과를 합침
          const combinedResults = [...recentResults, ...oldResults];

          if (combinedResults.length === questionCount) {
            res.json({
              questions: combinedResults, // 여러 문제를 배열로 반환
            });
          } else {
            res
              .status(404)
              .json({ success: false, message: "데이터가 부족합니다." });
          }
        });
      });
    });
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

//비로그인
router.post("/isLogged/test/calledQuestion", (req, res) => {
  const questionCount = 10; // 항상 10개의 문제를 요청
  const recentQuestionCount = 8; // 2023, 2024년 문제에서 8개
  const oldQuestionCount = 2; // 2022년 이하 문제에서 2개

  pool.getConnection((err, conn) => {
    if (err) {
      console.error("MySQL Connection Error", err);
      res.status(500).json({ success: false, message: "DB 서버 연결 실패" });
      return;
    }

    // 첫 번째 쿼리: year === 2023 또는 year === 2024에서 8개의 문제를 랜덤으로 가져옴
    const recentQuery = `SELECT id, text1, text2, value FROM question WHERE year IN (2023, 2024) ORDER BY RAND() LIMIT ?`;

    // 두 번째 쿼리: year <= 2022에서 2개의 문제를 랜덤으로 가져옴
    const oldQuery = `SELECT id, text1, text2, value FROM question WHERE year <= 2022 ORDER BY RAND() LIMIT ?`;

    // 첫 번째 쿼리 실행
    conn.query(recentQuery, [recentQuestionCount], (error, recentResults) => {
      if (error) {
        conn.release();
        console.error("Query Error", error);
        res.status(500).json({ success: false, message: "Query 실패" });
        return;
      }

      // 두 번째 쿼리 실행
      conn.query(oldQuery, [oldQuestionCount], (error, oldResults) => {
        conn.release();
        if (error) {
          console.error("Query Error", error);
          res.status(500).json({ success: false, message: "Query 실패" });
          return;
        }

        // 두 쿼리의 결과를 합침
        const combinedResults = [...recentResults, ...oldResults];

        if (combinedResults.length === questionCount) {
          res.json({
            questions: combinedResults, // 여러 문제를 배열로 반환
          });
        } else {
          res
            .status(404)
            .json({ success: false, message: "데이터가 부족합니다." });
        }
      });
    });
  });
});

module.exports = router;
