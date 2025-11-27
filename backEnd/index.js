const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");

require("./models/db");
const userRouter = require("./routes/userRouter");
const assignmentRouter = require("./routes/assignmentRouter");


const uploadRoutes = require("./routes/uploadRoutes");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/", userRouter);
app.use("/", assignmentRouter);
app.use("/api", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.listen(PORT, () => {
  console.log(`The server is running at http://localhost:${PORT}`);
});
