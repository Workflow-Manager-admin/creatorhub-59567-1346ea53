// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC42imaHIOFnfux6_BgKoiVi_Ws3yQXGg",
  authDomain: "creatorhub-backend.firebaseapp.com",
  projectId: "creatorhub-backend",
  storageBucket: "creatorhub-backend.firebasestorage.app",
  messagingSenderId: "390392096864",
  appId: "1:390392096864:web:a4e28fe472eb29b3e5bb05",
  measurementId: "G-PTS968ZBNY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);