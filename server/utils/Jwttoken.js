// server/utils/Jwttoken.js
const jwt = require("jsonwebtoken");

const generateToken = (res, user, message) => {
  try {
    console.log("🔐 [JWT] Generating token for user:", user.email);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    console.log("🔐 [JWT] Token generated successfully");
    console.log("🔐 [JWT] Token preview:", token.substring(0, 20) + "...");

    // ✅ COOKIE OPTIONS
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    if (process.env.NODE_ENV === "production") {
      cookieOptions.domain = ".onrender.com";
    }

    console.log("🍪 [JWT] Cookie options set");

    // ✅ SEND RESPONSE
    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        message,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        token: token, // ✅ TOKEN IN RESPONSE BODY
      });
  } catch (error) {
    console.log("❌ [JWT] Error generating token:", error);
    return res.status(500).json({
      success: false,
      message: "Token generation failed",
    });
  }
};

module.exports = { generateToken };
