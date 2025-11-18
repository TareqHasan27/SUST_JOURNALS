const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../config/sendEmail.js");
exports.createUser = (req, res) => {
  const { reg_no, email, password, role } = req.body;
  if (!reg_no || !email || !password || !role) {
      console.log("Missing fields");
    return res.status(400).json({ message: "All fields are required" });
  }
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        return res.status(500).json(error);
      }
      if (results.length) {
        return res
          .status(400)
          .json({ message: "This Email is already in used." });
      }
      const reg = reg_no;
      const hashpassword = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomInt(100000, 1000000).toString();
      const createdAt = new Date();
      const sql =
        "INSERT INTO users(reg_no, email, password_hash, role, created_at, isVerified, verificationToken) VALUES (?, ?, ?, ?, ?, ?, ?)";
      await db
        .promise()
        .query(sql, [
          reg,
          email,
          hashpassword,
          role,
          createdAt,
          false,
          verificationToken,
        ]);
      const sqlProfile = "INSERT INTO user_profiles (reg_no) VALUES (?)";
      await db.promise().query(sqlProfile, [reg]);
      await sendEmail(
        email,
        "Verify Your Account",
        `<p>Your verification code is: <b>${verificationToken}</b></p>`
      );
      res.status(201).json({
        message: "User Created Successfully. Now verify your mail.",
        reg_no,
      });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and Password must be needed.." });
  }
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        return res.status(500).json(error);
      }
      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid email." });
      }
      const user = results[0];
      if (!user.isVerified) {
        return res
          .status(403)
          .json({ message: "Please verify your email before logging in." });
      }
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password." });
      }

      const payload = {
        id: user.reg_no,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "2d",
      });
      res.json({
        message: "Login successfully",
        user: {
          id: user.reg_no,
          role: user.role,
          email: user.email,
        },
        token: token,
      });
    }
  );
};

exports.verifyEmail = async (req, res) => {
  const { otp } = req.body;

  if (!otp) return res.status(400).json({ message: "Token missing." });

  db.query(
    "SELECT * FROM users WHERE verificationToken = ?",
    [otp],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error." });
      if (results.length === 0)
        return res.status(400).json({ message: "Invalid verification token." });

      const user = results[0];
      if (user.isVerified) {
        return res
          .status(200)
          .json({ message: "Email is already verified! You can now login." });
      }

      db.query(
        "UPDATE users SET isVerified = true, verificationToken = NULL WHERE reg_no = ?",
        [user.reg_no],
        (err2) => {
          if (err2)
            return res
              .status(500)
              .json({ message: "Database error while updating user." });

          res.send(`<h1>Email verified successfully! You can now log in.</h1>`);
        }
      );
    }
  );
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required.." });
  }
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      if (results.length === 0) {
        return res.status(400).json({ message: "Email not found.." });
      }
      const resetToken = crypto.randomInt(100000, 1000000).toString();
      await db
        .promise()
        .query("UPDATE users SET reset_token = ? WHERE email = ?", [
          resetToken,
          email,
        ]);
      await sendEmail(
        email,
        "Reset your password",
        `<p>Your password reset code is : <b>${resetToken}</b></p>`
      );
      res.status(200).json({ message: "Email Found. go to the next step" });
    }
  );
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;
  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are require.." });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "passwoed don't match.." });
  }
  db.query(
    "SELECT * FROM users WHERE reset_token = ?",
    [token],
    async (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid token" });
      }
      const user = results[0];
      const hashedPassword = await bcrypt.hash(confirmPassword, 10);
      await db
        .promise()
        .query(
          "UPDATE users SET password_hash = ? , reset_token = NULL WHERE reg_no = ?",
          [hashedPassword, user.reg_no]
        );
      res.status(200).json({ message: "Password updated successfully" });
    }
    db.query("SELECT * FROM users WHERE reset_token = ?", [token], async(error, results) => {
        if(error){
            return res.status(500).json({error});
        }
        if(results.length === 0){
            return res.status(400).json({message : "Invalid token"});
        }
        const user = results[0];
        const hashedPassword = await bcrypt.hash(confirmPassword, 10);
        await db.promise().query("UPDATE users SET password_hash = ? , reset_token = NULL WHERE reg_no = ?", [hashedPassword, user.reg_no]);
        res.status(200).json({message : "Password updated successfully"});
    });
};



