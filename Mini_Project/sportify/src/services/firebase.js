import { initializeApp } from "firebase/app";
// --- MODIFICATION START ---
// Import initializeAuth and persistence functions
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// --- MODIFICATION END ---
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

// --- RECTIFICATION ---
// Replace 'getAuth(app)' with 'initializeAuth' and pass in persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// ---------------------

export const db = getFirestore(app);

export default app;