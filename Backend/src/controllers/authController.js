const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../config/sendEmail.js");
exports.createUser = (req, res)=>{
    const {reg_no, email, password, role} = req.body;
    if(!reg_no || !email || !password || !role){
        return res.status(400).json({message : "All fields are required"});
    }
    db.query("SELECT * FROM users WHERE email = ?", [email], async(error, results)=>{
        if(error){
            return res.status(500).json(error);
        }
        if(results.length){
            return res.status(400).json({message : "This Email is already in used."});
        }
        const reg = reg_no;
        const hashpassword =  await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const createdAt = new Date();
        const sql = "INSERT INTO users(reg_no, email, password_hash, role, created_at, isVerified, verificationToken) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await db.promise().query(sql, [reg, email, hashpassword, role, createdAt, false, verificationToken]);
        const verifyUrl = `http://localhost:4000/api/auth/verify/${verificationToken}`;
        await sendEmail(
            email,
            "Verify Your account.",
            `<p>Hello ${reg_no},</p>
            <p>Please verify your email by clicking below:</p>
            <a href="${verifyUrl}">Verify Email</a>`
        );
        res.status(201).json({ message: "User Created Successfully. Now verify your mail.", reg_no });
    });
};

exports.login = (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: "Email and Password must be needed.."});
    }
    db.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
        if(error){
            return res.status(500).json(error);
        }
        if(results.length===0){
            return res.status(400).json({message: "Invalid email."});
        }
        const user = results[0];
        if(!user.isVerified){
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }
        if(user.password_hash !== bcrypt.hash(password, 10)){
            return res.status(400).json({message : "Invalid password."});
        }
        res.json({
            message: "Login successfully",
            user : {
                id : user.reg_no,
                role : user.role,
                email : user.email,
            }
        });
    });
};

exports.verifyEmail = (req, res) => {
    const { token } = req.params;

    if (!token) return res.status(400).json({ message: "Token missing." });

    db.query("SELECT * FROM users WHERE verificationToken = ?", [token], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error." });
        if (results.length === 0) return res.status(400).json({ message: "Invalid or expired token." });

        const user = results[0];

        db.query("UPDATE users SET isVerified = true, verificationToken = NULL WHERE id = ?", [user.id], (err2) => {
            if (err2) return res.status(500).json({ message: "Database error while updating user." });

            res.send("<h1>Email verified successfully! You can now log in.</h1>");
        });
    });
};