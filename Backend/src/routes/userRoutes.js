const express = require("express");
const { updateUserProfile } = require("../controllers/profileController");
const router = express.Router();
router.post("/update", updateUserProfile);

module.exports = router;