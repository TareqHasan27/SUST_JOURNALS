const express = require("express");
const { addBookMark, removeBookMark, recommendedPapers, recommendedPapers } = require("../controllers/serviceController");
const { uploadPaper } = require("../controllers/paperUploadController");
const { protect } = require("../middleware/authMiddleware");
const { addBookMark, removeBookMark, fetchAllBookMark } = require("../controllers/serviceController");
const { uploadPaper } = require("../controllers/paperUploadController");
const { protect } = require("../middleware/authMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { fetchUser, rank } = require("../controllers/userController");
const router = express.Router();

router.post("/addbookmark",addBookMark);
router.post("/removebookmark", removeBookMark);
router.get("/recommendedPapers",protect, recommendedPapers);router.get("/recommendedPapers",protect, recommendedPapers);
router.post("/allbookmarks", fetchAllBookMark);

router.post("/uploadPaper", uploadPaper);

router.get("/fetchuser", protect, fetchUser);
//router.get("/rank",rank);

module.exports = router;