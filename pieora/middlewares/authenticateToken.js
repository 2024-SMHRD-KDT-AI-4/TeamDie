const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// ✅ JWT 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "인증 토큰이 필요합니다." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("🚨 JWT 인증 실패:", err.message);
      return res.status(403).json({ error: "유효하지 않은 토큰입니다." });
    }

    console.log("✅ JWT 인증 성공! 사용자 정보:", decoded); // 🔍 디버깅용
    req.user = decoded; // 요청 객체에 사용자 정보 저장
    next();
  });
};

module.exports = authenticateToken;
