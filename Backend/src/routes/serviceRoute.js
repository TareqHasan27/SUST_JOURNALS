const express = require("express");
const router = express.Router();

const {
  addBookMark,
  removeBookMark,
  fetchAllBookMark,
  recommendedPapers,
} = require("../controllers/serviceController");

const { uploadPaper } = require("../controllers/paperUploadController");
const { fetchUser, rank } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { notifyUser } = require("../controllers/notificattionController");

// Bookmark routes
router.post("/addbookmark", addBookMark);
router.post("/removebookmark", removeBookMark);
router.post("/allbookmarks", fetchAllBookMark);

// Recommended papers (requires auth)
router.get("/recommendedpapers", protect, recommendedPapers);

// Upload paper
router.post("/uploadPaper", uploadPaper);

// User-related routes
router.get("/fetchuser", protect, fetchUser);
router.get("/rank", rank);

//notify user
router.post("/notifyuser", notifyUser);

module.exports = router;
