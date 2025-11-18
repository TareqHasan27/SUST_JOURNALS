
const cloudinary = require("cloudinary").v2;
const express = require("express");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const router = express.Router();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret:process.env.API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pdf_uploads",
    resource_type: "raw",      
    allowedFormats: ["pdf"]   
  }
});

const upload = multer({ storage: storage });

router.post("/upload-pdf", upload.single("file"), (req, res) => {
  try {
    res.json({
      message: "PDF Uploaded Successfully!",
      url: req.file.path   // Cloudinary URL
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;