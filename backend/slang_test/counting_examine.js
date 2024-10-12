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

router.get("/api/get-count", (req, res) => {
  pool.query("SELECT count FROM counting_examine LIMIT 1", (error, results) => {
    if (error) {
      console.error("Error fetching count:", error);
      return res.status(500).send("Server error");
    }
    const count = results[0]?.count || 0;
    res.json({ count });
  });
});

// 카운트 증가시키기
router.post("/api/increase-count", (req, res) => {
  pool.query(
    "UPDATE counting_examine SET count = count + 1",
    (error, results) => {
      if (error) {
        console.error("Error updating count:", error);
        return res.status(500).send("Server error");
      }

      // 업데이트 후 새로운 카운트를 반환
      pool.query(
        "SELECT count FROM counting_examine LIMIT 1",
        (error, results) => {
          if (error) {
            console.error("Error fetching updated count:", error);
            return res.status(500).send("Server error");
          }
          const updatedCount = results[0]?.count || 0;
          res.json({ count: updatedCount });
        }
      );
    }
  );
});

// 비로그인 상태에서 임의 닉네임 생성 및 세션에 저장
router.post("/api/create-anonymous-user", (req, res) => {
  const generatedNickname = req.body.nickname;

  // 세션에 임의 닉네임 저장
  req.session.user = {
    nickname: generatedNickname,
    authorized: false, // 비로그인 상태
  };

  // DB에 임의의 사용자 저장 (닉네임만)
  pool.query(
    "INSERT INTO users (nickname, password) VALUES (?, 'not login')",
    [generatedNickname],
    (error) => {
      if (error) {
        console.error("Error inserting user into DB:", error); // 오류 로그 추가
        return res
          .status(500)
          .json({ success: false, message: "DB 저장 실패" });
      }
      res.json({ success: true });
    }
  );
});

module.exports = router;
