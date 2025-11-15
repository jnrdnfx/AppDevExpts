import React, { createContext, useState } from "react";
import { Alert } from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = getAuth();
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
      await setDoc(doc(db, "users", currentUser.uid), { role: "normal" });
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};