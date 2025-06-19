// src/firebaseAuthService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // For saving user data in Firestore
import { auth, db } from "./firebaseConfig"; // Import auth and db instances

/**
 * Registers a new user with email and password and saves basic user data to Firestore.
 * @param {string} email
 * @param {string} password
 * @param {object} userData - Additional user data to save (e.g., { name: "John Doe" })
 * @returns {Promise<UserCredential>} - Firebase UserCredential object
 */
const signUp = async (email, password, userData = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save initial user data to Firestore in a 'users' collection
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date(),
      ...userData // Merge any additional data provided
    });

    console.log("User registered and data saved:", user.uid);
    return userCredential;
  } catch (error) {
    console.error("Error signing up:", error.code, error.message);
    throw error; // Re-throw to be handled by the component
  }
};

/**
 * Logs in an existing user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>} - Firebase UserCredential object
 */
const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error("Error signing in:", error.code, error.message);
    throw error;
  }
};

/**
 * Logs out the current user.
 * @returns {Promise<void>}
 */
const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out.");
  } catch (error) {
    console.error("Error logging out:", error.code, error.message);
    throw error;
  }
};

/**
 * Subscribes to changes in the user's authentication state.
 * @param {function(User | null)} callback - Function to call with the current user object or null.
 * @returns {function()} - Unsubscribe function.
 */
const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { signUp, signIn, logout, subscribeToAuthChanges };