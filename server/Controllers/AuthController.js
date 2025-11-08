// server/Controllers/AuthController.js - COMPLETE REPLACE
const userModel = require("../Modles/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { deleteMedia, uploadMedia } = require("../utils/cloudinary.js");

const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            email,
            password: hashedPassword,
            role: role || "student",
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully!",
            user: {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (e) {
        console.error("Registration error:", e);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        
        // ✅ FIXED: Use JWT_SECRET (not JWT_SECRET_KEY)
        const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
        
        if (!jwtSecret) {
            return res.status(500).json({
                success: false,
                message: "Server configuration error",
            });
        }
        
        const token = jwt.sign({ id: user._id }, jwtSecret, { 
            expiresIn: "7d" 
        });
        
        // ✅ SIMPLIFIED RESPONSE - Remove cookie complexity
        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.email}`,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            },
            token: token
        });

    } catch (e) {
        console.error("Login error:", e);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
        });
    }
};

const logout = (req, res) => {
    try {
        return res.status(200).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (e) {
        console.error("Logout error:", e);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId; // ✅ FIXED: Changed from tokenId to userId
        
        const user = await userModel
            .findById(userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Profile not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Profile found",
            success: true,
            user,
        });

    } catch (e) {
        console.error("Profile error:", e);
        res.status(500).json({
            message: "Error fetching profile",
            success: false,
        });
    }
};

// ✅ ADDED: editProfile function (SIMPLIFIED VERSION)
const editProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name } = req.body;

        console.log("🔄 Editing profile for user:", userId);
        console.log("📝 New name:", name);

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Profile not found",
                success: false,
            });
        }

        // Simple update - only name for now
        const updatedUser = await userModel.findByIdAndUpdate(
            userId, 
            { name }, 
            { new: true }
        ).select("-password");

        console.log("✅ Profile updated successfully");

        return res.status(200).json({
            success: true,
            updatedUser,
            message: "Profile updated successfully",
        });

    } catch (error) {
        console.error("❌ Error in editing profile:", error);
        res.status(500).json({
            message: "Error in editing profile",
            success: false,
            error: error.message,
        });
    }
};

// ✅ FIXED: Now includes editProfile in exports
module.exports = { register, login, getUserProfile, logout, editProfile };