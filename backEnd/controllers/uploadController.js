const fs = require("fs");
const { uploadFile } = require("../config/googleDrive");

// Controller function for handling file uploads
const uploadAssignment = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload file to Google Drive
    const uploadedFile = await uploadFile(
      req.file.path,
      req.file.originalname,
      req.file.mimetype
    );

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    res.json({ fileId: uploadedFile.id, fileUrl: uploadedFile.webViewLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadAssignment };
