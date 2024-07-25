// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-e1f52.firebaseapp.com",
  projectId: "mern-blog-e1f52",
  storageBucket: "mern-blog-e1f52.appspot.com",
  messagingSenderId: "934382197336",
  appId: "1:934382197336:web:67d14d58e65d4fc235c82d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
