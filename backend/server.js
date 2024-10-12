const express = require("express");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const db_config = require("./config/db_config.json");
const app = express();
const cors = require("cors");

const sessionStoreOptions = {
  host: db_config.host,
  port: db_config.port,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  charset: "utf8mb4", // 여기서 utf8mb4 설정
};

const sessionStore = new MySQLStore(sessionStoreOptions);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const sessionMiddleware = session({
  key: "session_cookie_name",
  secret: "dasdasd!@#@!#@skja1#@!$!ASDasd", // 여기에 랜덤한 문자열 사용
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  unset: "destroy",
  cookie: {},
});

app.use(sessionMiddleware);

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.use(express.static(path.join(__dirname, "public")));

const mypageRoutes = require("./user/mypage");
const loginRoutes = require("./user/login");
const processRoutes = require("./user/process");
const signupRoutes = require("./user/signup");
const clovaRoutes = require("./speech/clova");
const take_slang_dbRoutes = require("./speech/take_slang_db");
const LoggedresultRoutes = require("./slang_test/logged_result");
const isLoggedresultRoutes = require("./slang_test/islogged_result");
const calledQuestionRoutes = require("./slang_test/calledQuestion");
const inputAnswerRoutes = require("./slang_test/inputAnswer");
const calledAnswerRoutes = require("./slang_test/calledAnswer");
const counting_examineRoutes = require("./slang_test/counting_examine");
const updateStateRoutes = require("./slang_test/updateState");
const view_AnswerRoutes = require("./slang_test/view_Answer");
const islogged_view_AnswerRoutes = require("./slang_test/islogged_view_Answer");
const delete_testRoutes = require("./user/delete_test");
const inputWordRoutes = require("./slang_test/inputWord");
const check_WordRoutes = require("./admin/check_Word");
const wordListRoutes = require("./admin/wordList");

//유저정보
app.use("/mypage", mypageRoutes);
app.use("/", updateStateRoutes);
app.use("/", loginRoutes);
app.use("/", processRoutes);
app.use("/", signupRoutes);

//보이스
app.use("/voice/talk", clovaRoutes);
app.use("/voice/talk", take_slang_dbRoutes);

//신조어테스트
app.use("/", calledQuestionRoutes);
app.use("/", inputAnswerRoutes);
app.use("/", calledAnswerRoutes);
app.use("/", counting_examineRoutes);
app.use("/logged/answer", view_AnswerRoutes);
app.use("/islogged/answer", islogged_view_AnswerRoutes);
app.use("/", delete_testRoutes);
app.use("/", inputWordRoutes);
app.use("/admin", check_WordRoutes);
app.use("/admin", wordListRoutes);
app.use("/Logged/type", LoggedresultRoutes);
app.use("/isLogged/type", isLoggedresultRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
