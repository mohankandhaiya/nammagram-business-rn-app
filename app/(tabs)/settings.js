import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../app/components/Header";
import FooterNav from "../../app/components/FooterNav";

export default function Settings() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.text}>Settings Screen</Text>
      </View>
      <FooterNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});
