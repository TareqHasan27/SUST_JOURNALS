const express = require("express");
const { updateUserProfile } = require("../controllers/profileController");
const { fetchUser } = require("../controllers/userController");
const router = express.Router();
router.post("/update", updateUserProfile);
router.get("/user", fetchUser);

module.exports = router;
