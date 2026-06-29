const prisma = require("../Config/prisma.js");
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

        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email.",
            });
        }

        const userRole = role === "instructor" ? "instructor" : "student";
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: userRole,
            }
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully!",
            user: {
                id: newUser.id,
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

        const user = await prisma.user.findUnique({ where: { email } });
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
        
        const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
        
        if (!jwtSecret) {
            return res.status(500).json({
                success: false,
                message: "Server configuration error",
            });
        }
        
        const token = jwt.sign({ id: user.id }, jwtSecret, { 
            expiresIn: "7d" 
        });
        
        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.email}`,
            user: {
                id: user.id,
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
        const userId = req.userId;
        
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                photoUrl: true,
                photoPublicId: true,
                enrolledCourses: {
                    include: {
                        creator: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                photoUrl: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "Profile not found",
                success: false,
            });
        }

        const userWithMongoId = {
            ...user,
            _id: user.id,
            enrolledCourses: user.enrolledCourses.map(course => ({
                ...course,
                _id: course.id,
                creator: course.creator ? { ...course.creator, _id: course.creator.id } : null
            }))
        };

        return res.status(200).json({
            message: "Profile found",
            success: true,
            user: userWithMongoId,
        });

    } catch (e) {
        console.error("Profile error:", e);
        res.status(500).json({
            message: "Error fetching profile",
            success: false,
        });
    }
};

const editProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                message: "Profile not found",
                success: false,
            });
        }

        const updateData = {};
        if (typeof name === "string") {
            updateData.name = name.trim();
        }

        if (req.file) {
            const uploadResponse = await uploadMedia(req.file.buffer);
            updateData.photoUrl = uploadResponse.secure_url;
            updateData.photoPublicId = uploadResponse.public_id;

            if (user.photoPublicId) {
                await deleteMedia(user.photoPublicId);
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                photoUrl: true,
                photoPublicId: true
            }
        });

        const userWithMongoId = {
            ...updatedUser,
            _id: updatedUser.id
        };

        return res.status(200).json({
            success: true,
            updatedUser: userWithMongoId,
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

module.exports = { register, login, getUserProfile, logout, editProfile };
