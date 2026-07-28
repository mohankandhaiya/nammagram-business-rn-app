import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from "react-native";
import Header from "../../app/components/Header";
import FooterNav from "../../app/components/FooterNav";

export default function Jobs() {
  const myCompany = "Namma Business"; 

  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([
    { id: 1, role: "Marketing Manager", company: "ABC Corp", location: "Chennai", pay: "₹50,000" },
    { id: 2, role: "Sales Executive", company: "XYZ Ltd", location: "Bangalore", pay: "₹35,000" },
    { id: 3, role: "Software Engineer", company: "Namma Business", location: "Remote", pay: "₹70,000" },
  ]);

  const [newRole, setNewRole] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newPay, setNewPay] = useState("");
  const [filterMine, setFilterMine] = useState(false);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.role.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterMine ? job.company === myCompany : true;
    return matchesSearch && matchesFilter;
  });

  const addJob = () => {
    if (!newRole || !newLocation || !newPay) return;
    const newJob = {
      id: Date.now(),
      role: newRole,
      company: myCompany,
      location: newLocation,
      pay: newPay,
    };
    setJobs([newJob, ...jobs]);
    setNewRole("");
    setNewLocation("");
    setNewPay("");
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Add Job Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add a Job</Text>
        <TextInput style={styles.input} placeholder="Role" value={newRole} onChangeText={setNewRole} />
        <TextInput style={styles.input} placeholder="Location" value={newLocation} onChangeText={setNewLocation} />
        <TextInput style={styles.input} placeholder="Pay" value={newPay} onChangeText={setNewPay} />
        <TouchableOpacity style={styles.addButton} onPress={addJob}>
          <Text style={styles.addButtonText}>Post Job</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Toggle */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, !filterMine && styles.activeFilter]}
          onPress={() => setFilterMine(false)}
        >
          <Text style={styles.filterText}>All Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterMine && styles.activeFilter]}
          onPress={() => setFilterMine(true)}
        >
          <Text style={styles.filterText}>My Company Jobs</Text>
        </TouchableOpacity>
      </View>

      {/* Job Listings */}
      <ScrollView contentContainerStyle={styles.list}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <View key={job.id} style={styles.card}>
              <Text style={styles.role}>{job.role}</Text>
              <Text style={styles.company}>{job.company}</Text>
              <Text style={styles.detail}>📍 {job.location}</Text>
              <Text style={styles.pay}>💰 {job.pay}</Text>
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyText}>{job.company === myCompany ? "Manage" : "Hire"}</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No jobs found</Text>
            <Text style={styles.subText}>Try searching or posting a new job</Text>
          </View>
        )}
      </ScrollView>

      <FooterNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  searchContainer: { padding: 12 },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#006d3a", marginBottom: 10 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#006d3a",
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: "#006d3a",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activeFilter: { backgroundColor: "#006d3a" },
  filterText: { color: "#fff", fontWeight: "600" },
  list: { paddingHorizontal: 16, paddingBottom: 80 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  role: { fontSize: 18, fontWeight: "700", color: "#006d3a" },
  company: { fontSize: 14, color: "#555", marginBottom: 4 },
  detail: { fontSize: 14, color: "#555" },
  pay: { fontSize: 15, fontWeight: "600", color: "#006d3a", marginTop: 6 },
  applyButton: {
    backgroundColor: "#006d3a",
    borderRadius: 6,
    paddingVertical: 6,
    marginTop: 10,
    alignItems: "center",
  },
  applyText: { color: "#fff", fontWeight: "bold" },
  emptyContainer: { alignItems: "center", marginTop: 50, paddingHorizontal: 20 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 8 },
  subText: { fontSize: 14, color: "#555", textAlign: "center" },
});


