const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateScript(topic) {
  try {
    console.log("Calling Gemini API...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a professional podcast script writer. Write an engaging, conversational script about: ${topic}. Include a brief introduction, main points, and a conclusion. Keep it concise (2-3 minutes when read aloud).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini API response received");
    return text.trim();
  } catch (error) {
    console.error("Error in generateScript:", error);
    throw new Error(`Failed to generate script: ${error.message}`);
  }
}

module.exports = generateScript;
