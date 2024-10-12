const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const db_config = require("../config/db_config.json");

// MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 50,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});

// 단어 정보를 가져오는 라우트
router.get("/word/check/:id", (req, res) => {
  const wordId = req.params.id;
  if (!wordId) {
    console.error("Word ID is undefined");
    return res
      .status(400)
      .json({ error: "Invalid request: wordId is required" });
  }

  pool.getConnection((err, conn) => {
    if (err) {
      console.error("Database connection error:", err.message); // 내부 로그는 그대로
      return res.status(500).json({ error: "Internal server error" });
    }

    conn.query(
      "SELECT * FROM user_make_data WHERE id = ?",
      [wordId],
      (err, results) => {
        conn.release();
        if (err) {
          console.error("Error fetching data:", err.message);
          return res.status(500).json({ error: "Internal server error" });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "No data found" });
        }

        res.json(results[0]);
      }
    );
  });
});

// 승인 또는 반려 요청을 처리하는 라우트
router.post("/approve", (req, res) => {
  const { id, action, about_word, directionInput } = req.body; // about_word 받기
  if (!id || !action) {
    return res.status(400).json({
      success: false,
      message: "Invalid request: id and action are required",
    });
  }

  pool.getConnection((err, conn) => {
    if (err) {
      console.error("Database connection error:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Database server error" });
    }

    if (action === "approve") {
      // 승인 처리: 상태를 업데이트하고 meaning 업데이트
      const query =
        "UPDATE user_make_data SET status = ?, word_meaning = ?, directionInput = ? WHERE id = ?";
      conn.query(
        query,
        ["accept", about_word, directionInput, id],
        (err, results) => {
          if (err) {
            conn.release();
            console.error("Error updating word status:", err.message);
            return res
              .status(500)
              .json({ success: false, message: "Failed to approve word" });
          }

          if (results.affectedRows === 0) {
            conn.release();
            return res
              .status(404)
              .json({ success: false, message: "Word not found" });
          }

          // 데이터 삽입을 위해 user_make_data의 데이터 가져오기
          const selectQuery = "SELECT * FROM user_make_data WHERE id = ?";
          conn.query(selectQuery, [id], (err, selectResults) => {
            if (err) {
              conn.release();
              console.error("Error fetching word data:", err.message);
              return res
                .status(500)
                .json({ success: false, message: "Failed to fetch word data" });
            }

            const wordData = selectResults[0];
            if (!wordData) {
              conn.release();
              return res.status(404).json({
                success: false,
                message: "Word data not found for insertion",
              });
            }

            // question 테이블에 데이터 삽입
            const insertQuery = `
            INSERT INTO question (slang_word, year, text1, text2, answer, meaning, value)
            VALUES (?, ?, ?, ?, ?, ?,?)
          `;
            const insertValues = [
              wordData.word, // slang_word
              wordData.year, // year
              wordData.text1, // text1
              wordData.text2, // text2
              wordData.meaning, // answer
              about_word, // meaning (word_meaning으로 사용)
              directionInput,
            ];

            conn.query(insertQuery, insertValues, (err, insertResults) => {
              if (err) {
                conn.release();
                console.error(
                  "Error inserting into question table:",
                  err.message
                );
                return res.status(500).json({
                  success: false,
                  message: "Failed to insert data into question table",
                });
              }

              // 삽입 후 user_make_data 테이블에서 데이터 삭제
              const deleteQuery = "DELETE FROM user_make_data WHERE id = ?";
              conn.query(deleteQuery, [id], (err, deleteResults) => {
                conn.release();
                if (err) {
                  console.error("Error deleting word:", err.message);
                  return res.status(500).json({
                    success: false,
                    message: "Failed to delete word after insertion",
                  });
                }

                if (deleteResults.affectedRows === 0) {
                  return res.status(404).json({
                    success: false,
                    message: "Word not found for deletion",
                  });
                }

                res.json({
                  success: true,
                  message:
                    "Word successfully approved, inserted, and deleted from user_make_data.",
                });
              });
            });
          });
        }
      );
    } else if (action === "reject") {
      // 반려 처리: 데이터를 삭제
      const deleteQuery = "DELETE FROM user_make_data WHERE id = ?";
      conn.query(deleteQuery, [id], (err, results) => {
        conn.release();
        if (err) {
          console.error("Error deleting word:", err.message);
          return res.status(500).json({
            success: false,
            message: "Failed to reject and delete word",
          });
        }

        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Word not found" });
        }

        res.json({
          success: true,
          message: "Word successfully rejected and deleted.",
        });
      });
    } else {
      conn.release();
      res.status(400).json({
        success: false,
        message: "Invalid action. Allowed actions are 'approve' or 'reject'.",
      });
    }
  });
});

module.exports = router;
