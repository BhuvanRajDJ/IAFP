const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config();


// Load the OAuth credentials
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "https://developers.google.com/oauthplayground";

const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
auth.setCredentials({ refresh_token: REFRESH_TOKEN });

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
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
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
