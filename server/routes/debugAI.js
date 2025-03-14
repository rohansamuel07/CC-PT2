require('dotenv').config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

const HF_API_KEY = process.env.HF_API_KEY; // Load from .env
const HF_MODEL_URL = "https://api-inference.huggingface.co/models/bigcode/starcoder";

router.post("/", async (req, res) => {
    try {
        const { code, language } = req.body; // User-submitted code

        if (!code || !language) {
            return res.status(400).json({ error: "Code and language are required" });
        }

        // Define specific syntax rules per language
        const languageFormats = {
            Python: "Use correct indentation and ensure valid syntax.",
            JavaScript: "Ensure proper semicolons and function syntax.",
            Java: "Ensure proper class structure and method syntax.",
            C: "Ensure proper printf syntax and semicolons.",
            Cpp: "Ensure correct `cout` syntax and `#include` statements."
        };

        // Construct the prompt to get only the fixed code
        const prompt = `
### Task: Fix the syntax errors in the following ${language} code and return only the corrected code.

# Rules: ${languageFormats[language] || "Ensure valid syntax."}

${code}

### Fixed ${language} Code:
`;

        // Prepare request payload
        const payload = {
            inputs: prompt,
            parameters: {
                max_new_tokens: 200,
                return_full_text: false
            }
        };

        // Send request to Hugging Face API
        const response = await axios.post(HF_MODEL_URL, payload, {
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`, // Uses the .env variable
                "Content-Type": "application/json"
            }
        });

        // Extract and clean AI output
        let rawOutput = response.data[0]?.generated_text || "";
        let cleanedOutput = rawOutput.split("###")[0].trim();

        if (!cleanedOutput || cleanedOutput === code) {
            cleanedOutput = "No valid output generated.";
        }

        res.json({ debuggedCode: cleanedOutput });

    } catch (error) {
        console.error("Error with AI Debugging:", error.message);
        res.status(500).json({ error: "Failed to process request" });
    }
});

module.exports = router;
