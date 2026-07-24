import React from "react";
import { StyleSheet, View, Text, ScrollView, ImageBackground } from "react-native";
import { Avatar } from "react-native-paper"; // ✅ for icons/thumbnails
import Header from "../../app/components/Header";
import FooterNav from "../../app/components/FooterNav";

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require("../../app/assets/home_bg.png")}
      style={styles.background}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* App Name */}
        <Text style={styles.appName}>Nammagram</Text>

        {/* Jobs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Jobs</Text>
            <Text style={styles.link}>See All &gt;</Text>
          </View>

          <View style={styles.cardRow}>
            <Avatar.Icon size={40} icon="briefcase" style={styles.icon} />
            <View style={styles.cardText}>
              <Text style={styles.jobTitle}>Marketing Manager</Text>
              <Text style={styles.jobDetails}>Full-Time | 5+ Years Experience</Text>
            </View>
            <Text style={styles.apply}>Apply</Text>
          </View>

          <View style={styles.cardRow}>
            <Avatar.Icon size={40} icon="briefcase" style={styles.icon} />
            <View style={styles.cardText}>
              <Text style={styles.jobTitle}>Sales Executive</Text>
              <Text style={styles.jobDetails}>Part-Time | 2+ Years Experience</Text>
            </View>
            <Text style={styles.apply}>Apply</Text>
          </View>
        </View>

        {/* Posts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Posts</Text>
            <Text style={styles.link}>See All &gt;</Text>
          </View>

          <View style={styles.cardRow}>
            <Avatar.Icon size={40} icon="chart-line" style={styles.icon} />
            <View style={styles.cardText}>
              <Text style={styles.postTitle}>Boost Your Business with These Tips</Text>
              <Text style={styles.postDetails}>3 hours ago</Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <Avatar.Icon size={40} icon="account-group" style={styles.icon} />
            <View style={styles.cardText}>
              <Text style={styles.postTitle}>Upcoming Networking Event!</Text>
              <Text style={styles.postDetails}>1 day ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <FooterNav />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  content: { padding: 16 },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ff6600", // orange-red for "Namma"
    marginBottom: 20,
  },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#006d3a" },
  link: { fontSize: 14, color: "#006d3a", fontWeight: "600" },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 3,
  },
  icon: { backgroundColor: "#006d3a", marginRight: 10 },
  cardText: { flex: 1 },
  jobTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  jobDetails: { fontSize: 14, color: "#666" },
  apply: {
    fontSize: 14,
    color: "#006d3a",
    fontWeight: "bold",
    textAlign: "right",
  },
  postTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  postDetails: { fontSize: 14, color: "#666" },
});




