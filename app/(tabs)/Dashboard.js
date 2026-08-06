import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../components/Header";       // ✅ import your Header
import FooterNav from "../components/FooterNav"; // ✅ import your FooterNav

export default function Dashboard() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Dashboard Title */}
        <Text style={styles.header}>Dashboard</Text>

        {/* Report Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="file-chart" size={22} color="#006d3a" />
            <Text style={styles.cardTitle}>Report</Text>
          </View>
          <Text style={styles.cardText}>Total Orders: 120</Text>
          <Text style={styles.cardText}>Completed: 95</Text>
          <Text style={styles.cardText}>Pending: 25</Text>
        </View>

        {/* Sales Overview Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="chart-line" size={22} color="#006d3a" />
            <Text style={styles.cardTitle}>Sales Overview</Text>
          </View>
          <Text style={styles.cardText}>Total Sales: ₹2,40,000</Text>
          <Text style={styles.cardText}>This Month: ₹45,000</Text>
          <Text style={styles.cardText}>Growth: +12%</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={{ color: "#999" }}>Chart Placeholder</Text>
          </View>
        </View>

        {/* Expenses Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="currency-inr" size={22} color="#006d3a" />
            <Text style={styles.cardTitle}>Expenses</Text>
          </View>
          <Text style={styles.cardText}>Rent: ₹20,000</Text>
          <Text style={styles.cardText}>Utilities: ₹5,000</Text>
          <Text style={styles.cardText}>Supplies: ₹12,000</Text>
          <Text style={styles.cardText}>Total Expenses: ₹37,000</Text>
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <FooterNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: { flex: 1, padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#006d3a",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 8, color: "#006d3a" },
  cardText: { fontSize: 14, color: "#333", marginBottom: 4 },
  chartPlaceholder: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
});

