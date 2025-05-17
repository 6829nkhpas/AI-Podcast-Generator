const express = require("express");
const router = express.Router();
const generateScript = require("../services/generateScript");
const generateAudio = require("../services/voiceService");
const bucket = require("../firebase/firebaseConfig");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Store generated files info
const generatedFiles = new Map();

router.post("/", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    console.log("Generating script for topic:", topic);
    const script = await generateScript(topic);
    console.log("Script generated successfully");

    console.log("Generating audio from script");
    const audioBuffer = await generateAudio(script);
    console.log("Audio generated successfully");

    const filename = `audio-${uuidv4()}.mp3`;
    const filePath = path.join(uploadsDir, filename);

    // Save file locally
    fs.writeFileSync(filePath, audioBuffer);
    console.log("Audio saved locally:", filePath);

    // Store file info
    const fileInfo = {
      filename,
      path: filePath,
      createdAt: new Date(),
      topic,
    };
    generatedFiles.set(filename, fileInfo);

    // Get local URL
    const localUrl = `/api/download/${filename}`;

    // Try to upload to Firebase in the background
    try {
      console.log("Attempting to save audio to Firebase:", filename);
      const file = bucket.file(filename);
      await file.save(audioBuffer, { contentType: "audio/mpeg" });
      await file.makePublic();
      const firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      console.log("Audio uploaded to Firebase:", firebaseUrl);

      // Update file info with Firebase URL
      fileInfo.firebaseUrl = firebaseUrl;
      generatedFiles.set(filename, fileInfo);
    } catch (firebaseError) {
      console.error("Firebase upload failed:", firebaseError);
      // Continue with local file only
    }

    res.json({
      script,
      audioUrl: localUrl,
      filename,
      message: "Audio generated successfully. You can download it now.",
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
});

// Download endpoint
router.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const fileInfo = generatedFiles.get(filename);

  if (!fileInfo) {
    return res.status(404).json({ error: "File not found" });
  }

  const filePath = fileInfo.path;

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found on server" });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(500).json({ error: "Error downloading file" });
    }
  });
});

// Cleanup old files (optional)
setInterval(() => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  for (const [filename, fileInfo] of generatedFiles.entries()) {
    if (fileInfo.createdAt < oneDayAgo) {
      try {
        fs.unlinkSync(fileInfo.path);
        generatedFiles.delete(filename);
        console.log("Cleaned up old file:", filename);
      } catch (error) {
        console.error("Error cleaning up file:", error);
      }
    }
  }
}, 60 * 60 * 1000); // Run every hour

module.exports = router;
