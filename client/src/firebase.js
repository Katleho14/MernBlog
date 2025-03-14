// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Removed unused import of getFirestore
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-bbf81.firebaseapp.com",
  projectId: "mern-blog-bbf81",
  storageBucket: "mern-blog-bbf81.firebasestorage.app",
  messagingSenderId: "333084817488",
  appId: "1:333084817488:web:c82d964e2e04902a3bb955"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);