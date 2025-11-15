import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable"; // Kept if you want to animate cards

const { width } = Dimensions.get("window");

// --- Mock Data Copied from HomeScreen.jsx ---
const footballMatches = [
  {
    id: "premier_astonvilla_manunited",
    league: "Premier League",
    home: "Aston Villa",
    homeLogo: "https://media.api-sports.io/football/teams/66.png",
    away: "Man United",
    awayLogo: "https://media.api-sports.io/football/teams/33.png",
    score: "2 - 1",
  },
  {
    id: "laliga_realmadrid_sevilla",
    league: "La Liga",
    home: "Real Madrid",
    homeLogo: "https://media.api-sports.io/football/teams/86.png",
    away: "Sevilla",
    awayLogo: "https://media.api-sports.io/football/teams/559.png",
    score: "2 - 2",
  },
];

const nbaGames = [
  {
    id: "lakers_warriors",
    home: "Lakers",
    homeLogo: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg",
    away: "Warriors",
    awayLogo: "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg",
    score: "102 - 99",
  },
  {
    id: "bulls_celtics",
    home: "Bulls",
    homeLogo: "https://upload.wikimedia.org/wikipedia/en/6/67/Chicago_Bulls_logo.svg",
    away: "Celtics",
    awayLogo: "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg",
    score: "110 - 108",
  },
];

const f1Race = {
  id: "abu_dhabi_gp",
  raceName: "Abu Dhabi Grand Prix",
  circuitName: "Yas Marina Circuit",
  circuitImage: "https://media.api-sports.io/formula-1/circuits/23.png",
  standings: [
    {
      id: "bottas",
      position: 1,
      driver: "Valtteri Bottas",
      team: "Mercedes",
      time: "1:25:27.325",
      driverImage: "https://media.api-sports.io/formula-1/drivers/5.png",
    },
    {
      id: "hamilton",
      position: 2,
      driver: "Lewis Hamilton",
      team: "Mercedes",
      time: "+20.886",
      driverImage: "https://media.api-sports.io/formula-1/drivers/20.png",
    },
    {
      id: "verstappen",
      position: 3,
      driver: "Max Verstappen",
      team: "Red Bull",
      time: "+22.520",
      driverImage: "https://media.api-sports.io/formula-1/drivers/25.png",
    },
  ],
};

const GuestHomeScreen = () => {
  const navigation = useNavigation();
  // All 'favourites' logic has been removed.

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.header}>Scores</Text>

      <ScrollView>
        {/* Football Card */}
        <Animatable.View animation="fadeInUp" duration={800} style={styles.card}>
          <Text style={styles.cardTitle}>Football</Text>
          {footballMatches.map((match, index) => (
            <View key={index} style={styles.matchRow}>
              <Text style={styles.leagueText}>{match.league}</Text>
              <View style={styles.scoreRow}>
                <Image source={{ uri: match.homeLogo }} style={styles.teamLogo} />
                <Text style={styles.teamText}>{match.home}</Text>
                <Text style={styles.scoreText}>{match.score}</Text>
                <Text style={styles.teamText}>{match.away}</Text>
                <Image source={{ uri: match.awayLogo }} style={styles.teamLogo} />
                {/* Favourite button removed */}
              </View>
            </View>
          ))}
        </Animatable.View>

        {/* NBA Card */}
        <Animatable.View animation="fadeInUp" duration={800} delay={200} style={styles.card}>
          <Text style={styles.cardTitle}>NBA</Text>
          {nbaGames.map((game, index) => (
            <View key={index} style={styles.scoreRow}>
              <Image source={{ uri: game.homeLogo }} style={styles.teamLogo} />
              <Text style={styles.teamText}>{game.home}</Text>
              <Text style={styles.scoreText}>{game.score}</Text>
              <Text style={styles.teamText}>{game.away}</Text>
              <Image source={{ uri: game.awayLogo }} style={styles.teamLogo} />
              {/* Favourite button removed */}
            </View>
          ))}
        </Animatable.View>

        {/* F1 Card */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400} style={styles.card}>
          <Text style={styles.cardTitle}>F1</Text>
          <Text style={styles.raceName}>{f1Race.raceName}</Text>
          <Text style={styles.circuitName}>{f1Race.circuitName}</Text>
          <Image source={{ uri: f1Race.circuitImage }} style={styles.circuitImage} />
          {f1Race.standings.map((driver, index) => (
            <View key={index} style={styles.standingRow}>
              <Text style={styles.position}>{driver.position}</Text>
              <Image source={{ uri: driver.driverImage }} style={styles.driverLogo} />
              <View>
                <Text style={styles.driverName}>{driver.driver}</Text>
                <Text style={styles.teamName}>{driver.team}</Text>
              </View>
              <Text style={styles.driverTime}>{driver.time}</Text>
              {/* Favourite button removed */}
            </View>
          ))}
        </Animatable.View>
      </ScrollView>

      {/* --- Login/Signup Button from original GuestHomeScreen --- */}
      <TouchableOpacity
        style={styles.authButton}
        onPress={() => navigation.navigate("AuthStack")}
      >
        <Text style={styles.authButtonText}>Login / Signup for more features</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// --- Styles copied from HomeScreen.jsx and merged ---
const styles = StyleSheet.create({
  container: {
    flex: 1, // Changed to flex: 1 for the sticky button
    backgroundColor: "#121212",
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  matchRow: {
    marginBottom: 12,
  },
  leagueText: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamLogo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  teamText: {
    color: "#fff",
    fontWeight: "600",
    marginHorizontal: 6,
    flex: 1,
    textAlign: "center",
  },
  scoreText: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 16,
  },
  raceName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  circuitName: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 8,
  },
  circuitImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: "cover",
  },
  standingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  position: {
    color: "#FFD700",
    fontWeight: "bold",
    width: 24,
  },
  driverLogo: {
    width: 40,
    height: 40,
    marginHorizontal: 8,
    borderRadius: 20,
  },
  driverName: {
    color: "#fff",
    fontWeight: "600",
  },
  teamName: {
    color: "#ccc",
    fontSize: 12,
  },
  driverTime: {
    color: "#FFD700",
    fontWeight: "bold",
    marginLeft: "auto",
  },
  // --- Styles from original GuestHomeScreen for the button ---
  authButton: {
    marginTop: 20, // Pushes it away from the ScrollView
    padding: 15,
    backgroundColor: "#1DB954",
    borderRadius: 20,
    alignItems: "center",
  },
  authButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default GuestHomeScreen;