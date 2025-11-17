import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator, // Added
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import axios from "axios"; // Added

const { width } = Dimensions.get("window");
const API_KEY = "7640a8de8074b8683b8471a35200d676"; // Use your key

// --- MOCK DATA REMOVED ---

const GuestHomeScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true); // Added
  const [error, setError] = useState(null); // Added

  // --- API DATA STATES ---
  const [footballMatches, setFootballMatches] = useState([]);
  const [basketballGames, setBasketballGames] = useState([]); // Renamed
  const [f1Race, setF1Race] = useState(null);
  
  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([
          fetchFootball(),
          fetchBasketball(), // Changed
          fetchF1()
        ]);
      } catch (err) {
        console.error("Error fetching data", err);
        setError("Could not load scores. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  // --- API CALL: FOOTBALL ---
  const fetchFootball = async () => {
    const leagues = [39, 140]; // Premier League, La Liga
    const season = 2023; // Use 2023 season
    let matches = [];
    
    for (const leagueId of leagues) {
      // --- RECTIFICATION: Removed 'last=' parameter as requested ---
      const res = await axios.get(
        `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${season}`,
        { headers: { "x-apisports-key": API_KEY } }
      );
      
      // Get the first 2 matches
      const someMatches = res.data.response.slice(0, 2);
      for (const match of someMatches) {
        if (match) {
          matches.push({
            id: match.fixture.id,
            league: match.league.name,
            home: match.teams.home.name,
            homeLogo: match.teams.home.logo,
            away: match.teams.away.name,
            awayLogo: match.teams.away.logo,
            score: `${match.goals.home ?? 0} - ${match.goals.away ?? 0}`,
          });
        }
      }
    }
    setFootballMatches(matches);
  };

  // --- API CALL: BASKETBALL (Replaced NBA) ---
  const fetchBasketball = async () => {
    const season = "2022-2023"; // Use 2022-2023 season
    const res = await axios.get(
      `https://v1.basketball.api-sports.io/games?league=12&season=${season}`,
      { headers: { 
          "x-rapidapi-host": "v1.basketball.api-sports.io",
          "x-rapidapi-key": API_KEY 
        } 
      }
    );
    
    const games = res.data.response;
    if (games && games.length) {
      // Pick 3 random games
      const randomGames = [];
      for (let i = 0; i < 3 && games.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * games.length);
        randomGames.push(games.splice(randomIndex, 1)[0]);
      }

      // Normalize data
      const normalizedGames = randomGames.map(game => ({
        id: game.id,
        home: game.teams.home.name,
        homeLogo: game.teams.home.logo,
        away: game.teams.away.name,
        awayLogo: game.teams.away.logo,
        score: `${game.scores.home.total ?? 0} - ${game.scores.away.total ?? 0}`,
      }));
      setBasketballGames(normalizedGames);
    }
  };

  // --- API CALL: F1 ---
  const fetchF1 = async () => {
    // --- RECTIFICATION: Using 2023 season ---
    const season = 2023;
    // 1. Get the last race of the season
    // --- RECTIFICATION: Re-added 'last=1' ---
    const raceRes = await axios.get(
      `https://v1.formula-1.api-sports.io/races?season=${season}`,
      { headers: { "x-apisports-key": API_KEY } }
    );
    
    const lastRace = raceRes.data.response[0];
    if (!lastRace) return;

    // 2. Get the rankings for that race
    const rankRes = await axios.get(
      `https://v1.formula-1.api-sports.io/rankings/races?race=${lastRace.id}`,
      { headers: { "x-apisports-key": API_KEY } }
    );
    const rankings = rankRes.data.response;
    if (rankings && rankings.length) {
      setF1Race({
        id: lastRace.id,
        raceName: lastRace.competition.name,
        circuitName: lastRace.circuit.name,
        circuitImage: lastRace.circuit.image,
        standings: rankings.slice(0, 3).map(driver => ({
          id: driver.driver.id,
          position: driver.position,
          driver: driver.driver.name,
          team: driver.team.name,
          time: driver.time,
          driverImage: driver.driver.image,
        })),
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.header}>Scores</Text>

      {loading && (
        <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 50 }} />
      )}
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!loading && !error && (
        <ScrollView>
          {/* Football Card */}
          <Animatable.View animation="fadeInUp" duration={800} style={styles.card}>
            <Text style={styles.cardTitle}>Football</Text>
            {footballMatches.length > 0 ? (
              footballMatches.map((match) => (
                <View key={match.id} style={styles.matchRow}>
                  <Text style={styles.leagueText}>{match.league}</Text>
                  <View style={styles.scoreRow}>
                    <Image source={{ uri: match.homeLogo }} style={styles.teamLogo} />
                    <Text style={styles.teamText}>{match.home}</Text>
                    <Text style={styles.scoreText}>{match.score}</Text>
                    <Text style={styles.teamText}>{match.away}</Text>
                    <Image source={{ uri: match.awayLogo }} style={styles.teamLogo} />
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No recent football scores available.</Text>
            )}
          </Animatable.View>

          {/* Basketball Card (Replaced NBA) */}
          <Animatable.View animation="fadeInUp" duration={800} delay={200} style={styles.card}>
            <Text style={styles.cardTitle}>Basketball</Text>
            {basketballGames.length > 0 ? (
              basketballGames.map((game) => (
                <View key={game.id} style={styles.scoreRow}>
                  <Image source={{ uri: game.homeLogo }} style={styles.teamLogo} />
                  <Text style={styles.teamText}>{game.home}</Text>
                  <Text style={styles.scoreText}>{game.score}</Text>
                  <Text style={styles.teamText}>{game.away}</Text>
                  <Image source={{ uri: game.awayLogo }} style={styles.teamLogo} />
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No recent basketball scores available.</Text>
            )}
          </Animatable.View>

          {/* F1 Card */}
          {f1Race && (
            <Animatable.View animation="fadeInUp" duration={800} delay={400} style={styles.card}>
              <Text style={styles.cardTitle}>F1</Text>
              <Text style={styles.raceName}>{f1Race.raceName}</Text>
              <Text style={styles.circuitName}>{f1Race.circuitName}</Text>
              <Image source={{ uri: f1Race.circuitImage }} style={styles.circuitImage} />
              {f1Race.standings.map((driver) => (
                <View key={driver.id} style={styles.standingRow}>
                  <Text style={styles.position}>{driver.position}</Text>
                  <Image source={{ uri: driver.driverImage }} style={styles.driverLogo} />
                  <View>
                    <Text style={styles.driverName}>{driver.driver}</Text>
                    <Text style={styles.teamName}>{driver.team}</Text>
                  </View>
                  <Text style={styles.driverTime}>{driver.time}</Text>
                </View>
              ))}
            </Animatable.View>
          )}
          {/* Fallback for F1 if it's not loading and still null */}
          {!f1Race && !loading && (
             <View style={styles.card}>
              <Text style={styles.cardTitle}>F1</Text>
              <Text style={styles.emptyText}>No recent F1 data available.</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* --- Login/Signup Button --- */}
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
    flex: 1, 
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
    marginTop: 20, 
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
  // Added error style
  errorText: {
    color: "#c13515",
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
  },
  // Added empty style
  emptyText: {
    color: "#aaa",
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default GuestHomeScreen;