//db서버에서 신조어 비교해서 평어로 바꿔주는 코드
const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const db_config = require("../config/db_config.json");
const app = express();

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

// 신조어 매핑 가져오는 함수
const getSlangMappings = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT slang, normal_word FROM slang_mapping";
    pool.query(query, (error, results) => {
      if (error) {
        return reject(error);
      }
      const slangMappings = {};
      results.forEach((row) => {
        slangMappings[row.slang] = row.normal_word;
      });
      resolve(slangMappings);
    });
  });
};

// 신조어를 평어로 변환하는 함수
const replaceSlangWithNormalWords = async (text) => {
  try {
    const slangMappings = await getSlangMappings();
    let updatedText = text;

    // 신조어를 평어로 변환
    Object.keys(slangMappings).forEach((slang) => {
      const regex = new RegExp(slang, "g");
      updatedText = updatedText.replace(regex, slangMappings[slang]);
    });

    return updatedText;
  } catch (error) {
    console.error("신조어 변환 중 오류 발생:", error);
    return text;
  }
};

// POST 요청으로 신조어 변환을 처리
router.use(express.json()); // JSON 바디 파싱

router.post("/replace-slang", async (req, res) => {
  const { transcript } = req.body;

  try {
    const updatedTranscript = await replaceSlangWithNormalWords(transcript);
    res.json({ updatedTranscript });
  } catch (error) {
    console.error("변환 처리 중 오류:", error);
    res.status(500).json({ error: "변환 실패" });
  }
});
module.exports = router;
