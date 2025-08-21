// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  
import { getFirestore } from "firebase/firestore";  
import { getStorage } from "firebase/storage";  

// Your Firebase config (from console)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCF6oVoL5vR8hgzn57Q2xhdHukY4VzfcgI",
  authDomain: "healthshare-274f9.firebaseapp.com",
  projectId: "healthshare-274f9",
  storageBucket: "healthshare-274f9.firebasestorage.app",
  messagingSenderId: "347593101579",
  appId: "1:347593101579:web:7370076ba6af26da5e920e",
  measurementId: "G-2FGFW55DDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
