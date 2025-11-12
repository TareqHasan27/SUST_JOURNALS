const express = require("express");
const { createUser, login, verifyEmail } = require("../controllers/authController");

const router = express.Router();
router.post("/register", createUser);
router.post("/login",login);
router.get("/verify/:token", verifyEmail);

module.exports = router;