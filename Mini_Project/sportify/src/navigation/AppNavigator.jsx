import React, { useContext, useEffect, useRef } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../context/AuthContext";

// Screens
import OnboardingScreen from "../screens/OnboardingScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import AdminLoginScreen from "../screens/AdminLoginScreen";
import GuestHomeScreen from "../screens/GuestHomeScreen";
import HomeScreen from "../screens/HomeScreen";
import StatsScreen from "../screens/StatsScreen";
import FavouritesScreen from "../screens/FavouritesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import VIPGatingScreen from "../screens/VIPGatingScreen";
import AdminPanelScreen from "../screens/AdminPanelScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ----------- Bottom Tabs -----------
const BottomTabs = () => {
  const { isVip } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#121212" },
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: "#aaa",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Favourites") iconName = "heart-outline";
          else if (route.name === "Stats") iconName = "stats-chart-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} />
      {/* Stats tab always visible */}
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// ----------- Main App Navigator -----------
const AppNavigator = () => {
  const { user, isGuest, userRole } = useContext(AuthContext);
  const stackRef = useRef();

  // Automatically redirect based on role
  useEffect(() => {
    if (!stackRef.current) return;

    if (isGuest) {
      stackRef.current.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "GuestTabs" }],
        })
      );
    } else if (userRole === "admin") {
      stackRef.current.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "AdminPanel" }],
        })
      );
    } else if (userRole === "normal" || userRole === "vip") {
      stackRef.current.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "BottomTabs" }],
        })
      );
    }
  }, [isGuest, userRole]);

  return (
    <NavigationContainer ref={stackRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Onboarding */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />

        {/* Auth Stack */}
        <Stack.Screen name="AuthStack">
          {() => (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
            </Stack.Navigator>
          )}
        </Stack.Screen>

        {/* Main Bottom Tabs */}
        <Stack.Screen name="BottomTabs" component={BottomTabs} />

        {/* Guest Tabs */}
        <Stack.Screen name="GuestTabs" component={GuestHomeScreen} />

        {/* Admin Panel */}
        <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />

        {/* VIP Gating */}
        <Stack.Screen name="VIPGating" component={VIPGatingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
