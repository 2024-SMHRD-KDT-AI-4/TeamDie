require("dotenv").config({ path: __dirname + '/.env' });

const express = require("express");
const cors = require("cors");
const { pool, testConnection } = require("./config/db");
const authRoutes = require("./routes/auth");
const cartRouter = require("./routes/cart");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");

const app = express();

// CORS 설정
app.use(cors({
  origin: process.env.REACT_APP_CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// COOP 헤더 추가 (OAuth 팝업 허용)
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.use(express.json());

// ✅ 라우터 등록 (순서 및 경로 정리)
app.use("/api", authRoutes);
app.use("/api/cartpage", cartRouter); // ✅ 장바구니 관련 API
app.use("/api/mypage", userRouter); // ✅ 유저 관련 APIs
app.use("/api/products", productRouter); // ✅ 제품 관련 API
app.use("/api/upload-health-records", userRouter); // ✅ 건강기록 업로드


app.use((req, res, next) => {
  console.log("📌 요청 받음:", req.method, req.url);
  next();
});

// 서버 시작
const PORT = process.env.SERVER_PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  testConnection();
});
