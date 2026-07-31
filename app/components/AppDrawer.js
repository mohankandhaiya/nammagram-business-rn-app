import React from "react";
import { StyleSheet, View, Modal, TouchableOpacity,Image, } from "react-native";
import { Drawer } from "react-native-paper";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import NammagramLogo from "../assets/ng-logo.png";
export default function AppDrawer({ visible, onClose, active, setActive }) {
  const router = useRouter();

  const drawerItems = [
    { label: "Home", route: "/home", icon: "home" },
    { label: "Wallet", route: "/wallet", icon: "wallet" },
    // { label: "Jobs", route: "/jobs", icon: "briefcase" },
    // { label: "Post", route: "/post", icon: "plus-box" },
    { label: "Settings", route: "/settings", icon: "cog" },
    { label: "Business", route: "/business", icon: "office-building" },
    { label: "Orders", route: "/orders", icon: "clipboard-list" },
    { label: "Profile", route: "/profile", icon: "account" 
       
    },
     { label: "Logout", route: "/Login", icon: "power" 
       
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sidebar}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={26} color="#006d3a" />
          </TouchableOpacity>
<View style={styles.header}>
        <Image source={NammagramLogo} style={styles.logo} resizeMode="contain" />
        {/* <Text style={styles.appTitle}>Nammagram</Text> */}
      </View>
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
                  <MaterialCommunityIcons name={item.icon} size={size} color="#006d3a" />
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
    backgroundColor:  "#fff" ,
     paddingTop: 8,
    paddingHorizontal: 10,
  },
  drawer: {
    backgroundColor: "transparent",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  header: { alignItems: "center", },
  logo: { width: 150, height: 90 },
});






