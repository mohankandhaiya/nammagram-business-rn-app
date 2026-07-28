import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../app/helpers/firebaseConfig";
import AppDrawer from "./AppDrawer";

export default function Header() {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [active, setActive] = useState("home");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      router.replace("/Login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Appbar.Header style={styles.header}>
        {/* Drawer toggle */}
        <Appbar.Action
          icon="menu"
          color="#fff"
          onPress={() => setDrawerVisible(true)}
        />

        {/* Right side icons */}
        <View style={styles.iconGroup}>
          <Appbar.Action icon="magnify" color="#fff" onPress={() => console.log("Search tapped")} />
          <Appbar.Action icon="bell" color="#fff" onPress={() => console.log("Notifications tapped")} />
          <Appbar.Action icon="power" color="#fff" onPress={handleLogout} />
        </View>
      </Appbar.Header>

      {/* Overlay Drawer */}
      <AppDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        active={active}
        setActive={setActive}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#006d3a",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
});







