import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaProvider } from "react-native-safe-area-context";
const API_KEY = "7640a8de8074b8683b8471a35200d676"; // Global API key

// -------------------------------------------------------------------------
// --- BASKETBALL STATS COMPONENT (pulled from BasketballStats.jsx) ---
// -------------------------------------------------------------------------
const BasketballStatsView = ({ onBack }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);

  const LEAGUE_ID = 12;
  const SEASON = "2023-2024";

  useEffect(() => {
    const fetchTeams = async () => {
      setLoadingTeams(true);
      try {
        const res = await fetch(
          `https://v1.basketball.api-sports.io/teams?league=${LEAGUE_ID}&season=${SEASON}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "v1.basketball.api-sports.io",
              "x-rapidapi-key": API_KEY,
            },
          }
        );
        const data = await res.json();
        setTeams(data.response);
      } catch (err) {
        console.log("Error fetching basketball teams:", err);
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchTeams();
  }, []);

  const fetchStats = async (team) => {
    if (!team) return;
    setLoadingStats(true);
    setStats(null);
    try {
      const res = await fetch(
        `https://v1.basketball.api-sports.io/statistics?league=${LEAGUE_ID}&team=${team.id}&season=${SEASON}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "v1.basketball.api-sports.io",
            "x-rapidapi-key": API_KEY,
          },
        }
      );
      const data = await res.json();
      setStats(data.response);
    } catch (err) {
      console.log("Error fetching basketball stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const renderTeamLogo = ({ item }) => (
    <TouchableOpacity
      style={[
        basketballStyles.teamCard,
        selectedTeam?.id === item.id && { borderColor: "#FFD700" },
      ]}
      onPress={() => {
        setSelectedTeam(item);
        fetchStats(item);
      }}
    >
      {item.logo ? (
        <Image source={{ uri: item.logo }} style={basketballStyles.teamLogo} />
      ) : (
        <View style={basketballStyles.teamLogoPlaceholder}>
          <Text style={{ color: "#fff" }}>{item.name[0]}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="#FFD700" />
        <Text style={styles.backButtonText}>Back to Stats</Text>
      </TouchableOpacity>
      <Text style={basketballStyles.title}>Basketball Teams</Text>
      {loadingTeams && <ActivityIndicator size="large" color="#FFD700" />}
    </>
  );

  const renderFooter = () => (
    <>
      {loadingStats && (
        <ActivityIndicator
          size="large"
          color="#FFD700"
          style={{ marginTop: 20 }}
        />
      )}
      {stats && (
        <View style={basketballStyles.statsContainer}>
          <Text style={basketballStyles.statsTitle}>{selectedTeam.name} Statistics</Text>
          <Text style={basketballStyles.statsText}>
            Games Played: {stats.games?.played?.all ?? "N/A"}
          </Text>
          <Text style={basketballStyles.statsText}>
            Wins: {stats.games?.wins?.all?.total ?? "N/A"} (
            {stats.games?.wins?.all?.percentage ?? "N/A"})
          </Text>
          <Text style={basketballStyles.statsText}>
            Losses: {stats.games?.loses?.all?.total ?? "N/A"} (
            {stats.games?.loses?.all?.percentage ?? "N/A"})
          </Text>
          <Text style={basketballStyles.statsText}>
            Points For: {stats.points?.for?.total?.all ?? "N/A"} (Avg:{" "}
            {stats.points?.for?.average?.all ?? "N/A"})
          </Text>
          <Text style={basketballStyles.statsText}>
            Points Against: {stats.points?.against?.total?.all ?? "N/A"} (Avg:{" "}
            {stats.points?.against?.average?.all ?? "N/A"})
          </Text>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={basketballStyles.container}>
      <FlatList
        data={loadingTeams ? [] : teams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTeamLogo}
        numColumns={5}
        contentContainerStyle={basketballStyles.gridContainer}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
};

// -----------------------------------------------------------------------
// --- BASEBALL STATS COMPONENT (pulled from BaseballStats.jsx) ---
// -----------------------------------------------------------------------
const BaseballStatsView = ({ onBack }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);

  const LEAGUE_ID = 1; // MLB
  const SEASON = "2023";

  useEffect(() => {
    const fetchTeams = async () => {
      setLoadingTeams(true);
      try {
        const res = await fetch(
          `https://v1.baseball.api-sports.io/teams?league=${LEAGUE_ID}&season=${SEASON}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "v1.baseball.api-sports.io",
              "x-rapidapi-key": API_KEY,
            },
          }
        );
        const data = await res.json();
        setTeams(data.response.filter((team) => team.logo));
      } catch (err) {
        console.log("Error fetching baseball teams:", err);
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchTeams();
  }, []);

  const fetchStats = async (team) => {
    if (!team) return;
    setLoadingStats(true);
    setStats(null);
    try {
      const res = await fetch(
        `https://v1.baseball.api-sports.io/teams/statistics?league=${LEAGUE_ID}&team=${team.id}&season=${SEASON}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "v1.baseball.api-sports.io",
            "x-rapidapi-key": API_KEY,
          },
        }
      );
      const data = await res.json();
      setStats(data.response);
    } catch (err) {
      console.log("Error fetching baseball stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const renderTeamLogo = ({ item }) => (
    <TouchableOpacity
      style={[
        baseballStyles.teamCard,
        selectedTeam?.id === item.id && { borderColor: "#FFD700" },
      ]}
      onPress={() => {
        setSelectedTeam(item);
        fetchStats(item);
      }}
    >
      {item.logo ? (
        <Image source={{ uri: item.logo }} style={baseballStyles.teamLogo} />
      ) : (
        <View style={baseballStyles.teamLogoPlaceholder}>
          <Text style={{ color: "#fff" }}>{item.name[0]}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="#FFD700" />
        <Text style={styles.backButtonText}>Back to Stats</Text>
      </TouchableOpacity>
      <Text style={baseballStyles.title}>Baseball Teams</Text>
      {loadingTeams && <ActivityIndicator size="large" color="#FFD700" />}
    </>
  );

  const renderFooter = () => (
    <>
      {loadingStats && (
        <ActivityIndicator
          size="large"
          color="#FFD700"
          style={{ marginTop: 20 }}
        />
      )}
      {stats && (
        <View style={baseballStyles.statsContainer}>
          <Text style={baseballStyles.statsTitle}>{selectedTeam.name} Statistics</Text>
          {/* --- RECTIFICATION --- */}
          {/* We must specify the '.all' property from the object */}
          <Text style={baseballStyles.statsText}>
            Games Played: {stats.games?.played?.all ?? "N/A"}
          </Text>
          {/*
            FIX: The error was here. stats.games.wins.all is an object.
            We need to access .total, just like in the Basketball component.
          */}
          <Text style={baseballStyles.statsText}>
            Wins: {stats.games?.wins?.all?.total ?? "N/A"}
          </Text>
          <Text style={baseballStyles.statsText}>
            Losses: {stats.games?.loses?.all?.total ?? "N/A"}
          </Text>
          {/* ------------------- */}
          <Text style={baseballStyles.statsText}>
            Runs For: {stats.runs?.for ?? "N/A"}
          </Text>
          {/* REMOVED DUPLICATE LINES THAT WERE HERE */}
          <Text style={baseballStyles.statsText}>
            Runs Against: {stats.runs?.against ?? "N/A"}
          </Text>
          <Text style={baseballStyles.statsText}>
            Total Hits: {stats.hits?.total ?? "N/A"}
          </Text>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={baseballStyles.container}>
      <FlatList
        data={loadingTeams ? [] : teams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTeamLogo}
        numColumns={5}
        contentContainerStyle={baseballStyles.gridContainer}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
};

// -----------------------------------------------------------------
// --- MAIN STATS SCREEN COMPONENT (The Hub & Gate) ---
// -----------------------------------------------------------------
const StatsScreen = () => {
  const { isVip } = useContext(AuthContext);
  const navigation = useNavigation();
  // This state controls which view is active:
  // 'hub', 'basketball', or 'baseball'
  const [sportView, setSportView] = useState("hub");

  // --- The "Gate" Logic ---
  // If not VIP, show the upgrade card.
  if (!isVip) {
    return (
      <SafeAreaView style={styles.gateContainer}>
        <View style={styles.gateCenter}>
          <Text style={styles.gateTitle}>Stats is a VIP Feature</Text>
          <Text style={styles.gateText}>
            Upgrade to VIP to view advanced team statistics and more.
          </Text>
          <TouchableOpacity
            style={styles.gateButton}
            onPress={() => navigation.navigate("VIPGating")}
          >
            <Text style={styles.gateButtonText}>Upgrade to VIP</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- The VIP "Hub" View ---
  // If user is VIP and sportView is 'hub', show buttons
  if (sportView === "hub") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Advanced Stats</Text>
          <Text style={styles.subtitle}>Select a sport to view advanced stats.</Text>
        </View>

        {/* Basketball Stats Button */}
        <TouchableOpacity
          style={styles.sportButton}
          onPress={() => setSportView("basketball")} // Change view state
        >
          <Ionicons name="basketball-outline" size={30} color="#FFD700" />
          <Text style={styles.sportButtonText}>View Basketball Stats</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#555" />
        </TouchableOpacity>

        {/* Baseball Stats Button */}
        <TouchableOpacity
          style={styles.sportButton}
          onPress={() => setSportView("baseball")} // Change view state
        >
          <Ionicons name="baseball-outline" size={30} color="#FFD700" />
          <Text style={styles.sportButtonText}>View Baseball Stats</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#555" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // --- Render Sport-Specific Views ---
  if (sportView === "basketball") {
    return <BasketballStatsView onBack={() => setSportView("hub")} />;
  }

  if (sportView === "baseball") {
    return <BaseballStatsView onBack={() => setSportView("hub")} />;
  }

  // Fallback (shouldn't be reached)
  return null;
};

// --- STYLES ---
const styles = StyleSheet.create({
  // --- STYLES FOR VIP HUB ---
  container: { flex: 1, backgroundColor: "#121212", padding: 16 },
  header: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  title: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  subtitle: { color: "#aaa", fontSize: 16, marginTop: 5 },
  sportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  sportButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginLeft: 15,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 4, // Align with grid
  },
  backButtonText: {
    color: "#FFD700",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },

  // --- STYLES FOR THE "GATE" (NON-VIP) ---
  gateContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  gateCenter: {
    width: "100%",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gateTitle: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  gateText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  gateButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  gateButtonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "bold",
  },
});

// --- STYLES FOR BASKETBALL STATS ---
const basketballStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 12, paddingHorizontal: 4 },
  gridContainer: {
    paddingVertical: 8,
  },
  teamCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 4,
    height: 70,
  },
  teamLogo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  teamLogoPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "#333",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  statsTitle: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  statsText: { color: "#fff", fontSize: 14, marginBottom: 6 },
});

// --- STYLES FOR BASEBALL STATS ---
const baseballStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 12, paddingHorizontal: 4 },
  gridContainer: {
    paddingVertical: 8,
  },
  teamCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 4,
    height: 70,
  },
  teamLogo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  teamLogoPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "#333",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  statsTitle: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  statsText: { color: "#fff", fontSize: 14, marginBottom: 6 },
});

export default StatsScreen;