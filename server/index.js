const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  console.error("Stack trace:", error.stack);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise);
  console.error("Reason:", reason);
});

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("Environment variables loaded:");
console.log("PORT:", process.env.PORT);
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Set" : "Not set");
console.log("FIREBASE_STORAGE_BUCKET:", process.env.FIREBASE_STORAGE_BUCKET);

// Check required environment variables
const requiredEnvVars = ["GEMINI_API_KEY", "FIREBASE_STORAGE_BUCKET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    "Missing required environment variables:",
    missingEnvVars.join(", ")
  );
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  console.error("Stack trace:", err.stack);
  res
    .status(500)
    .json({ error: "Internal server error", details: err.message });
});

// Routes
try {
  console.log("Loading routes...");
  const generateRoute = require("./routes/generate");
  app.use("/api/generate", generateRoute);
  console.log("Routes loaded successfully");
} catch (error) {
  console.error("Failed to load routes:", error);
  console.error("Stack trace:", error.stack);
  process.exit(1);
}

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Press Ctrl+C to stop the server");
});

// Handle server errors
server.on("error", (error) => {
  console.error("Server error:", error);
  console.error("Stack trace:", error.stack);
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
  }
});
