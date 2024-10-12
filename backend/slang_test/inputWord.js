// 신조어 제보 버튼을 누르면 단어와 대화 및 정답을 서버에 전송하는 코드

const express = require("express");
const mysql = require("mysql");
const axios = require("axios");
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

// 신조어 제보 데이터 저장
router.post("/process/word", (req, res) => {
  const { word, year, chat_first, chat_second, answer } = req.body;

  if (!word || !year || !chat_first || !chat_second || !answer) {
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

    // 새로운 단어 정보를 저장하는 쿼리
    const insertWordQuery = `
    INSERT INTO user_make_data (word, year, text1, text2, meaning)
    VALUES (?, ?, ?, ?, ?)
  `;

    conn.query(
      insertWordQuery,
      [word, year, chat_first, chat_second, answer],
      (error, results) => {
        conn.release(); // 쿼리가 끝난 후 항상 연결을 해제
        if (error) {
          conn.release();
          console.error("Query Error", error);
          res.status(500).json({ success: false, message: "답변 저장 실패" });
          return;
        }

        res.json({
          success: true,
          message: "신조어가 성공적으로 등록되었습니다.",
        });
      }
    );
  });
});

module.exports = router;
