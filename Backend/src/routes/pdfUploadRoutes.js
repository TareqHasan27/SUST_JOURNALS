const cloudinary = require("cloudinary").v2;
const express = require("express");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "career-platform",
    resource_type: "raw",
    allowed_formats: ["pdf,jpg,png,jpeg"],
    public_id: (req, file) => {
      // Generate unique filename
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\.[^/.]+$/, ""); // Remove extension
      return `${timestamp}-${originalName}`;
    },
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// PDF Upload Route
router.post("/upload-pdf", (req, res) => {
  const handler = upload.single("file");

  handler(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "File too large. Maximum size is 50MB.",
        });
      }

      return res.status(400).json({
        error: err.message || "Upload failed",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "No file received. Make sure the form field is named 'file'.",
      });
    }

    try {
      // Get the Cloudinary URL
      const url = req.file.path || req.file.secure_url || req.file.url;

      console.log("PDF uploaded successfully:", url);

      return res.json({
        success: true,
        message: "PDF uploaded successfully!",
        url: url,
        file: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error) {
      console.error("Upload handler error:", error);
      return res.status(500).json({
        error: "Failed to process upload",
        message: error.message,
      });
    }
  });
});

module.exports = router;
