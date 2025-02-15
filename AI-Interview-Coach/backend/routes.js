// /backend/routes.js

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const openai = require("./config"); // Ensure this exports an instance of OpenAI

/**
 * POST /generateQuestion
 * Generates a realistic interview question for a restaurant job interview.
 * Expects: { name: string, jobRole: string }
 */
router.post("/generateQuestion", async (req, res) => {
  try {
    const { name, jobRole } = req.body;
    if (!name || !jobRole) {
      return res
        .status(400)
        .json({ message: "Missing name or jobRole in request body." });
    }

    // Construct the prompt for generating a question
    const prompt = `You are a restaurant hiring manager. Generate a professional interview question for a ${jobRole}.`;

    // ✅ Correct OpenAI API Call
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 50,
    });

    res.json({ question: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error in /generateQuestion:", error);
    res
      .status(500)
      .json({ message: "Error generating question.", error: error.message });
  }
});

/**
 * POST /analyzeAnswer
 * Analyzes the user's answer, provides a score, feedback, and an ideal answer.
 * Expects: { name: string, jobRole: string, question: string, answer: string }
 */
router.post("/analyzeAnswer", async (req, res) => {
  try {
    const { name, jobRole, question, answer } = req.body;
    if (!name || !jobRole || !question || !answer) {
      return res
        .status(400)
        .json({ message: "Missing required fields in request body." });
    }

    // Construct the prompt for analyzing the answer
    const prompt = `You are an expert interviewer. Review the candidate's response and provide:
1. A score out of 10.
2. Constructive feedback.
3. An ideal answer.

Question: "${question}"
Answer: "${answer}"
`;

    // ✅ Correct OpenAI API Call
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 250,
    });

    res.json({ feedback: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error in /analyzeAnswer:", error);
    res
      .status(500)
      .json({ message: "Error analyzing answer.", error: error.message });
  }
});

/**
 * GET /trackProgress
 * Retrieves the user's past interview results from a JSON file.
 */
router.get("/trackProgress", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "questions.json");
    if (!fs.existsSync(filePath)) {
      return res.json({ interviews: [] });
    }
    const data = await fs.promises.readFile(filePath, "utf-8");
    const interviews = JSON.parse(data);
    res.json({ interviews });
  } catch (error) {
    console.error("Error in /trackProgress:", error);
    res.status(500).json({
      message: "Error fetching interview progress.",
      error: error.message,
    });
  }
});

/**
 * POST /storeProgress
 * Stores a new interview result into the JSON file.
 * Expects the interview result data in the request body.
 */
router.post("/storeProgress", async (req, res) => {
  try {
    const interviewResult = req.body;
    if (!interviewResult) {
      return res.status(400).json({ message: "No interview data provided." });
    }
    const filePath = path.join(__dirname, "questions.json");
    let interviews = [];
    if (fs.existsSync(filePath)) {
      const data = await fs.promises.readFile(filePath, "utf-8");
      interviews = JSON.parse(data);
    }
    // Append the new interview result
    interviews.push(interviewResult);
    await fs.promises.writeFile(filePath, JSON.stringify(interviews, null, 2));
    res.json({ message: "Interview progress saved successfully." });
  } catch (error) {
    console.error("Error in /storeProgress:", error);
    res.status(500).json({
      message: "Error saving interview progress.",
      error: error.message,
    });
  }
});

module.exports = router;
