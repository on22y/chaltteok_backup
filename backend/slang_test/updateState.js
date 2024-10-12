// logged_result.js
const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const db_config = require("../config/db_config.json");

// Database pool 설정
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

// POST 요청을 처리하는 라우트
router.post("/loading/updateState", (req, res) => {
  const nickname = req.body.nickname;
  // 서버로 전달된 닉네임을 로그로 출력
  console.log("서버에서 받은 닉네임:", nickname);
  if (!nickname) {
    return res.status(400).json({ message: "닉네임이 제공되지 않았습니다." });
  }

  let age_change = 19; // age_change의 초기값은 19

  // user_answers 테이블에서 해당 닉네임에 해당하는 행들을 모두 조회
  pool.query(
    "SELECT similarity, year FROM user_answers WHERE nickname = ?",
    [nickname],
    (error, results) => {
      if (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).send("Server error");
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No data found for the given nickname" });
      }

      console.log("Fetched user data:", results);

      // 모든 행에 대해 바로 age_change 계산
      results.forEach((row) => {
        const similarity = row.similarity; // similarity는 accuracy에 해당
        const year = row.year;

        // 조건에 따른 나이 변화 계산 및 age_change 업데이트
        if (year === 2024) {
          if (similarity >= 75) {
            age_change -= 1.5;
          } else if (similarity === -50) {
            // 변동 없음
          } else {
            age_change += 1.5;
          }
        } else if (year === 2023) {
          if (similarity >= 75) {
            age_change -= 1.0;
          } else if (similarity === -50) {
            // 변동 없음
          } else {
            age_change += 2;
          }
        } else if (year >= 2020 && year <= 2022) {
          if (similarity >= 75) {
            age_change -= 0.5;
          } else if (similarity === -50) {
            // 변동 없음
          } else {
            age_change += 2;
          }
        } else if (year >= 2010) {
          if (similarity >= 75) {
            age_change -= 0.5;
          } else if (similarity === -50) {
            // 변동 없음
          } else {
            age_change += 1.0;
          }
        } else if (year >= 2000) {
          if (similarity === -50) {
            // 변동 없음
          } else if (similarity < 75) {
            age_change += 1.0;
          }
        }
      });
      // 나이에 따른 상태(state) 설정
      let state = "";
      if (age_change < 17) {
        state = "잼민이";
      } else if (age_change >= 17 && age_change < 19) {
        state = "K-고딩";
      } else if (age_change >= 19 && age_change < 22) {
        state = "샌애기";
      } else if (age_change >= 22 && age_change < 25) {
        state = "화석";
      } else if (age_change >= 25 && age_change < 34) {
        state = "삼촌";
      } else {
        state = "아재";
      }
      // users 테이블에서 nickname에 해당하는 사용자의 나이를 업데이트
      pool.query(
        "UPDATE users SET age = ?, state = ? WHERE nickname = ?",
        [age_change, state, nickname],
        (updateError, updateResults) => {
          if (updateError) {
            console.error("Error updating user age:", updateError);
            return res.status(500).send("Server error while updating age");
          }

          // 나이 업데이트 성공 시 결과 반환
          res.json({
            message: "Age and state updated successfully",
            nickname,
            updatedAge: age_change,
            updatedState: state,
          });
        }
      );
    }
  );
});

router.post("/logged/loading/updateState", (req, res) => {
  const nickname = req.session.user.nickname;

  // 서버로 전달된 닉네임을 로그로 출력
  console.log("서버에서 받은 닉네임:", nickname);
  if (!nickname) {
    return res.status(400).json({ message: "닉네임이 제공되지 않았습니다." });
  }

  // user_answers와 users 테이블을 조인하여 필요한 데이터 한 번에 조회
  const query = `
    SELECT ua.similarity, ua.year, u.age 
    FROM user_answers ua 
    JOIN users u ON ua.nickname = u.nickname 
    WHERE ua.nickname = ?
  `;

  pool.query(query, [nickname], (error, results) => {
    if (error) {
      console.error("Error fetching user data:", error);
      return res.status(500).send("Server error");
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the given nickname" });
    }

    let age_change = results[0].age; // 초기 나이는 users 테이블에서 가져옴

    // 모든 행에 대해 age_change 계산
    results.forEach((row) => {
      const { similarity, year } = row;

      // 유효한 값이 있는지 확인
      if (typeof similarity !== "number" || typeof year !== "number") {
        console.error("Invalid data in the result set.");
        return res.status(500).send("Invalid data.");
      }

      // 나이 변화 계산
      if (year === 2024) {
        if (similarity >= 75) {
          age_change -= 1.5;
        } else if (similarity !== -50) {
          age_change += 1.5;
        }
      } else if (year === 2023) {
        if (similarity >= 75) {
          age_change -= 1.0;
        } else if (similarity !== -50) {
          age_change += 2;
        }
      } else if (year >= 2020 && year <= 2022) {
        if (similarity >= 75) {
          age_change -= 0.5;
        } else if (similarity !== -50) {
          age_change += 2;
        }
      } else if (year >= 2010) {
        if (similarity >= 75) {
          age_change -= 0.5;
        } else if (similarity !== -50) {
          age_change += 1.0;
        }
      } else if (year >= 2000 && similarity < 75) {
        age_change += 1.0;
      } else {
        age_change += 0;
      }
    });

    // 나이에 따른 상태(state) 설정
    let state = "";
    if (age_change < 17) {
      state = "잼민이";
    } else if (age_change >= 17 && age_change < 19) {
      state = "K-고딩";
    } else if (age_change >= 19 && age_change < 22) {
      state = "샌애기";
    } else if (age_change >= 22 && age_change < 25) {
      state = "화석";
    } else if (age_change >= 25 && age_change < 34) {
      state = "삼촌";
    } else {
      state = "아재";
    }

    // users 테이블에서 nickname에 해당하는 사용자의 나이와 상태를 업데이트
    pool.query(
      "UPDATE users SET age = ?, state = ? WHERE nickname = ?",
      [age_change, state, nickname],
      (updateError, updateResults) => {
        if (updateError) {
          console.error("Error updating user age and state:", updateError);
          return res
            .status(500)
            .send("Server error while updating age and state");
        }

        // 나이와 상태 업데이트 성공 시 결과 반환
        res.json({
          message: "Age and state updated successfully",
          nickname,
          updatedAge: age_change,
          updatedState: state,
        });
      }
    );
  });
});

module.exports = router;
