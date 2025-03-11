const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.sendStatus(401); // 인증되지 않은 사용자

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403); // 토큰이 유효하지 않음

        try {
            // provider_id를 이용해서 user_id 찾기
            const [results] = await db.pool.query("SELECT id FROM member WHERE provider_id = ?", [user.provider_id]);
            if (results.length === 0) {
                return res.status(401).json({ error: "유효하지 않은 사용자" });
            }

            req.user = { id: results[0].id }; // ✅ user_id 저장
            next();
        } catch (dbError) {
            console.error("DB 오류:", dbError.message);
            return res.status(500).json({ error: "서버 오류 발생" });
        }
    });
};

module.exports = authenticateJWT;
