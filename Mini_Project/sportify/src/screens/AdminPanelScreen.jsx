import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, StatusBar } from "react-native";
import { db } from "../services/firebase";
import { collection, getDocs, doc, updateDoc, onSnapshot, query, where } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";

const AdminPanelScreen = () => {
  const [users, setUsers] = useState([]);
  const [vipRequests, setVipRequests] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    // Set up listeners for real-time updates
    const usersCol = collection(db, "users");
    const requestsQuery = query(usersCol, where("vipRequest", "==", true));

    // Listener for all users
    const allUsersListener = onSnapshot(usersCol, (snapshot) => {
      const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(allUsers);
    });

    // Listener for only VIP requests
    const requestsListener = onSnapshot(requestsQuery, (snapshot) => {
      const allRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVipRequests(allRequests);
    });

    // Unsubscribe on component unmount
    return () => {
      allUsersListener();
      requestsListener();
    };
  }, []);

  const approveVIP = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: "vip", vipRequest: false });
      setAuditLog(prev => [`VIP granted to user ${userId} at ${new Date().toLocaleString()}`, ...prev]);
      // No need to call fetchUsers() anymore, onSnapshot handles it
      Alert.alert("VIP Approved", "User is now VIP!");
    } catch (error) {
      console.log(error);
    }
  };

  const setUserRole = async (userId, role) => {
    try {
      await updateDoc(doc(db, "users", userId), { role });
      setAuditLog(prev => [`Role changed for user ${userId} to ${role} at ${new Date().toLocaleString()}`, ...prev]);
      // No need to call fetchUsers()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <Text style={styles.headerTitle}>Admin Panel</Text>

        <Text style={styles.sectionTitle}>VIP Requests</Text>
        {vipRequests.length === 0 ? <Text style={styles.emptyText}>No pending VIP requests</Text> :
          vipRequests.map(user => (
            <View key={user.id} style={styles.card}>
              <Text style={styles.cardText}>{user.email}</Text>
              <TouchableOpacity style={styles.approveButton} onPress={() => approveVIP(user.id)}>
                <Text style={styles.buttonText}>Approve VIP</Text>
              </TouchableOpacity>
            </View>
          ))
        }

        <Text style={styles.sectionTitle}>All Users</Text>
        {users.map(user => (
          <View key={user.id} style={styles.card}>
            <Text style={styles.cardText}>{user.email} - Role: {user.role}</Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity style={styles.approveButton} onPress={() => setUserRole(user.id, "vip")}>
                <Text style={styles.buttonText}>Set VIP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.approveButton, styles.normalButton]} onPress={() => setUserRole(user.id, "normal")}>
                <Text style={styles.buttonText}>Set Normal</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Audit Log</Text>
        {auditLog.length === 0 ? <Text style={styles.emptyText}>No audit logs yet.</Text> :
          auditLog.map((log, index) => (
            <Text key={index} style={styles.auditText}>{log}</Text>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
};

// --- RECTIFICATION: Updated styles to match dark theme ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#121212" 
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginVertical: 10, 
    color: "#fff" 
  },
  card: { 
    backgroundColor: "#1e1e1e", 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10 
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
  },
  emptyText: {
    color: "#aaa",
    fontStyle: "italic",
    marginLeft: 5,
  },
  approveButton: { 
    backgroundColor: "#1DB954", 
    padding: 10, 
    borderRadius: 8, 
    alignItems: "center",
    marginTop: 5,
  },
  normalButton: {
    backgroundColor: "#555",
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  auditText: { 
    fontSize: 12, 
    color: "#aaa", 
    marginBottom: 5,
    fontFamily: "monospace" // Good for logs
  },
});
// --------------------------------------------------------

export default AdminPanelScreen;