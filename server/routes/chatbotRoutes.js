import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Load API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat endpoint
router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(message);

        res.json({ reply: result.response.text() });
    } catch (err) {
        console.error("Gemini API error:", err);
        res.status(500).json({ reply: "⚠️ Error connecting to Gemini chatbot." });
    }
});

export default router;
