import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar, // Added StatusBar
  Modal, // Added Modal
  FlatList, // Added FlatList
  ActivityIndicator, // Added ActivityIndicator
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
const defaultPfp = require("../assets/default_pfp.png");

// --- RECTIFICATION: Changed placeholder service ---
// Switched from 'placehold.co' to 'via.placeholder.com'
const AVATARS = [
  "https://picsum.photos/seed/avatar1/100",
  "https://picsum.photos/seed/avatar2/100",
  "https://picsum.photos/seed/avatar3/100",
  "https://picsum.photos/seed/avatar4/100",
  "https://picsum.photos/seed/avatar5/100",
  "https://picsum.photos/seed/avatar6/100",
];
// --------------------------------------------------

const ProfileScreen = () => {
  // --- MODIFICATION: Added 'updateUserAvatar' and modal state ---
  const { user, userRole, isVip, logout, updateUserAvatar } = useContext(AuthContext);
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // --------------------------------------------------------

  // --- MODIFIED FUNCTION ---
  // This function now opens the avatar selection modal.
  const handleSelectImage = () => {
    setIsModalVisible(true);
  };
  // -------------------------

  // --- NEW FUNCTION ---
  // Called when an avatar is tapped in the modal
  const onSelectAvatar = async (avatarUrl) => {
    setIsUpdating(true);
    try {
      await updateUserAvatar(avatarUrl);
      setIsModalVisible(false); // Close modal on success
    } catch (error) {
      Alert.alert("Error", "Could not update avatar. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };
  // ------------------

  // --- UPDATED RENDER ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

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
            {isVip && (
              <View style={styles.vipRibbon}>
                <Text style={styles.vipText}>
                  {userRole === "admin" ? "ADMIN" : "VIP"}
                </Text>
              </View>
            )}
            <Image
              source={user.photoURL ? { uri: user.photoURL } : defaultPfp}
              style={styles.pfp}
            />
            <Text style={styles.email}>{user?.email || "User"}</Text>
          </View>

          <View style={styles.actions}>
            {/* Favourites Button */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("Favourites")}
            >
              <Text style={styles.editText}>View Your Favourites</Text>
            </TouchableOpacity>

            {/* Upgrade Button */}
            {!isVip && userRole === "normal" && (
              <TouchableOpacity
                style={styles.vipButton}
                onPress={() => navigation.navigate("VIPGating")}
              >
                <Text style={styles.vipButtonText}>Upgrade to VIP</Text>
              </TouchableOpacity>
            )}

            {/* Change PFP Button */}
            {isVip && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleSelectImage} // This now opens the modal
              >
                <Text style={styles.editText}>Change Profile Picture</Text>
              </TouchableOpacity>
            )}

            {/* Admin Panel Button */}
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

            {/* Logout Button */}
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

      {/* --- NEW AVATAR PICKER MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select an Avatar</Text>
            {isUpdating ? (
              <ActivityIndicator size="large" color="#1DB954" />
            ) : (
              <FlatList
                data={AVATARS}
                numColumns={3}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => onSelectAvatar(item)}>
                    <Image source={{ uri: item }} style={styles.avatar} />
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ------------------------------- */}
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
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  vipButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  editButton: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1DB954",
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  editText: { color: "#1DB954", fontWeight: "bold" },
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
  
  // --- NEW MODAL STYLES ---
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 10,
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
  },
  modalCloseText: {
    color: "#FFD700",
    fontSize: 16,
  },
});

export default ProfileScreen;