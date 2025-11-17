import React, { createContext, useState } from "react";
import { Alert } from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile, // Import updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; // Import updateDoc
import { db } from "../services/firebase";
// Import Firebase Storage (REMOVED - No longer needed)
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = getAuth();
  // const storage = getStorage(db.app); // (REMOVED)
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // normal | vip | admin
  const [isVip, setIsVip] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const fetchUserRole = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const role = docSnap.data().role;
        setUserRole(role);
        // This logic is correct
        setIsVip(role === "vip" || role === "admin");

        // --- ADDITION ---
        // Ensure user object has the latest from Firestore
        const docData = docSnap.data();
        if (docData.photoURL) {
          setUser((currentUser) => ({
            ...currentUser,
            photoURL: docData.photoURL,
          }));
        }
        // --------------

      }
    } catch (error) {
      console.log("Error fetching user role:", error);
    }
  };

  const login = async (email, password, roleOverride) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      setUser(currentUser);
      setIsGuest(false);

      if (roleOverride === "admin") {
        setUserRole("admin");
        // --- RECTIFICATION ---
        // Admin should have VIP privileges
        setIsVip(true); 
        // ---------------------
        return;
      }

      await fetchUserRole(currentUser.uid);
    } catch (error) {
      Alert.alert("Login Failed", error.message);
      throw error;
    }
  };

  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      setUser(currentUser);
      setIsGuest(false);
      setUserRole("normal");
      
      // --- RECTIFICATION ---
      // Explicitly set isVip to false for new users
      setIsVip(false);
      // ---------------------

      // SAVE NEW USER IN FIRESTORE
      await setDoc(doc(db, "users", currentUser.uid), { 
        role: "normal",
        email: currentUser.email, // Store email
        photoURL: null, // Start with no photo
        vipRequest: false, // --- ADDED THIS: Ensure new users can make requests ---
      });
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
      throw error;
    }
  };

  const logout = async (navigation) => {
    try {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
      setIsVip(false);
      setIsGuest(false);
      navigation.reset({ index: 0, routes: [{ name: "Onboarding" }] });
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const continueAsGuest = () => {
    setUser(null);
    setUserRole("guest");
    setIsGuest(true);
    setIsVip(false);
  };

  // --- REMOVED 'updateUserPfp' FUNCTION ---

  // --- NEW, SIMPLER FUNCTION TO SAVE AVATAR URL ---
  const updateUserAvatar = async (avatarUrl) => {
    if (!user) return;

    try {
      // 1. Update the Firebase Auth user profile
      await updateProfile(auth.currentUser, { photoURL: avatarUrl });

      // 2. Update the user's document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { photoURL: avatarUrl });

      // 3. Update the user state in context
      setUser({ ...user, photoURL: avatarUrl });

    } catch (error) {
      console.error("Error updating avatar:", error);
      throw error; // Re-throw error to be caught in ProfileScreen
    }
  };
  // -----------------------------------------

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        isVip,
        isGuest,
        login,
        signup,
        logout,
        continueAsGuest,
        updateUserAvatar, // --- EXPORT THE NEW FUNCTION ---
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};