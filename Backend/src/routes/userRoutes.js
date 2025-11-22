const express = require("express");
const { updateUserProfile } = require("../controllers/profileController");
const { fetchUser, fetchProfile } = require("../controllers/userController");
const router = express.Router();
router.post("/update", updateUserProfile);
router.get("/user", fetchUser);
router.get("/:reg_no", fetchProfile);

module.exports = router;
