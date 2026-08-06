import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter, usePathname } from "expo-router";

export default function FooterNav() {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Updated tabs: removed Wallet, added Dashboard in center
  const tabs = [
    { path: "/home", label: "Home", icon: "home" },
    { path: "/business", label: "Business", icon: "office-building" },
    { path: "/Dashboard", label: "Dashboard", icon: "view-dashboard" }, // center tab
    { path: "/orders", label: "Orders", icon: "clipboard-list" },
    { path: "/profile", label: "Profile", icon: "account" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.path ||
          (pathname === "/" && tab.path === "/home");

        return (
          <TouchableOpacity
            key={tab.path}
            style={styles.item}
            onPress={() => router.push(tab.path)}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={26}
              color={isActive ? "#ffcc00" : "#ffffff"}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around", // ✅ evenly distributes tabs
    alignItems: "center",
    backgroundColor: "#006d3a",
    paddingVertical: 20,
  },
  item: { alignItems: "center", flex: 1 },
  label: { color: "#ffffff", fontSize: 12, marginTop: 2 },
  activeLabel: {
    color: "#ffcc00",
    fontWeight: "bold",
  },
});











