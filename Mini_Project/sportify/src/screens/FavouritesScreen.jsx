// FavouritesScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { getFavourites } from "../utils/favourites";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavouritesScreen() {
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    const fetchFavs = async () => {
      const data = await getFavourites();
      setFavs(data);
    };
    fetchFavs();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
      <Text style={styles.header}>Your Favourites</Text>

      {favs.length === 0 ? (
        <Text style={styles.empty}>No favourites yet. Tap ❤️ in Scores to add some!</Text>
      ) : (
        favs.map((item, index) => (
          <View key={`${item.sport}-${item.id}-${index}`} style={styles.card}>
            <Text style={styles.sport}>{item.sport.toUpperCase()}</Text>

            {/* Football / NBA */}
            {item.home && item.away && (
              <View style={styles.scoreRow}>
                {item.homeLogo && <Image source={{ uri: item.homeLogo }} style={styles.teamLogo} />}
                <Text style={styles.teamText}>{item.home}</Text>
                <Text style={styles.scoreText}>{item.score}</Text>
                <Text style={styles.teamText}>{item.away}</Text>
                {item.awayLogo && <Image source={{ uri: item.awayLogo }} style={styles.teamLogo} />}
              </View>
            )}

            {/* F1 driver */}
            {item.driver && (
              <View style={styles.standingRow}>
                <Text style={styles.position}>{item.position}</Text>
                {item.driverImage && <Image source={{ uri: item.driverImage }} style={styles.driverLogo} />}
                <View>
                  <Text style={styles.driverName}>{item.driver}</Text>
                  <Text style={styles.teamName}>{item.team}</Text>
                </View>
                <Text style={styles.driverTime}>{item.time}</Text>
              </View>
            )}
          </View>
        ))
      )}
      </SafeAreaView>
    </ScrollView>
  );
}

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
  empty: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sport: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
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
});
