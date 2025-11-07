const express = require("express");
const multer = require("multer");
const { uploadMedia } = require("../utils/cloudinary.js");

const router = express.Router();

// Configure Multer to store files in memory (instead of disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/uploadVideo", upload.single("file"), async (req, res) => {
    try {
        console.log("🔹 Upload request received");

        if (!req.file) {
            console.error("❌ No file uploaded.");
            return res.status(400).json({ message: "No file uploaded", success: false });
        }

        console.log(`📁 File received: ${req.file.originalname} (${req.file.mimetype})`);

        // Convert file buffer to base64 before uploading to Cloudinary
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        console.log("🚀 Uploading file to Cloudinary...");
        const result = await uploadMedia(fileBase64); // Uploading buffer data

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
