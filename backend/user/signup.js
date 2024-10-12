const bcrypt = require("bcrypt");
const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const db_config = require("../config/db_config.json");

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

router.post("/process/signup", async (req, res) => {
  console.log("/signup 호출됨", req.body);

  const storedNickname = req.body.nickname; // 로컬스토리지에 저장된 기존 닉네임
  const newNickname = req.body.newnickname; // 사용자가 업데이트하려는 새 닉네임
  const newPassword = req.body.password;

  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    pool.getConnection((err, conn) => {
      if (err) {
        console.log("MySQL Connection Error", err);
        if (conn) conn.release();
        return res.json({ success: false, message: "DB 서버 연결 실패" });
      }
      console.log("데이터베이스 연결 성공");

      // 1. 로컬스토리지에 저장된 기존 닉네임으로 유저 조회
      const getUserQuery = "SELECT * FROM users WHERE nickname = ?";
      conn.query(getUserQuery, [storedNickname], (err, result) => {
        if (err) {
          console.log("유저 조회 중 오류 발생", err);
          conn.release();
          return res.json({ success: false, message: "유저 조회 실패" });
        }

        if (result.length === 0) {
          conn.release();
          return res.json({
            success: false,
            message: "존재하지 않는 유저입니다.",
          });
        }

        const userId = result[0].nickname;

        // 2. 새 닉네임이 다른 사용자에게 사용 중인지 확인
        const checkDuplicateQuery = "SELECT * FROM users WHERE nickname = ? ";
        conn.query(
          checkDuplicateQuery,
          [newNickname, userId],
          (err, duplicateResult) => {
            if (err) {
              console.log("중복 닉네임 확인 중 오류 발생", err);
              conn.release();
              return res.json({
                success: false,
                message: "닉네임 중복 조회 실패",
              });
            }

            if (duplicateResult.length > 0) {
              // 닉네임 중복이 있는 경우
              conn.release();
              return res.json({
                success: false,
                message: "이미 사용 중인 닉네임입니다.",
              });
            }

            // 3. 닉네임 중복이 없을 경우, 기존 사용자의 닉네임과 비밀번호 업데이트
            const updateQuery =
              "UPDATE users SET nickname = ?, password = ? WHERE nickname = ?";
            conn.query(
              updateQuery,
              [newNickname, hashedPassword, userId],
              (err, updateResult) => {
                conn.release();
                if (err) {
                  console.log("닉네임 및 비밀번호 업데이트 중 오류 발생", err);
                  return res.json({ success: false, message: "업데이트 실패" });
                }

                console.log("닉네임 및 비밀번호 업데이트 성공");
                return res.json({
                  success: true,
                  message:
                    "닉네임 및 비밀번호가 성공적으로 업데이트되었습니다.",
                });
              }
            );
          }
        );
      });
    });
  } catch (error) {
    console.log("비밀번호 해싱 오류", error);
    return res.json({ success: false, message: "비밀번호 해싱 실패" });
  }
});

module.exports = router;
