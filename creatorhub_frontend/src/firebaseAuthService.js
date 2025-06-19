// src/firebaseAuthService.js (add to existing imports and functions)
import {
  // ... existing imports ...
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore"; // <--- ADD collection, addDoc, getDoc
import { auth, db } from "./firebaseConfig";

// ... (your existing signUp, signIn, logout, subscribeToAuthChanges functions) ...

/**
 * Saves a new content item for the currently logged-in user to Firestore.
 * @param {object} contentData - The data for the content item (e.g., { title: "My Blog Post", type: "blog" })
 * @returns {Promise<DocumentReference>} - A reference to the newly created document.
 */
const saveUserContent = async (contentData) => {
  if (!auth.currentUser) {
    console.error("No user logged in to save content.");
    throw new Error("Authentication required to save content.");
  }

  try {
    const userUid = auth.currentUser.uid;
    // Add the user's UID to the content data
    const dataToSave = {
      ...contentData,
      userId: userUid, // Important for security rules
      createdAt: new Date(),
    };

    // Add a new document to the 'content' collection
    const docRef = await addDoc(collection(db, "content"), dataToSave);
    console.log("Document written with ID: ", docRef.id, " for user: ", userUid);
    return docRef;
  } catch (error) {
    console.error("Error saving user content:", error);
    throw error;
  }
};

/**
 * Retrieves user profile data from Firestore.
 * @param {string} uid - The user's UID. If not provided, retrieves current user's data.
 * @returns {Promise<object | null>} - User data or null if not found.
 */
const getUserProfile = async (uid = auth.currentUser?.uid) => {
  if (!uid) {
    console.warn("No UID provided or no user logged in to get profile.");
    return null;
  }
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("User profile data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No user profile found for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};


export { signUp, signIn, logout, subscribeToAuthChanges, saveUserContent, getUserProfile }; // <--- EXPORT THE NEW FUNCTION(S)