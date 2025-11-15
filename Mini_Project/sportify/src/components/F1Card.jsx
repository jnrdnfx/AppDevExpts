import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const F1Card = ({ race }) => {
  if (!race) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>F1</Text>
      <View style={styles.container}>
        {/* Left section: Circuit image + info */}
        <View style={styles.left}>
          <Image
            source={{ uri: race.circuitImage }}
            style={styles.circuitImage}
            resizeMode="cover"
          />
          <Text style={styles.circuitName}>{race.circuitName}</Text>
          <Text style={styles.date}>{new Date(race.date).toDateString()}</Text>
        </View>

        {/* Right section: Top 3 driver standings */}
        <View style={styles.right}>
          {race.standings.slice(0, 3).map((driver, index) => (
            <View key={index} style={styles.driver}>
              <Text style={styles.driverName}>
                {index + 1}. {driver.name} ({driver.team})
              </Text>
              <Text style={styles.points}>{driver.points} pts</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default F1Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#b91d1dff",
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
  container: {
    flexDirection: "row",
  },
  left: {
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  right: {
    flex: 1,
    justifyContent: "center",
  },
  circuitImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
  },
  circuitName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  date: {
    fontSize: 12,
    color: "#ccc",
  },
  driver: {
    marginBottom: 5,
  },
  driverName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  points: {
    fontSize: 12,
    color: "#ccc",
  },
});
