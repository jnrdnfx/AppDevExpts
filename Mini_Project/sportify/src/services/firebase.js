import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = { 
  apiKey: "AIzaSyDGbDt_tZC4mXiVKlGpABIZ7EWhJodgX0k",
  authDomain: "sportify-104fe.firebaseapp.com",
  projectId: "sportify-104fe",
  storageBucket: "sportify-104fe.firebasestorage.app",
  messagingSenderId: "731708126671",
  appId: "1:731708126671:web:375d142d5846bac2dc4eba",
 };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);  // NO persistence inside Expo go
export const db = getFirestore(app);

export default app;
