require("dotenv").config({ path: __dirname + '/.env' }); // 경로 지정


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { pool, testConnection } = require("./config/db");
const authRoutes = require("./routes/auth");



const app = express();
app.use(cors());
app.use(express.json());

// 라우터 등록
app.use("/api", authRoutes);

// 서버 시작
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  testConnection();
});