// src/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// optional simple health-check route
// app.get("/", (req, res) => {
//   res.json({ ok: true, message: "Server running" });
// });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
