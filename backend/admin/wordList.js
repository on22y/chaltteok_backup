// 제보된 단어 정보(단어, 유행년도, 첫 번째 예시 대화)를 서버에서 불러와 단어 목록에 추가하는 코드

const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const router = express.Router();
const db_config = require('../config/db_config.json');

// MySQL 연결 설정
const pool = mysql.createPool({
  connectionLimit: 50,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});

// 단어 목록 불러오기
router.post('/word/list', (req, res) => {
  res.setHeader('Cache-Control', 'no-store'); // 캐시 비활성화
  pool.getConnection((err, conn) => {
    if (err) {
      console.error('Database connection error:', err.message); // 내부 로그는 그대로
      return res.status(500).json({ error: 'Internal server error' });
    }

    // 모든 단어 목록 조회 쿼리
    conn.query('SELECT id, word, year, text1 FROM user_make_data', (err, results) => {
      conn.release();
      if (err) {
        console.error('Error fetching data:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No data found' });
      }

      res.json(results);
    });
  });
});

module.exports = router;
