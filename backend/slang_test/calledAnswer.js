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

//로그인 전용
router.post("/Logged/answer/calledAnswer", (req, res) => {
  if (req.session && req.session.user) {
    const questionId = req.body.id; // 가져올 문제의 ID를 프론트엔드에서 넘겨줌

    if (!questionId) {
      return res
        .status(400)
        .json({ success: false, message: "ID가 필요합니다." });
    }

    pool.getConnection((err, conn) => {
      if (err) {
        console.error("MySQL Connection Error", err);
        res.status(500).json({ success: false, message: "DB 서버 연결 실패" });
        return;
      }

      // answer, slang_word, meaning을 선택적으로 가져오기
      const query = `SELECT answer, slang_word, meaning FROM question WHERE id = ?`;
      conn.query(query, [questionId], (error, results) => {
        conn.release();
        if (error) {
          console.error("Query Error", error);
          res.status(500).json({ success: false, message: "Query 실패" });
          return;
        }

        if (results.length > 0) {
          res.json({
            questions: results, // 여러 문제를 배열로 반환
          });
        } else {
          res
            .status(404)
            .json({ success: false, message: "데이터가 없습니다." });
        }
      });
    });
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

//비로그인
router.post("/isLogged/answer/calledAnswer", (req, res) => {
  const questionId = req.body.id; // 가져올 문제의 ID를 프론트엔드에서 넘겨줌

  if (!questionId) {
    return res
      .status(400)
      .json({ success: false, message: "ID가 필요합니다." });
  }

  pool.getConnection((err, conn) => {
    if (err) {
      console.error("MySQL Connection Error", err);
      res.status(500).json({ success: false, message: "DB 서버 연결 실패" });
      return;
    }

    // answer, slang_word, meaning을 선택적으로 가져오기
    const query = `SELECT answer, slang_word, meaning FROM question WHERE id = ?`;
    conn.query(query, [questionId], (error, results) => {
      conn.release();
      if (error) {
        console.error("Query Error", error);
        res.status(500).json({ success: false, message: "Query 실패" });
        return;
      }

      if (results.length > 0) {
        res.json({
          questions: results, // 여러 문제를 배열로 반환
        });
      } else {
        res.status(404).json({ success: false, message: "데이터가 없습니다." });
      }
    });
  });
});

module.exports = router;
