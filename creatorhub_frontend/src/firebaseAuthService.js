// src/firebaseAuthService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
// IMPORTANT: Ensure 'onSnapshot' and 'deleteDoc' are imported
import { doc, setDoc, collection, addDoc, getDoc, query, where, getDocs, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore"; // <--- ADD onSnapshot, updateDoc, deleteDoc
import { auth, db } from "./firebaseConfig";

// ... (your existing signUp, signIn, logout, subscribeToAuthChanges, saveUserContent, getUserProfile functions) ...

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
 * Subscribes to real-time updates for all content documents belonging to the currently logged-in user.
 * @param {function(Array<object>)} callback - Function to call with the updated array of content documents.
 * @returns {function()} - An unsubscribe function to stop listening for updates.
 */
const subscribeToUserContent = (callback) => {
  if (!auth.currentUser) {
    console.warn("No user logged in to subscribe to content.");
    callback([]); // Call callback with empty array immediately
    return () => {}; // Return a no-op unsubscribe function
  }

  const userUid = auth.currentUser.uid;
  const q = query(collection(db, "content"), where("userId", "==", userUid));

  // onSnapshot returns an unsubscribe function
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const userContent = [];
    querySnapshot.forEach((doc) => {
      userContent.push({ id: doc.id, ...doc.data() });
    });
    console.log("Real-time user content update:", userContent);
    callback(userContent); // Pass the updated data to the provided callback
  }, (error) => {
    console.error("Error subscribing to user content:", error);
    // You might want to handle this error in your UI as well
  });

  return unsubscribe; // Return the unsubscribe function
};

/**
 * Updates an existing content item in Firestore.
 * @param {string} contentId - The ID of the content document to update.
 * @param {object} newData - The data to update (e.g., { title: "New Title" }).
 * @returns {Promise<void>}
 */
const updateUserContent = async (contentId, newData) => {
  if (!auth.currentUser) {
    console.error("No user logged in to update content.");
    throw new Error("Authentication required to update content.");
  }

  try {
    const contentRef = doc(db, "content", contentId);
    await updateDoc(contentRef, newData);
    console.log(`Content document with ID: ${contentId} updated successfully.`);
  } catch (error) {
    console.error("Error updating user content:", error);
    throw error;
  }
};

/**
 * Deletes a content item from Firestore.
 * @param {string} contentId - The ID of the content document to delete.
 * @returns {Promise<void>}
 */
const deleteUserContent = async (contentId) => {
  if (!auth.currentUser) {
    console.error("No user logged in to delete content.");
    throw new Error("Authentication required to delete content.");
  }

  try {
    const contentRef = doc(db, "content", contentId);
    await deleteDoc(contentRef);
    console.log(`Content document with ID: ${contentId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting user content:", error);
    throw error;
  }
};


// Export all the functions, including the new ones
export {
  signUp,
  signIn,
  logout,
  subscribeToAuthChanges,
  saveUserContent,
  getUserProfile,
  subscribeToUserContent, // <--- EXPORT NEW REAL-TIME FUNCTION
  updateUserContent,      // <--- EXPORT NEW UPDATE FUNCTION
  deleteUserContent       // <--- EXPORT NEW DELETE FUNCTION
};