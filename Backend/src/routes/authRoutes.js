const express = require("express");
const { createUser, login, verifyEmail, forgetPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();
router.post("/register", createUser);
router.post("/login",login);
router.get("/verify/:token", verifyEmail);
router.post("/forgotpassword", forgetPassword);
router.post("/reset", resetPassword);

module.exports = router;