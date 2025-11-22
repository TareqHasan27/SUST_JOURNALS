const express = require("express");
const { searchPublishedPaper } = require("../controllers/searchController");
const router = express.Router();

router.post("/published", searchPublishedPaper);

module.exports = router;