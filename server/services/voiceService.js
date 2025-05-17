const gTTS = require("gtts");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const os = require("os");

// Create a temporary directory for audio files
const tempDir = path.join(os.tmpdir(), "podcast-audio");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

async function generateAudio(script) {
  try {
    const tempFile = path.join(tempDir, `audio-${Date.now()}.mp3`);

    // Create a new gTTS instance
    const gtts = new gTTS(script, "en");

    // Convert gTTS to promise-based
    const saveFile = promisify(gtts.save.bind(gtts));

    // Save the audio file
    await saveFile(tempFile);

    // Read the file into a buffer
    const audioBuffer = await fs.promises.readFile(tempFile);

    // Clean up the temporary file
    await fs.promises.unlink(tempFile);

    return audioBuffer;
  } catch (error) {
    console.error("Error generating audio:", error);
    throw new Error(`Failed to generate audio: ${error.message}`);
  }
}

module.exports = generateAudio;
