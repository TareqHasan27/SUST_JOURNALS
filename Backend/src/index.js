require("dotenv").config();

const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const authRouter = require("./routes/authRoutes");
const userRouter = require("../src/routes/userRoutes");
const serviceRouter = require("./routes/serviceRoute");
//const pdfUploadRouter = require("./routes/pdfUploadRoutes");
///const { default: chatRouter } = require("./routes/chat");


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/profile", userRouter);
app.use("/api/service", serviceRouter);
//app.use("/api/pdf", pdfUploadRouter);
//app.use("/api/overview",chatRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
