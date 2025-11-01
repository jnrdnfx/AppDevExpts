// firebaseConfig.ts
// Import the Firebase modules you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// ⚠️ Replace these placeholders with your own Firebase project keys
const firebaseConfig = {
  apiKey: "AIzaSyAq91k2W3yJ-ouoMYq8KG8KBJgLwVpJXgQ",
  authDomain: "fluttercalc-a7376.firebaseapp.com",
  projectId: "fluttercalc-a7376",
  storageBucket: "fluttercalc-a7376.firebasestorage.app",
  messagingSenderId: "647084413039",
  appId: "1:647084413039:web:8fdc3d945817e3f722fd9a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (for storing history)
export const db = getFirestore(app);
