// src/firebaseConfig.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // You can keep this if you use Analytics

// IMPORT AUTH AND FIRESTORE HERE
import { getAuth } from "firebase/auth"; // <--- ADD THIS LINE
import { getFirestore } from "firebase/firestore"; // <--- ADD THIS LINE
// IMPORT GOOGLE AUTH 
import { GoogleAuthProvider } from "firebase/auth"; // <--- ADD THIS LINE

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC42imaHIOFnfux6_BgKoiVi_Ws3yQXGg",
  authDomain: "creatorhub-backend.firebaseapp.com",
  projectId: "creatorhub-backend",
  storageBucket: "creatorhub-backend.firebasestorage.app",
  messagingSenderId: "390392096864",
  appId: "1:390392096864:web:a4e28fe472eb29b3e5bb05",
  measurementId: "G-PTS968ZBNY" // Keep this if you want Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Keep this if you want Analytics, otherwise comment out/remove

// INITIALIZE FIREBASE AUTHENTICATION AND FIRESTORE HERE
const auth = getAuth(app); // <--- ADD THIS LINE
const db = getFirestore(app); // <--- ADD THIS LINE

// GOOGLE AUTH
const googleProvider = new GoogleAuthProvider(); // <--- ADD THIS LINE

// EXPORT THEM FOR USE IN OTHER COMPONENTS/SERVICES
export { auth, db, googleProvider }; // <--- EXPORT googleProvider



// If you want to use analytics in other files, you would also export it:
// export { auth, db, analytics };