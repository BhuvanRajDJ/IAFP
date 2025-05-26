const express = require("express");
const multer = require("multer");
const { uploadAssignment } = require("../controllers/uploadController");
const { authenticationToken } = require("../controllers/userController");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage

// Upload file route with authentication
router.post(
  "/upload",
  authenticationToken,
  upload.single("assignment"),
  uploadAssignment
);

module.exports = router;
