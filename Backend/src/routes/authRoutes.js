const express = require("express");
const { createUser, login, verifyEmail, forgetPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();
router.post("/register", createUser);
router.post("/login",login);
router.post("/verify-otp", verifyEmail);
router.post("/forgotpassword", forgetPassword);
router.post("/reset", resetPassword);

module.exports = router;