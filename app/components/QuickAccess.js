// components/QuickAccess.js
import React, { useRef } from "react";
import { View, Text, TouchableWithoutFeedback, Animated, StyleSheet, Platform,TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default function QuickAccess() {
  const router = useRouter();

  const shortcuts = [
    { id: 1, label: "Jobs", icon: "briefcase-outline", route: "/business" },
    { id: 2, label: "Posts", icon: "post-outline", route: "/business" },
    { id: 3, label: "Transactions", icon: "cash-multiple", route: "/business/transactions" },
    { id: 4, label: "Profile", icon: "account-outline", route: "/profile" },
  ];

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Access</Text>
      <View style={styles.row}>
        {shortcuts.map((item) => (
          <View key={item.id} style={styles.cardWrapper}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(item.route)}
            >
              <Icon name={item.icon} size={28} color="#006d3a" />
            </TouchableOpacity>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    // paddingHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006d3a",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardWrapper: {
    alignItems: "center",
    // width: 85,
  },
  card: {
    width:70,
    height: 70,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});




