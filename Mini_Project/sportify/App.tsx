import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from "react-native";

export default function App() {
  return (
    <>
      <SafeAreaProvider>
      <StatusBar barStyle={"light-content"}/>
      <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
            <AppNavigator />
            </GestureHandlerRootView>
      </AuthProvider>
      <Toast />
      </SafeAreaProvider>
    </>
  );
}
