import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NFLCard = ({ games }) => {
  if (!games || games.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>NFL</Text>
      {games.map((game, index) => (
        <View key={index} style={styles.match}>
          <Text style={styles.teams}>
            {game.homeTeam} {game.homeScore} - {game.awayScore} {game.awayTeam}
          </Text>
          <Text style={styles.date}>{new Date(game.date).toDateString()}</Text>
        </View>
      ))}
    </View>
  );
};

export default NFLCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#d34300ff", // Spotify green
    margin: 10,
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  match: {
    marginBottom: 8,
  },
  teams: {
    color: "#fff",
    fontSize: 16,
  },
  date: {
    color: "#ccc",
    fontSize: 12,
  },
});
