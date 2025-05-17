# AI Podcast Generator

An AI-powered application that generates podcast scripts and audio content using Google's Gemini API.

## Features

- Generate podcast scripts using AI
- Convert scripts to audio
- Store audio files in Firebase Storage
- Modern web interface

## Tech Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- AI: Google Gemini API
- Storage: Firebase Storage
- Text-to-Speech: Google Cloud Text-to-Speech

## Setup

1. Clone the repository:

```bash
git clone https://github.com/6829nkhpas/AI-Podcast-Generator.git
cd AI-Podcast-Generator
```

2. Install dependencies:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Configure environment variables:

   - Create a `.env` file in the server directory
   - Add the following variables:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     PORT=3001
     FIREBASE_STORAGE_BUCKET=your_firebase_bucket
     ```

4. Set up Firebase:

   - Create a Firebase project
   - Enable Storage
   - Download service account key and save as `firebaseKey.json` in the server/firebase directory

5. Start the application:

```bash
# Start server (from server directory)
npm start

# Start client (from client directory)
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
