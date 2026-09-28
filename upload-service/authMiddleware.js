const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      detail: "Authorization header is required",
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      detail: "Invalid authorization format",
    });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);

    if (payload.type !== "access") {
      return res.status(401).json({
        detail: "Invalid access token",
      });
    }

    if (payload.is_admin !== true) {
      return res.status(403).json({
        detail: "Admin access required",
      });
    }

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      detail: "Invalid or expired token",
    });
  }
}

module.exports = authenticateToken;