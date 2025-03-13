const express = require("express");
const router = express.Router();
const { pool } = require("../config/db"); // ✅ pool 가져오기

// 상품 목록 가져오기 API
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM product ORDER BY product_id DESC LIMIT 4");
    res.json(rows); // JSON 형태로 응답
  } catch (err) {
    console.error("❌ 상품 데이터 조회 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

// 상품 상세 정보 조회 API
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const [rows] = await pool.query(
      "SELECT product_id, product_name, product_description, product_price, product_image_path FROM product WHERE product_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    res.json(rows[0]); // ✅ JSON 형식으로 상품 정보 반환
  } catch (err) {
    console.error("❌ 상품 데이터 조회 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

module.exports = router;
