const express = require("express");
const db = require("../config/db"); // ✅ db 가져오기
const authenticateJWT = require("../middlewares/authenticateJWT"); // ✅ JWT 인증 미들웨어 적용
const cartRouter = express.Router();

// ✅ 장바구니 상품 가져오기 (특정 회원)
cartRouter.get("/cart", authenticateJWT, async (req, res) => { // ✅ 미들웨어 적용
    console.log("📌 장바구니 요청 - 현재 로그인된 사용자:", req.user);

    const userId = req.user.id; // ✅ provider_id 대신 user_id 사용
    if (!userId) {
        return res.status(401).json({ error: "로그인이 필요합니다." });
    }

    try {
        console.log(`📌 실행할 쿼리: SELECT * FROM cart WHERE user_id = '${userId}'`);
        const [results] = await db.pool.query("SELECT * FROM cart WHERE user_id = ?", [userId]);
        res.json(results);
    } catch (err) {
        console.error("📌 MySQL 오류:", err.message);
        res.status(500).json({ error: "서버 오류 발생: " + err.message });
    }
});

// ✅ 장바구니에 상품 추가
cartRouter.post("/cart", authenticateJWT, async (req, res) => {
    console.log("📌 장바구니 추가 요청 데이터:", req.body); // ✅ 추가된 디버깅 로그

    const userId = req.user.id;
    const { product_id, name, description, image, quantity, price } = req.body;

    if (!product_id || !name || quantity < 1 || !price) {
        console.log("❌ 필수 데이터 누락: ", { product_id, name, quantity, price }); // 추가된 디버깅
        return res.status(400).json({ error: "필수 항목을 모두 입력해야 합니다." });
    }

    try {
        const [existing] = await db.pool.query(
            "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
            [userId, product_id]
        );

        if (existing.length > 0) {
            await db.pool.query(
                "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
                [quantity, userId, product_id]
            );
            res.json({ message: "상품 수량이 증가되었습니다." });
        } else {
            const [result] = await db.pool.query(
                "INSERT INTO cart (user_id, product_id, name, description, image, quantity, price) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [userId, product_id, name, description, image, quantity, price]
            );
            res.json({ message: "상품이 장바구니에 추가되었습니다.", id: result.insertId });
        }
    } catch (err) {
        console.error("📌 장바구니 추가 오류:", err.message);
        res.status(500).json({ error: "데이터베이스 오류: " + err.message });
    }
});



// ✅ 장바구니 상품 수량 업데이트
cartRouter.put("/cart/:id", authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: "수량은 1 이상이어야 합니다." });
    }

    try {
        const [result] = await db.pool.query("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?", [quantity, req.params.id, userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "해당 상품을 찾을 수 없습니다." });
        }
        res.json({ message: "상품 수량이 변경되었습니다." });
    } catch (err) {
        res.status(500).json({ error: "서버 오류: " + err.message });
    }
});

// ✅ 장바구니에서 상품 삭제
cartRouter.delete("/cart/:id", authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    try {
        const [result] = await db.pool.query("DELETE FROM cart WHERE id = ? AND user_id = ?", [req.params.id, userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "삭제할 상품이 없습니다." });
        }
        res.json({ message: "상품이 삭제되었습니다." });
    } catch (err) {
        res.status(500).json({ error: "서버 오류: " + err.message });
    }
});

module.exports = cartRouter;