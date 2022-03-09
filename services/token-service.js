const jwt = require("jsonwebtoken");
const tokenSecret = process.env.JWT_TOKEN_SECRET;

class TokenService {
	generateToken(payload) {
		const token = jwt.sign(payload, tokenSecret, { expiresIn: "2d" });
		return token;
	}

	verifyToken(token) {
		return jwt.verify(token, tokenSecret);
	}
}

module.exports = new TokenService();
