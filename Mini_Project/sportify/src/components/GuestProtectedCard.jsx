import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";

const GuestProtectedCard = ({ navigation, featureName }) => {
  const handleLogin = () => {
    navigation.navigate("AuthStack", { screen: "Login" });
  };

  return (
    <Animatable.View animation="fadeIn" duration={800} style={styles.card}>
      <Text style={styles.header}>{featureName} is VIP Only</Text>
      <Text style={styles.text}>
        Please login or signup to access this feature.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login / Signup</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 25,
    margin: 20,
    alignItems: "center",
  },
  header: { fontSize: 20, fontWeight: "bold", color: "#1DB954", marginBottom: 10 },
  text: { fontSize: 16, color: "#fff", textAlign: "center", marginBottom: 15 },
  button: {
    backgroundColor: "#1DB954",
    padding: 12,
    borderRadius: 8,
    width: "70%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default GuestProtectedCard;
