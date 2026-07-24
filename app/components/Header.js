import React from "react";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../app/helpers/firebaseConfig";

export default function Header() {
  const router = useRouter();

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
    <Appbar.Header style={styles.header}>
      <View style={styles.iconGroup}>
        <Appbar.Action icon="magnify" color="#fff" onPress={() => console.log("Search tapped")} />
        <Appbar.Action icon="bell" color="#fff" onPress={() => console.log("Notifications tapped")} />
        <Appbar.Action icon="power" color="#fff" onPress={handleLogout} />
      </View>
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#006d3a",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
});


