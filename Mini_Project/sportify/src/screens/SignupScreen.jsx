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

const SignupScreen = ({ navigation }) => {
  const { signup } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await signup(email, password);
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.Text animation="fadeInDown" style={styles.header}>
        Create Account
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
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: 10 }}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
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
    borderRadius: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1DB954",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  linkText: { color: "#1DB954", textAlign: "center", fontSize: 14 },
});

export default SignupScreen;
