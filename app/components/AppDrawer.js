import React from "react";
import { StyleSheet, View, Modal, TouchableOpacity } from "react-native";
import { Drawer } from "react-native-paper";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function AppDrawer({ visible, onClose, active, setActive }) {
  const router = useRouter();

  const drawerItems = [
    { label: "Home", route: "/home", icon: "home" },
    { label: "Wallet", route: "/wallet", icon: "wallet" },
    { label: "Jobs", route: "/jobs", icon: "briefcase" },
    { label: "Post", route: "/post", icon: "plus-box" },
    { label: "Settings", route: "/settings", icon: "cog" },
    { label: "Business", route: "/business", icon: "office-building" },
    { label: "Orders", route: "/orders", icon: "clipboard-list" },
    { label: "Profile", route: "/profile", icon: "account" },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sidebar}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={26} color="#fff" />
          </TouchableOpacity>

          <Drawer.Section
            title="Business Menu"
            style={styles.drawer}
            titleStyle={{ color: "#ff9d09" }}   // ✅ section title in white
          >
            {drawerItems.map((item) => (
              <Drawer.Item
                key={item.label}
                label={item.label}
                icon={({ size }) => (
                  <MaterialCommunityIcons name={item.icon} size={size} color="#fff" />
                )}
                labelStyle={{ color: "#fff" }}   // ✅ item label in white
                active={active === item.label.toLowerCase()}
                onPress={() => {
                  setActive(item.label.toLowerCase());
                  router.replace(item.route);
                  onClose();
                }}
              />
            ))}
          </Drawer.Section>
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
    backgroundColor: "#006d3a",
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  drawer: {
    backgroundColor: "transparent",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
});






