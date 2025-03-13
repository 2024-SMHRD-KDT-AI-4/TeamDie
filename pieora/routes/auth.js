const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// JWT 시크릿 키 (환경 변수에서 가져오기)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// 회원가입 API
router.post("/signup", async (req, res) => {
  const { provider, provider_id, email, nickname } = req.body;

  if (!provider || !provider_id) {
    return res.status(400).json({ error: "provider와 provider_id는 필수입니다." });
  }

  try {
    const connection = await pool.getConnection();

    // 중복 사용자 확인
    const [rows] = await connection.execute(
      "SELECT * FROM member WHERE provider = ? AND provider_id = ?",
      [provider, provider_id]
    );

    if (rows.length > 0) {
      connection.release();
      return res.status(409).json({ error: "이미 가입된 사용자입니다.", alert: "이미 가입된 사용자입니다." });
    }

    // 사용자 정보 삽입
    await connection.execute(
      "INSERT INTO member (provider, provider_id, email, nickname) VALUES (?, ?, ?, ?)",
      [provider, provider_id, email || null, nickname || null]
    );

    // JWT 토큰 생성
    const token = jwt.sign(
      { provider_id, provider, email: email || null },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    connection.release();
    res.status(201).json({ message: "회원가입 성공", token, alert: "회원가입이 완료되었습니다!" });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json({ error: "서버 오류", alert: "회원가입 중 오류가 발생했습니다." });
  }
});

// 로그인 API
router.post("/login", async (req, res) => {
  const { provider, provider_id } = req.body;

  if (!provider || !provider_id) {
    return res.status(400).json({ error: "provider와 provider_id는 필수입니다.", alert: "입력값을 확인해주세요." });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM member WHERE provider = ? AND provider_id = ?",
      [provider, provider_id]
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({
        error: "가입되지 않은 사용자입니다. 회원가입을 진행해 주세요.",
        alert: "가입되지 않은 사용자입니다. 회원가입을 진행해주세요!"
      });
    }

    // 사용자 정보
    const user = rows[0];
    
    // JWT 토큰 생성
    const token = jwt.sign(
      { provider_id, provider, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    connection.release();
    res.status(200).json({
      message: "로그인 성공",
      token,
      user: { email: user.email, nickname: user.nickname },
      alert: "로그인 성공! 환영합니다."
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({ error: "서버 오류", alert: "로그인 중 오류가 발생했습니다." });
  }
});

module.exports = router;
