import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../context/AuthContext";

const { width } = Dimensions.get("window");

// Mock carousel data with web placeholders
const slides = [
  {
    id: "1",
    title: "Get Scores",
    description: "Get scores for your favorite sports.",
    image: require("../assets/score.png"),
  },
  {
    id: "2",
    title: "Favorites",
    description: "Track your favorite teams and players easily.",
    image:require("../assets/favourite.png"),
  },
  {
    id: "3",
    title: "VIP Features",
    description: "Access exclusive stats and premium content.",
    image: require("../assets/vip.png"),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const { continueAsGuest } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Sportify</Text>
      </View>
      {/* Carousel Section */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flex: 0.7 }}
      >
        {slides.map((slide, index) => (
          <Animatable.View
            key={slide.id}
            animation="fadeInRight"
            delay={index * 300}
            style={styles.slide}
          >
            <Image source={slide.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </Animatable.View>
        ))}
      </ScrollView>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        {/* Login */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AuthStack", { screen: "Login" })}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Signup */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#1a1a1a", borderWidth: 1, borderColor: "#1DB954" }]}
          onPress={() => navigation.navigate("AuthStack", { screen: "Signup" })}
        >
          <Text style={[styles.buttonText, { color: "#1DB954" }]}>Signup</Text>
        </TouchableOpacity>

        {/* Guest */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#333" }]}
          onPress={() => {
            continueAsGuest();
            navigation.reset({ index: 0, routes: [{ name: "GuestTabs" }] });
          }}
        >
          <Text style={styles.buttonText}>Continue as Guest</Text>
        </TouchableOpacity>
          
        {/* Admin Login */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#030020ff",borderColor:"#ffffff",borderWidth:0.5,marginTop:15 }]}
          onPress={() => navigation.navigate("AuthStack", { screen: "AdminLogin" })}
        >
          <Text style={styles.buttonText}>Admin Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1c1c1cff", padding: 20 },
  header:{color:"#ffffff", fontWeight:600,fontSize:30,textAlign:"center",justifyContent:"center", margin:20},
  slide: {
    width: width - 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  image: { width: "80%", height: 200, marginBottom: 20, borderRadius: 12 },
  title: { fontSize: 26, fontWeight: "bold", color: "#1DB954", textAlign: "center", marginBottom: 10 },
  description: { fontSize: 16, color: "#fff", textAlign: "center" },
  buttonsContainer: { flex: 0.3, justifyContent: "center",marginBottom:50 },
  button: {
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 12,
    backgroundColor:"#1DB954",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default OnboardingScreen;
