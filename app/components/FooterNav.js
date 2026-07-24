import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function FooterNav({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Business Info */}
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("BusinessInfo")}>
        <MaterialCommunityIcons name="office-building" size={24} color="#ffffff" />
        <Text style={styles.label}>Business Info</Text>
      </TouchableOpacity>

      {/* Wallet */}
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("Wallet")}>
        <MaterialCommunityIcons name="wallet" size={24} color="#ffffff" />
        <Text style={styles.label}>Wallet</Text>
      </TouchableOpacity>

      {/* Jobs */}
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("Jobs")}>
        <MaterialCommunityIcons name="briefcase" size={24} color="#ffffff" />
        <Text style={styles.label}>Jobs</Text>
      </TouchableOpacity>

      {/* Posts */}
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("Posts")}>
        <MaterialCommunityIcons name="post" size={24} color="#ffffff" />
        <Text style={styles.label}>Posts</Text>
      </TouchableOpacity>

      {/* Support (Document) */}
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("SupportDoc")}>
        <MaterialCommunityIcons name="file-document" size={24} color="#ffffff" />
        <Text style={styles.label}>Support</Text>
      </TouchableOpacity>

      {/* Support (Headset) */}
      {/* <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("SupportHeadset")}>
        <MaterialCommunityIcons name="headset" size={24} color="#ffffff" />
        <Text style={styles.label}>Support</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#006d3a", // ✅ green bar
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#004d26",
  },
  item: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    color: "#ffffff",
    fontSize: 12,
    marginTop: 2,
  },
});







