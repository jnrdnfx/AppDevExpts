import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FootballCard = ({ matches }) => {
  if (!matches || matches.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Football</Text>
      {matches.map((match, index) => (
        <View key={index} style={styles.match}>
          <Text style={styles.league}>{match.league}</Text>
          <Text style={styles.teams}>
            {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
          </Text>
          <Text style={styles.date}>{new Date(match.date).toDateString()}</Text>
        </View>
      ))}
    </View>
  );
};

export default FootballCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1DB954", // Spotify green
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
  league: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
