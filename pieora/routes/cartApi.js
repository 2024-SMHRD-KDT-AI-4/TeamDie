require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect(err => {
    if (err) {
        console.error("DB 연결 실패 : " + err.stack);
        return;
    }
    console.log("DB 연결 성공");
});

const cartRouter = express.Router();

// 장바구니 상품 가져오기
cartRouter.get("/cart", (req, res) => {
    db.query("SELECT * FROM cart", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 장바구니에 상품 추가
cartRouter.post("/cart", (req, res) => {
    const { name, description, image, quantity, price } = req.body;
    const sql = "INSERT INTO cart (name, description, image, quantity, price) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, description, image, quantity, price], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "상품이 추가되었습니다.", id: result.insertId });
    });
});

// 장바구니 상품 수량 업데이트
cartRouter.put("/cart/:id", (req, res) => {
    const { quantity } = req.body;
    const sql = "UPDATE cart SET quantity = ? WHERE id = ?";
    db.query(sql, [quantity, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "상품 수량이 변경되었습니다." });
    });
});

// 장바구니에서 상품 삭제
cartRouter.delete("/cart/:id", (req, res) => {
    const sql = "DELETE FROM cart WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "상품이 삭제되었습니다." });
    });
});

module.exports = cartRouter;