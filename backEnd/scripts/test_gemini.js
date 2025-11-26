const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
require("dotenv").config({ path: ".env" });

async function testGemini() {
    try {
        console.log("Testing Gemini 2.0 Flash...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // 1. Test Text Generation
        console.log("1. Testing Text Generation...");
        const result = await model.generateContent("Hello, are you working?");
        console.log("Text Response:", result.response.text());

        // 2. Test File Upload and Generation
        console.log("\n2. Testing File Upload...");
        const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

        // Create a dummy file
        fs.writeFileSync("test.txt", "This is a test file content.");

        const uploadResult = await fileManager.uploadFile("test.txt", {
            mimeType: "text/plain",
            displayName: "Test File",
        });
        console.log("File Uploaded:", uploadResult.file.uri);

        console.log("3. Testing Generation with File...");
        const fileResult = await model.generateContent([
            {
                fileData: {
                    fileUri: uploadResult.file.uri,
                    mimeType: uploadResult.file.mimeType,
                },
            },
            "What is in this file?",
        ]);
        console.log("File Response:", fileResult.response.text());

        // Cleanup
        fs.unlinkSync("test.txt");

    } catch (error) {
        console.error("Test Failed:", error);
    }
}

testGemini();
