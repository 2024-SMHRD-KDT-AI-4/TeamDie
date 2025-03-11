const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer 토큰 가져오기
  if (!token) return res.status(401).json({ error: "인증 토큰이 필요합니다." });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "유효하지 않은 토큰입니다." });
    req.user = decoded; // 토큰에서 추출한 사용자 정보 저장
    next();
  });
};

// 로그인된 유저 정보 반환 API
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT email, nickname FROM member WHERE provider = ? AND provider_id = ?",
      [req.user.provider, req.user.provider_id]
    );

    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: "사용자 정보를 찾을 수 없습니다." });
    }

    res.json(rows[0]); // 사용자 정보 반환
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

module.exports = router;
