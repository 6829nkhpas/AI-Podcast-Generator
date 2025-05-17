const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateScript(topic) {
  try {
    console.log("Calling Gemini API...");
    console.log(
      "Using API Key:",
      process.env.GEMINI_API_KEY.substring(0, 5) + "..."
    );

    // Use Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a professional podcast script writer. Write an engaging, conversational podcast script about: "${topic}". Include a brief introduction, main points, and a conclusion. Keep it concise (2-3 minutes when read aloud).`;

    console.log("Sending prompt to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = await result.response;

    console.log("Gemini API response received");
    return response.text().trim();
  } catch (error) {
    console.error("Detailed error in generateScript:", error);
    throw new Error(`Failed to generate script: ${error.message}`);
  }
}

module.exports = generateScript;
