//프론트에서 요청이 들어오면 clova에 api를 불러와서 음성인식 해주는 코드
const express = require("express");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const app = express();

// 파일 업로드 설정
const upload = multer({ dest: "uploads/" });

router.post("/recognize", upload.single("audio"), async (req, res) => {
  try {
    // 업로드된 파일 경로
    const filePath = req.file.path;

    // Clova Speech API로 전송할 헤더와 파일 데이터
    const headers = {
      "Content-Type": "application/octet-stream",
      "X-NCP-APIGW-API-KEY-ID": "kq5bi7lkk4", // 발급받은 클라이언트 ID
      "X-NCP-APIGW-API-KEY": "VYcuux2PPa8ey83ODDeojmkbwb0Lx6Y7FcxzZtuz", // 발급받은 클라이언트 Secret
    };

    const fileStream = fs.createReadStream(filePath);

    // API 요청
    const response = await axios.post(
      "https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor",
      fileStream,
      { headers }
    );

    // 음성인식 결과
    const recognizedText = response.data.text;
    console.log("Recognized Text:", recognizedText);

    res.json({ recognizedText });
  } catch (error) {
    console.error(error);
    res.status(500).send("Speech recognition failed");
  }
});

module.exports = router;
