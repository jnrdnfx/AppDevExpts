import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../contexts/AuthProvider';

const SignInScreen = () => {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.appName}>Image Viewer</Text>
      </View>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={() => login(email, password)}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.link}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Image Viewer. Project built with Expo.</Text>
      </View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
    padding: 25,
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000ff',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 30,
    transform: [{ translateY: -50 }],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    color: '#007AFF',
    marginTop: 15,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    color: '#aaa',
    width: '100%',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    marginLeft: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#aaa',
  },
});
