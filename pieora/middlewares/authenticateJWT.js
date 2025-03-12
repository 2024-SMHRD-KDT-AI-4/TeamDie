const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authenticateJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("🚨 JWT 인증 실패: 토큰 없음");
        return res.sendStatus(403);
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.log("🚨 JWT 인증 실패: 유효하지 않은 토큰", err.message);
            return res.sendStatus(403);
        }

        console.log("✅ JWT 해석 성공, provider_id:", decoded.provider_id);

        try {
            const [results] = await db.pool.query(
                "SELECT id FROM member WHERE provider_id = ?", 
                [decoded.provider_id]
            );

            if (results.length === 0) {
                console.log("🚨 인증 실패: 해당 provider_id의 회원 없음");
                return res.sendStatus(403);
            }

            req.user = { id: results[0].id };
            console.log("✅ 인증 성공, user_id:", req.user.id);
            next();
        } catch (dbError) {
            console.error("🚨 DB 오류:", dbError.message);
            return res.status(500).json({ error: "서버 오류 발생" });
        }
    });
};

module.exports = authenticateJWT;
