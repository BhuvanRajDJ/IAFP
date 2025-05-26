const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config();


// Load the OAuth credentials
const credentials = require("../google-credentials.json");

// Authenticate with Google OAuth2
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive"], // ✅ Updated Scope
});

const drive = google.drive({ version: "v3", auth });

// ✅ Upload File to Google Drive
const uploadFile = async (filePath, fileName, mimeType) => {
    try {
        // ✅ Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error("File not found: " + filePath);
        }

        const fileMetadata = {
            name: fileName,
            parents: ["1CRM-i3bFCE3Gf9ufccRVk0zdudKTy_Vl"], // Folder ID
        };

        const media = {
            mimeType,
            body: fs.createReadStream(filePath),
        };

        // ✅ Upload file
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id, webViewLink, webContentLink",
        });

        const fileId = response.data.id;

        // ✅ Set public permission
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        // ✅ Fetch the public link
        const result = await drive.files.get({
            fileId: fileId,
            fields: "webViewLink, webContentLink",
        });

        return result.data;
    } catch (error) {
        console.error("Google Drive Upload Error:", error);
        throw new Error("Failed to upload file to Google Drive");
    }
};

// ✅ Delete File from Google Drive
const deleteFile = async (fileId) => {
    try {
        await drive.files.delete({ fileId });
        return { success: true, message: "File deleted successfully" };
    } catch (error) {
        return { success: false, message: "Failed to delete file", error: error.message };
    }
};

module.exports = { uploadFile, deleteFile };
