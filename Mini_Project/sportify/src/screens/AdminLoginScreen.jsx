import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../context/AuthContext";

const AdminLoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async () => {
    try {
      await login(email, password, "admin"); // Pass "admin" role if needed
    } catch (error) {
      Alert.alert("Admin Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.Text animation="fadeInDown" style={styles.header}>
        Admin Login
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleAdminLogin}>
          <Text style={styles.buttonText}>Login as Admin</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", justifyContent: "center", padding: 20 },
  header: { fontSize: 28, fontWeight: "bold", color: "#1DB954", textAlign: "center", marginBottom: 40 },
  form: {},
  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1DB954",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default AdminLoginScreen;
