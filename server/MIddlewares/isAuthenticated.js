// server/MIddlewares/isAuthenticated.js
const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader
      ? authHeader.replace("Bearer ", "")
      : null;

    const token = tokenFromHeader;

    if (!token) {
      return res.status(401).json({
        message: "Please login to access this resource",
        success: false,
      });
    }

    // ✅ FIXED: Use JWT_SECRET (not JWT_SECRET_KEY)
    const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;

    if (!jwtSecret) {
      return res.status(500).json({
        message: "Server configuration error",
        success: false,
      });
    }

    const decode = jwt.verify(token, jwtSecret);

    req.userId = decode.id; // ✅ FIXED: Changed from tokenId to userId
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Login session expired, please login again",
        success: false,
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token, please login again",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

module.exports = { isAuthenticated };
