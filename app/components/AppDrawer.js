import React from "react";
import { StyleSheet, View, Modal, TouchableOpacity, Image, Text } from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import NammagramLogo from "../assets/ng-logo.png";
import { signOut } from "firebase/auth";
import { auth } from "../../app/helpers/firebaseConfig";

export default function AppDrawer({ visible = false, onClose, active, setActive }) {
  const router = useRouter();

  const drawerItems = [
    { label: "Home", route: "/home", icon: "home" },
    { label: "Wallet", route: "/wallet", icon: "wallet" },
    { label: "Settings", route: "/settings", icon: "cog" },
    { label: "Business", route: "/business", icon: "office-building" },
    { label: "Orders", route: "/orders", icon: "clipboard-list" },
    { label: "Profile", route: "/profile", icon: "account" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      router.replace("/Login");
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sidebar}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={26} color="#006d3a" />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.header}>
            <Image source={NammagramLogo} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Drawer Items */}
          <View style={styles.drawerList}>
            {drawerItems.map((item) => {
              const isActive = active === item.label.toLowerCase();
              return (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.drawerItem, isActive && styles.activeItem]}
                  onPress={() => {
                    setActive(item.label.toLowerCase());
                    router.replace(item.route);
                    onClose();
                  }}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={22}
                    color={isActive ? "#fff" : "#006d3a"}
                    style={styles.icon}
                  />
                  <Text style={[styles.label, isActive && styles.activeLabel]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Full-width Logout Footer */}
          <TouchableOpacity style={styles.logoutFooter} onPress={handleLogout}>
            <MaterialCommunityIcons name="power" size={22} color="#fff" style={styles.icon} />
            <Text style={styles.logoutLabel}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sidebar: {
    width: 240,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 7,
    paddingHorizontal: 10,
    justifyContent: "space-between", // ✅ ensures footer stays at bottom
  },
  closeButton: { alignSelf: "flex-end" },
  header: { alignItems: "center" },
  logo: { width: 150, height: 100 },
  drawerList: { flexGrow: 1 },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 1,
  },
  activeItem: { backgroundColor: "#006d3a" },
  icon: { marginRight: 12 },
  label: { fontSize: 15, color: "#006d3a", fontWeight: "600" },
  activeLabel: { color: "#fff" },
  logoutFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // ✅ center text + icon
    backgroundColor: "#006d3a",
    paddingVertical: 14,
     borderRadius: 6,
    marginBottom: 40,
  },
  logoutLabel: { fontSize: 16, color: "#fff", fontWeight: "700" },
});















