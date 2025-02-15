// /backend/server.js

require("dotenv").config(); // ✅ Load environment variables
const express = require("express");
const cors = require("cors");
const routes = require("./routes"); // ✅ Ensure this is correctly imported

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // ✅ Ensures JSON request body parsing

// ✅ API Routes (Ensures all endpoints start with /api)
app.use("/api", routes);

// ✅ Default Home Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the AI Interview Coach API!" });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
