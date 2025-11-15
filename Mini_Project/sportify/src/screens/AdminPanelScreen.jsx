import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { db } from "../services/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const AdminPanelScreen = () => {
  const [users, setUsers] = useState([]);
  const [vipRequests, setVipRequests] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);
    const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(allUsers);
    setVipRequests(allUsers.filter(u => u.vipRequest));
  };

  const approveVIP = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: "vip", vipRequest: false });
      setAuditLog(prev => [...prev, `VIP granted to user ${userId} at ${new Date().toLocaleString()}`]);
      fetchUsers();
      Alert.alert("VIP Approved", "User is now VIP!");
    } catch (error) {
      console.log(error);
    }
  };

  const setUserRole = async (userId, role) => {
    try {
      await updateDoc(doc(db, "users", userId), { role });
      setAuditLog(prev => [...prev, `Role changed for user ${userId} to ${role} at ${new Date().toLocaleString()}`]);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>VIP Requests</Text>
      {vipRequests.length === 0 ? <Text>No pending VIP requests</Text> :
        vipRequests.map(user => (
          <View key={user.id} style={styles.card}>
            <Text>{user.email}</Text>
            <TouchableOpacity style={styles.approveButton} onPress={() => approveVIP(user.id)}>
              <Text style={{ color: "#fff" }}>Approve VIP</Text>
            </TouchableOpacity>
          </View>
        ))
      }

      <Text style={styles.sectionTitle}>All Users</Text>
      {users.map(user => (
        <View key={user.id} style={styles.card}>
          <Text>{user.email} - Role: {user.role}</Text>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <TouchableOpacity style={styles.approveButton} onPress={() => setUserRole(user.id, "vip")}>
              <Text style={{ color: "#fff" }}>Set VIP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.approveButton, { marginLeft: 10 }]} onPress={() => setUserRole(user.id, "normal")}>
              <Text style={{ color: "#fff" }}>Set Normal</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Audit Log</Text>
      {auditLog.map((log, index) => (
        <Text key={index} style={styles.auditText}>{log}</Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10 },
  approveButton: { backgroundColor: "#1DB954", padding: 10, borderRadius: 8, alignItems: "center" },
  auditText: { fontSize: 14, color: "#555", marginBottom: 5 },
});

export default AdminPanelScreen;
