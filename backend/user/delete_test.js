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

//로그인 한 사람들 답변 정보 삭제
router.post("/isLogged/deleteAnswers", (req, res) => {
  const user_nickname = req.body.nickname;
  console.log("서버에서 받은 닉네임:", user_nickname);
  // user_answers 테이블에서 해당 닉네임의 모든 행 삭제
  pool.query(
    "DELETE FROM user_answers WHERE nickname = ?",
    [user_nickname],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Database deletion failed" });
      }

      return res.json({
        message: "All answers for the user have been deleted successfully",
      });
    }
  );
});

//로그인 한 사람들 답변 정보 삭제
router.post("/Logged/deleteAnswers", (req, res) => {
  if (req.session && req.session.user) {
    const user_nickname = req.session.user.nickname;

    // user_answers 테이블에서 해당 닉네임의 모든 행 삭제
    pool.query(
      "DELETE FROM user_answers WHERE nickname = ?",
      [user_nickname],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: "Database deletion failed" });
        }

        return res.json({
          message: "All answers for the user have been deleted successfully",
        });
      }
    );
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});
module.exports = router;
