const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const router = express.Router();
const db_config = require('../config/db_config.json');
const app = express();

// Database connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  charset: 'utf8mb4', // 여기서 utf8mb4 설정
  debug: false,
});

// 로그인 여부 확인 미들웨어

// users 정보 불러오기
router.get('/getResult', (req, res) => {
  if (req.session && req.session.user) {
    const nickname = req.session.user?.nickname;

    // MySQL 쿼리를 통해 사용자 state 값 가져오기
    pool.query('SELECT state FROM users WHERE nickname = ?', [nickname], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Database query failed' });
      }

      if (results.length > 0) {
        const state = results[0].state;
        const nickname = results[0].nickname;

        // state 값에 따른 메시지 설정
        let message1;
        let message2;
        switch (state) {
          case '잼민이':
            message1 = '잼민이 등장!';
            message2 = '오늘도 신나게 놀 준비 완료~ ㅎㅎㅎ';
            break;
          case '샌애기':
            message1 = '축하해요, 새내기!';
            message2 = '새로운 시작을 응원할게요!';
            break;
          case 'K-고딩':
            message1 = '당장 주변 고등학교로 뛰어가서';
            message2 = '즐거운 대화를 나누세요!';
            break;
          case '화석':
            message1 = '복학생 환영!';
            message2 = '다시 돌아온 너의 열정을 응원해요!';
            break;
          case '삼촌':
            message1 = '삼촌 스타일 최고!';
            message2 = '유머 감각 빵빵하네요 ㅋㅋ';
            break;
          case '아재':
            message1 = '멋진 아재네요!';
            message2 = '경험에서 우러나오는 윾머 기대할게요.';
            break;
          default:
            message1 = '알 수 없는 상태입니다.';
            message2 = '다시 검사하세요.';
        }

        return res.json({
          state,
          nickname,
          message1,
          message2,
        });
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    });
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});

module.exports = router;
