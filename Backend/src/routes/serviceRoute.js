const express = require("express");
const { addBookMark, removeBookMark } = require("../controllers/serviceController");
const { uploadPaper } = require("../controllers/paperUploadController");
const router = express.Router();
router.post("/addbookmark",addBookMark);
router.post("/removebookmark", removeBookMark);

router.post("/uploadPaper", uploadPaper);

module.exports = router;