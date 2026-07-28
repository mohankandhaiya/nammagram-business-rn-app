import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Header from "../../app/components/Header";
import FooterNav from "../../app/components/FooterNav";
import { useLocalSearchParams } from "expo-router";

export default function JobDetails() {
  const { job } = useLocalSearchParams();
  const parsedJob = job ? JSON.parse(job) : {};

  const [applicants, setApplicants] = useState([
    { id: 1, name: "Arun Kumar", experience: "5 years", status: "Pending" },
    { id: 2, name: "Priya Sharma", experience: "3 years", status: "Pending" },
  ]);

  const updateStatus = (id, status) => {
    setApplicants(applicants.map(app => app.id === id ? { ...app, status } : app));
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Job Info */}
        <View style={styles.card}>
          <Text style={styles.role}>{job.role}</Text>
          <Text style={styles.company}>{job.company}</Text>
          <Text style={styles.detail}>📍 {job.location}</Text>
          <Text style={styles.pay}>💰 {job.pay}</Text>
          <Text style={styles.description}>
            {job.description || "No description provided. Add details about responsibilities, requirements, and perks."}
          </Text>
        </View>

        {/* Applicants Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Applicants</Text>
          {applicants.map((app) => (
            <View key={app.id} style={styles.applicantCard}>
              <Text style={styles.applicantName}>{app.name}</Text>
              <Text style={styles.applicantDetail}>Experience: {app.experience}</Text>
              <Text style={styles.applicantStatus}>Status: {app.status}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.accept]}
                  onPress={() => updateStatus(app.id, "Accepted")}
                >
                  <Text style={styles.actionText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.reject]}
                  onPress={() => updateStatus(app.id, "Rejected")}
                >
                  <Text style={styles.actionText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <FooterNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  role: { fontSize: 22, fontWeight: "700", color: "#006d3a" },
  company: { fontSize: 16, color: "#555", marginBottom: 4 },
  detail: { fontSize: 14, color: "#555" },
  pay: { fontSize: 15, fontWeight: "600", color: "#006d3a", marginTop: 6 },
  description: { fontSize: 14, color: "#333", marginTop: 10 },

  section: { marginTop: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#006d3a", marginBottom: 10 },

  applicantCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  applicantName: { fontSize: 16, fontWeight: "600", color: "#333" },
  applicantDetail: { fontSize: 14, color: "#555" },
  applicantStatus: { fontSize: 14, color: "#006d3a", marginVertical: 4 },
  actions: { flexDirection: "row", justifyContent: "space-around", marginTop: 8 },
  actionButton: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  accept: { backgroundColor: "#006d3a" },
  reject: { backgroundColor: "#cc0000" },
  actionText: { color: "#fff", fontWeight: "bold" },
});
