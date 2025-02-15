// /backend/config.js

/**
 * This file configures and exports an instance of the OpenAI API client.
 * It loads API keys securely from the .env file using dotenv.
 * If the API key is missing, the process will exit with an error.
 */

const OpenAI = require("openai");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Retrieve the OpenAI API key from environment variables
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error(
    "ERROR: OPENAI_API_KEY is not set in the environment variables.",
  );
  process.exit(1); // Exit the process if the API key is missing
}

// Create an instance of the OpenAI API client
const openai = new OpenAI({
  apiKey: apiKey, // Ensure your .env file has this key
});

// Export the configured OpenAI API client for use in other modules
module.exports = openai;
