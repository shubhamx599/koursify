const express = require("express");
const multer = require("multer");
const { uploadMedia } = require("../utils/cloudinary.js");
const { isAuthenticated, requireInstructor } = require("../MIddlewares/isAuthenticated.js");

const router = express.Router();

// Configure Multer to store files in memory (instead of disk)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024,
    },
    fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith("video/")) {
            return callback(new Error("Only video uploads are allowed"));
        }
        callback(null, true);
    },
});

router.post("/uploadVideo", isAuthenticated, requireInstructor, upload.single("file"), async (req, res) => {
    try {
        console.log("🔹 Upload request received");

        if (!req.file) {
            console.error("❌ No file uploaded.");
            return res.status(400).json({ message: "No file uploaded", success: false });
        }

        console.log(`📁 File received: ${req.file.originalname} (${req.file.mimetype})`);

        console.log("🚀 Uploading file to Cloudinary...");
        const result = await uploadMedia(req.file.buffer); // Uploading buffer data directly

        console.log("✅ Upload successful!");
        console.log("🌐 Cloudinary Response:", result);

        res.status(200).json({
            message: "File uploaded successfully",
            data: result,
            success: true,
        });
    } catch (e) {
        console.error("❌ Error during upload:", e.message);
        res.status(500).json({
            message: "Error uploading file",
            success: false,
        });
    }
});

module.exports = router;
