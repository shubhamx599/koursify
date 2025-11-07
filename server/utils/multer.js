const multer = require("multer");

// Configure multer to store files in memory instead of disk
const storage = multer.memoryStorage();

// Initialize upload middleware
const upload = multer({ storage });

module.exports = { upload };
