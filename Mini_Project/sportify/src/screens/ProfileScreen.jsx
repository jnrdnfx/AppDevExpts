import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  // ActivityIndicator has been removed
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
// Import for ImagePicker has been removed to prevent the crash
// import ImagePicker from "react-native-image-crop-picker";

// You must have a default PFP image in your assets
const defaultPfp = require("../assets/default_pfp.png");

const ProfileScreen = () => {
  // updateUserPfp is no longer called in this file, so it's removed from here
  const { user, userRole, isVip, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  // isUploading state has been removed

  // --- MODIFIED FUNCTION ---
  // This function no longer calls the image picker.
  // It now shows an alert explaining the native module issue.
  const handleSelectImage = () => {
    Alert.alert(
      "Feature Not Available",
      "This feature requires a full app build. Please rebuild your app to enable profile picture uploads."
      // This is because 'react-native-image-crop-picker' is a native module
      // and must be compiled into the app.
    );

    /*
    // --- THIS IS THE CODE THAT CAUSES THE CRASH ---
    // --- It will work only after you run 'npm install react-native-image-crop-picker'
    // --- and then 'npx react-native run-android' or 'cd ios && pod install && npx react-native run-ios'
    
    ImagePicker.openPicker({ ... })
      .then(async (image) => {
        // ... upload logic
      })
      .catch((error) => {
        // ... error handling
      });
    */
  };

  // --- REMOVED VIEW ---
  // The 'isUploading' view has been removed as it's no longer needed.

  // --- UPDATED RENDER ---
  return (
    <SafeAreaView style={styles.container}>
      {/* --- GUEST VIEW --- */}
      {userRole === "guest" && (
        <>
          <View style={styles.header}>
            <Image source={defaultPfp} style={styles.pfp} />
            <Text style={styles.email}>Guest User</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.vipButton}
              onPress={() => navigation.navigate("AuthStack")}
            >
              <Text style={styles.vipButtonText}>Sign Up / Login</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* --- LOGGED-IN USER / VIP / ADMIN VIEW --- */}
      {user && (
        <>
          <View style={styles.header}>
            {isVip && ( // Admin also has isVip=true in context
              <View style={styles.vipRibbon}>
                <Text style={styles.vipText}>
                  {userRole === "admin" ? "ADMIN" : "VIP"}
                </Text>
              </View>
            )}
            <Image
              // --- MODIFICATION: Use user's photoURL ---
              source={user.photoURL ? { uri: user.photoURL } : defaultPfp}
              style={styles.pfp}
            />
            <Text style={styles.email}>{user?.email || "User"}</Text>
          </View>

          <View style={styles.actions}>
            {/* --- MODIFICATION: Favourites Button --- */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("Favourites")}
            >
              <Text style={styles.editText}>View Your Favourites</Text>
            </TouchableOpacity>

            {/* --- MODIFICATION: Show for normal users only --- */}
            {!isVip && userRole === "normal" && (
              <TouchableOpacity
                style={styles.vipButton}
                onPress={() => navigation.navigate("VIPGating")}
              >
                <Text style={styles.vipButtonText}>Upgrade to VIP</Text>
              </TouchableOpacity>
            )}

            {/* --- MODIFICATION: Hooked up onPress --- */}
            {isVip && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleSelectImage} // This now calls the alert
              >
                <Text style={styles.editText}>Change Profile Picture</Text>
              </TouchableOpacity>
            )}

            {/* --- MODIFICATION: Admin Panel Button --- */}
            {userRole === "admin" && (
              <TouchableOpacity
                style={[styles.editButton, styles.adminButton]}
                onPress={() => navigation.navigate("AdminPanel")}
              >
                <Text style={[styles.editText, styles.adminButtonText]}>
                  Admin Panel
                </Text>
              </TouchableOpacity>
            )}

            {/* LOGOUT BUTTON (Unchanged) */}
            <TouchableOpacity
              style={[styles.editButton, styles.logoutButton]}
              onPress={() => logout(navigation)}
            >
              <Text style={[styles.editText, styles.logoutButtonText]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20, alignItems: "center" },
  header: { alignItems: "center", marginTop: 50, position: "relative" },
  vipRibbon: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#1DB954",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  vipText: { color: "#fff", fontWeight: "bold" },
  pfp: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  email: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  actions: { marginTop: 30, width: "100%", alignItems: "center" },
  vipButton: {
    backgroundColor: "#1DB954",
    padding: 15,
    borderRadius: 10,
    width: "80%", // Changed to 80% for consistency
    alignItems: "center",
    marginBottom: 10,
  },
  vipButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  editButton: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1DB954",
    width: "80%", // Changed to 80%
    alignItems: "center",
    marginBottom: 10, // Added for spacing
  },
  editText: { color: "#1DB954", fontWeight: "bold" },
  // --- NEW STYLES ---
  adminButton: {
    borderColor: "#FFD700",
    backgroundColor: "#FFD700",
  },
  adminButtonText: {
    color: "#121212",
  },
  logoutButton: {
    borderColor: "#c13515",
    marginTop: 20,
    backgroundColor: "transparent",
  },
  logoutButtonText: {
    color: "#c13515",
  },
});

export default ProfileScreen;