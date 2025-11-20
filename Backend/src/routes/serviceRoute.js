const express = require("express");
const { addBookMark, removeBookMark, recommendedPapers } = require("../controllers/serviceController");
const { uploadPaper } = require("../controllers/paperUploadController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/addbookmark",addBookMark);
router.post("/removebookmark", removeBookMark);
router.get("/recommendedPapers",protect, recommendedPapers);
router.post("/uploadPaper", uploadPaper);

module.exports = router;