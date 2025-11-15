import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const VIPGatingScreen = () => {
  const { userRole, isVip } = useContext(AuthContext);
  const [requestSent, setRequestSent] = useState(false);

  const handleRequestVIP = () => {
    if (requestSent) {
      Alert.alert("VIP Request", "You have already requested VIP. Please wait for approval.");
      return;
    }
    // Mock sending request to admin
    setRequestSent(true);
    Alert.alert("VIP Request Sent", "Wait until an admin approves your request.");
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
      <Animatable.View animation="fadeInUp" style={styles.card}>
        <Text style={styles.cardTitle}>Current Plan</Text>
        <Text style={styles.cardDesc}>
          {isVip ? "VIP User: Full access" : "Normal User: Limited access"}
        </Text>
      </Animatable.View>

      {!isVip && (
        <Animatable.View animation="fadeInUp" delay={200} style={styles.card}>
          <Text style={[styles.cardTitle, { color: "#1DB954" }]}>VIP Plan</Text>
          <Text style={styles.cardDesc}>
            Get exclusive access to:
          </Text>
          <Text style={styles.feature}>• Advanced Stats</Text>
          <Text style={styles.feature}>• Custom Profile,VIP Badge</Text>

          <TouchableOpacity style={styles.vipButton} onPress={handleRequestVIP}>
            <Text style={styles.vipButtonText}>Request VIP</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  card: {
    backgroundColor: "#212121ff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  cardDesc: { fontSize: 16, color: "#ccc", marginBottom: 15 },
  feature: { fontSize: 16, color: "#fff", marginLeft: 10, marginBottom: 5 },
  vipButton: {
    marginTop: 10,
    backgroundColor: "#1DB954",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  vipButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default VIPGatingScreen;
