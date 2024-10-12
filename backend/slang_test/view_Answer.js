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
  debug: false,
  charset: "utf8mb4", // 여기서 utf8mb4 설정
});

router.post("/", (req, res) => {
  if (req.session && req.session.user) {
    const user_nickname = req.session.user.nickname;

    // 해당 닉네임에 맞는 데이터를 위에서부터 순차적으로 가져옴
    pool.query(
      "SELECT * FROM user_answers WHERE nickname = ? ORDER BY created_at ASC",
      [user_nickname],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: "Database query failed" });
        }

        if (results.length > 0) {
          return res.json({
            answers: results.map((result) => ({
              word: result.word,
              about_word: result.meaning,
              answer: result.answer,
              question: result.question,
              score: result.similarity,
            })),
          });
        } else {
          return res.status(404).json({ error: "User not found" });
        }
      }
    );
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

module.exports = router;
