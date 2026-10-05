import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "apex-61169.firebaseapp.com",
  projectId: "apex-61169",
  storageBucket: "apex-61169.firebasestorage.app",
  messagingSenderId: "283872086718",
  appId: "1:283872086718:web:2aa48fe6bcf4da0f3d2cef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const googleProvider= new GoogleAuthProvider();