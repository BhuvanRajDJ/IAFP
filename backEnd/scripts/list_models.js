const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env" });

async function listModels() {
    try {
        console.log("Using API Key:", process.env.GEMINI_API_KEY ? "Found" : "Missing");

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models supporting generateContent:");
            const contentModels = data.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"));

            if (contentModels.length > 0) {
                contentModels.forEach(m => {
                    console.log(`- ${m.name}`);
                });
            } else {
                console.log("No models found supporting generateContent.");
                console.log("All models:", data.models.map(m => m.name));
            }
        } else {
            console.log("No models found or error:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
