// src/firebaseAuthService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
// IMPORTANT: Ensure 'query', 'where', and 'getDocs' are imported for fetching content
import { doc, setDoc, collection, addDoc, getDoc, query, where, getDocs } from "firebase/firestore"; // <--- ADD query, where, getDocs here
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

/**
 * Fetches all content documents belonging to the currently logged-in user.
 * @returns {Promise<Array<object>>} - An array of content documents, each with an 'id' field.
 */
const fetchUserContent = async () => {
  if (!auth.currentUser) {
    console.error("No user logged in to fetch content.");
    return []; // Return empty array if no user
  }

  try {
    const userUid = auth.currentUser.uid;
    // Create a query against the 'content' collection
    // where the 'userId' field matches the current user's UID
    const q = query(collection(db, "content"), where("userId", "==", userUid));

    const querySnapshot = await getDocs(q);
    const userContent = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      userContent.push({ id: doc.id, ...doc.data() });
    });

    console.log("Fetched user content:", userContent);
    return userContent;
  } catch (error) {
    console.error("Error fetching user content:", error);
    throw error;
  }
};


// Export all the functions, including the new one: fetchUserContent
export { signUp, signIn, logout, subscribeToAuthChanges, saveUserContent, getUserProfile, fetchUserContent };