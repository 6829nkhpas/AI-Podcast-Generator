const express = require("express");
const router = express.Router();
const generateScript = require("../services/generateScript");
const generateAudio = require("../services/voiceService");
const bucket = require("../firebase/firebaseConfig");
const { v4: uuidv4 } = require("uuid");

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
    console.log("Saving audio to Firebase:", filename);
    const file = bucket.file(filename);

    await file.save(audioBuffer, { contentType: "audio/mpeg" });
    await file.makePublic();

    const audioUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    console.log("Audio URL:", audioUrl);

    res.json({ script, audioUrl });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
});

module.exports = router;
