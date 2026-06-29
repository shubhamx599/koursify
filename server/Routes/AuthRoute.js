// server/Routes/AuthRoute.js
const express = require("express");
const { register, login, getUserProfile, logout, editProfile, switchRole } = require("../Controllers/AuthController.js");
const { isAuthenticated } = require("../MIddlewares/isAuthenticated.js");
const { upload } = require("../utils/multer.js");

const router = express.Router();

router.post("/register", register);
router.get("/logout", logout);
router.post("/login", login);
router.get("/get-profile", isAuthenticated, getUserProfile);
router.put("/get-profile/update-Profile", isAuthenticated, upload.single("profilePhoto"), editProfile);
router.put("/switch-role", isAuthenticated, switchRole);

module.exports = router;