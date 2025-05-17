const admin = require("firebase-admin");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

let bucket;

try {
  console.log("Initializing Firebase...");

  // Check if firebaseKey.json exists
  try {
    const serviceAccount = require("./firebaseKey.json");
    console.log("Firebase service account loaded");
  } catch (error) {
    throw new Error("firebaseKey.json not found or invalid: " + error.message);
  }

  if (!process.env.FIREBASE_STORAGE_BUCKET) {
    throw new Error(
      "FIREBASE_STORAGE_BUCKET is not set in environment variables"
    );
  }

  // Check if Firebase is already initialized
  if (!admin.apps.length) {
    console.log("Creating new Firebase app instance");
    admin.initializeApp({
      credential: admin.credential.cert(require("./firebaseKey.json")),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } else {
    console.log("Using existing Firebase app instance");
  }

  bucket = admin.storage().bucket();
  console.log(
    "Firebase initialized successfully with bucket:",
    process.env.FIREBASE_STORAGE_BUCKET
  );
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error; // Let the main process handle the error
}

module.exports = bucket;
