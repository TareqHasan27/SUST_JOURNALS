require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("../src/routes/userRoutes");
const serviceRouter = require("./routes/serviceRoute");
const searchRouter = require("./routes/searchRoutes");
// const pdfUploadRouter = require("./routes/pdfUploadRoutes");
const chatRouter = require("./routes/chat"); // Make sure this file exists
// const adminRouter = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/profile", userRouter);
app.use("/api/service", serviceRouter);
// app.use("/api/pdf", pdfUploadRouter);
//app.use("/api/overview", chatRouter);
// app.use("/api/admin", adminRouter);
app.use("/api/papers", searchRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});