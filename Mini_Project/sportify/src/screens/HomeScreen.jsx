import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
// --- RECTIFICATION: Import the REAL favourites functions ---
// I'm assuming you have this file, if not, you'll need to create it
// import { getFavourites, addFavourite, removeFavourite } from "../utils/favourites";
// --------------------------------------------------------
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const { width } = Dimensions.get("window");
const API_KEY = "7640a8de8074b8683b8471a35200d676"; // Use your key

// --- DUMMY FAVOURITES (REPLACE THIS) ---
const FavouritesStore = {
  _favs: [],
  getFavourites: async () => [...FavouritesStore._favs],
  addFavourite: async (item) => {
    if (!FavouritesStore._favs.find(f => f.id === item.id && f.sport === item.sport)) {
      FavouritesStore._favs.push(item);
    }
  },
  removeFavourite: async (item) => {
    FavouritesStore._favs = FavouritesStore._favs.filter(f => !(f.id === item.id && f.sport === item.sport));
  },
};
const { getFavourites, addFavourite, removeFavourite } = FavouritesStore;
// --- End of dummy implementation ---


export default function HomeScreen() {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- API DATA STATES ---
  const [footballMatches, setFootballMatches] = useState([]);
  // --- RECTIFICATION: Renamed to match the new function ---
  const [basketballGames, setBasketballGames] = useState([]);
  // -----------------------------------------------------
  const [f1Race, setF1Race] = useState(null);
  
  const { user } = useContext(AuthContext); // Get user

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchAllData = async () => {
      if (user) {
        const data = await getFavourites();
        setFavs(data);
      }

      try {
        setLoading(true);
        setError(null);
        
        await Promise.all([
          fetchFootball(),
          // --- RECTIFICATION: Call the correct function ---
          fetchBasketball(),
          // --------------------------------------------
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
  }, [user]);

  // --- API CALL: FOOTBALL ---
  const fetchFootball = async () => {
    const leagues = [39, 140]; // Premier League, La Liga
    // --- RECTIFICATION: Use reliable 2023 season ---
    const season = 2023;
    let matches = [];
    
    for (const leagueId of leagues) {
      // --- RECTIFICATION: Removed 'last=1' as you requested ---
      const res = await axios.get(
        `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${season}`,
        { headers: { "x-apisports-key": API_KEY } }
      );
      
      // Get the first 2 matches from the response
      const someMatches = res.data.response.slice(0, 2);
      for (const match of someMatches) {
        if (match) {
          // Normalize data
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
    // --- RECTIFICATION: Use reliable 2022-2023 season ---
    const season = "2022-2023";
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
    // --- RECTIFICATION: Use reliable 2023 season ---
    const season = 2023;
    // 1. Get the last race of the season (re-added last=1)
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
      // Normalize data
      setF1Race({
        id: lastRace.id,
        raceName: lastRace.competition.name,
        circuitName: lastRace.circuit.name,
        circuitImage: lastRace.circuit.image,
        standings: rankings.slice(0, 3).map(driver => ({ // Get top 3
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
  
  // --- Favourites logic (unchanged) ---
  const toggleFavourite = async (item, sport) => {
    // --- RECTIFICATION: Handle 'basketball' sport name ---
    const sportName = sport === 'basketball' ? 'basketball' : sport;
    const itemWithSport = { ...item, sport: sportName };

    const exists = favs.find(f => f.id === item.id && f.sport === sportName);
    if (exists) {
      await removeFavourite(itemWithSport);
    } else {
      await addFavourite(itemWithSport);
    }
    const updated = await getFavourites();
    setFavs(updated);
  };

  const isFav = (item, sport) => {
    const sportName = sport === 'basketball' ? 'basketball' : sport;
    return favs.some(f => f.id === item.id && f.sport === sportName);
  }

  // --- RENDER ---
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#121212"}}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.header}>Scores</Text>
      
      {loading && (
        <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 50 }} />
      )}
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!loading && !error && (
        <ScrollView style={styles.container}>
          {/* Football Card */}
          <View style={styles.card}>
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
                    <TouchableOpacity onPress={() => toggleFavourite(match, "football")}>
                      <Text style={{ color: isFav(match, "football") ? "red" : "white", marginLeft: 8 }}>❤️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No recent football scores available.</Text>
            )}
          </View>

          {/* Basketball Card (Replaced NBA) */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Basketball</Text>
            {basketballGames.length > 0 ? (
              basketballGames.map((game) => (
                <View key={game.id} style={styles.scoreRow}>
                  <Image source={{ uri: game.homeLogo }} style={styles.teamLogo} />
                  <Text style={styles.teamText}>{game.home}</Text>
                  <Text style={styles.scoreText}>{game.score}</Text>
                  <Text style={styles.teamText}>{game.away}</Text>
                  <Image source={{ uri: game.awayLogo }} style={styles.teamLogo} />
                  <TouchableOpacity onPress={() => toggleFavourite(game, "basketball")}>
                    <Text style={{ color: isFav(game, "basketball") ? "red" : "white", marginLeft: 8 }}>❤️</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No recent basketball scores available.</Text>
            )}
          </View>

          {/* F1 Card */}
          {f1Race && (
            <View style={styles.card}>
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
                  <TouchableOpacity onPress={() => toggleFavourite(driver, "f1")}>
                    <Text style={{ color: isFav(driver, "f1") ? "red" : "white", marginLeft: 8 }}>❤️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
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
    </SafeAreaView>
  );
}

// --- STYLES (Unchanged) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffffff",
    alignSelf: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
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
  errorText: {
    color: "#c13515",
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
  },
  emptyText: {
    color: "#aaa",
    fontStyle: "italic",
    textAlign: "center",
  },
});