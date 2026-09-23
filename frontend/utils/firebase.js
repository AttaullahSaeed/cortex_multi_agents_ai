// 1. Added GoogleAuthProvider to the import list from "firebase/auth"
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  // 2. Ensure your .env variable starts with VITE_ (standard for Vite + React)
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cortexai-f9643.firebaseapp.com",
  projectId: "cortexai-f9643",
  storageBucket: "cortexai-f9643.firebasestorage.app",
  messagingSenderId: "605076708213",
  appId: "1:605076708213:web:fcfc7626d7dded652ad13c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
