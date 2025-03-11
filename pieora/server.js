require("dotenv").config({ path: __dirname + '/.env' });

const express = require("express");
const cors = require("cors");
const { pool, testConnection } = require("./config/db");
const authRoutes = require("./routes/auth");
const cartRouter = require("./routes/cart");
const userRouter = require("./routes/user");

const app = express();

// CORS 설정 (동적 origin 가능)
app.use(cors({
  origin: process.env.REACT_APP_CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ PUT 추가
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// COOP 헤더 추가 (OAuth 팝업 허용)
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.use(express.json());

// 라우터 등록
app.use("/api", authRoutes);
app.use("/api/cartpage", cartRouter);
app.use("/api/mypage", userRouter);


// 서버 시작
const PORT = process.env.SERVER_PORT || 5050;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  testConnection();
});