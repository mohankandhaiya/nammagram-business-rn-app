import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";   // ✅ use router.replace
import Header from "../../app/components/Header";
import FooterNav from "../../app/components/FooterNav";

export default function Profile() {
  const [editingSection, setEditingSection] = useState(null);

  const [profile, setProfile] = useState({
    name: "HARI",
    email: "hari@business.com",
    phone: "+91 98765 43210",
    company: "Namma Business",
    role: "Owner",
    location: "Chennai, India",
    industry: "Technology",
    verified: false,
    avatar: null,
  });

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => phone && phone.replace(/\D/g, "").length >= 10;

  const fields = [
    profile.name && profile.name.trim() !== "" ? "valid" : null,
    isValidEmail(profile.email) ? "valid" : null,
    isValidPhone(profile.phone) ? "valid" : null,
    profile.company && profile.company.trim() !== "" ? "valid" : null,
    profile.role && profile.role.trim() !== "" ? "valid" : null,
    profile.location && profile.location.trim() !== "" ? "valid" : null,
    profile.industry && profile.industry.trim() !== "" ? "valid" : null,
    profile.verified ? "valid" : null,
    profile.avatar ? "valid" : null,
  ];
  const filledCount = fields.filter(f => f).length;
  const completion = Math.round((filledCount / fields.length) * 100);

  const saveProfile = () => setEditingSection(null);

  const logout = () => {
    // Clear profile state
    setProfile({
      name: "",
      email: "",
      phone: "",
      company: "",
      role: "",
      location: "",
      industry: "",
      verified: false,
      avatar: null,
    });
    // Navigate back to login screen
    router.replace("/Login");
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Profile Completion Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Profile Completion: {completion}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completion}%` }]} />
          </View>
        </View>

        {/* Personal Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Info</Text>
            <TouchableOpacity onPress={() => setEditingSection("personal")}>
              <MaterialCommunityIcons name="pencil" size={20} color="#006d3a" />
            </TouchableOpacity>
          </View>
          {editingSection === "personal" ? (
            <View style={styles.dialogBox}>
              <TextInput style={styles.input} value={profile.name} onChangeText={(t) => setProfile({ ...profile, name: t })} placeholder="Name" />
              <TextInput style={styles.input} value={profile.email} onChangeText={(t) => setProfile({ ...profile, email: t })} placeholder="Email" />
              {!isValidEmail(profile.email) && <Text style={styles.error}>Invalid email format</Text>}
              <TextInput style={styles.input} value={profile.phone} onChangeText={(t) => setProfile({ ...profile, phone: t })} placeholder="Phone" />
              {!isValidPhone(profile.phone) && <Text style={styles.error}>Phone must have at least 10 digits</Text>}
              <TouchableOpacity style={styles.button} onPress={saveProfile}>
                                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => setEditingSection(null)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.detail}>Name: {profile.name}</Text>
              <Text style={styles.detail}>Email: {profile.email}</Text>
              <Text style={styles.detail}>Phone: {profile.phone}</Text>
            </>
          )}
        </View>

        {/* Business Profile */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Business Profile</Text>
            <TouchableOpacity onPress={() => setEditingSection("business")}>
              <MaterialCommunityIcons name="pencil" size={20} color="#006d3a" />
            </TouchableOpacity>
          </View>
          {editingSection === "business" ? (
            <View style={styles.dialogBox}>
              <TextInput style={styles.input} value={profile.company} onChangeText={(t) => setProfile({ ...profile, company: t })} placeholder="Company" />
              <TextInput style={styles.input} value={profile.role} onChangeText={(t) => setProfile({ ...profile, role: t })} placeholder="Role" />
              <TextInput style={styles.input} value={profile.location} onChangeText={(t) => setProfile({ ...profile, location: t })} placeholder="Location" />
              <TextInput style={styles.input} value={profile.industry} onChangeText={(t) => setProfile({ ...profile, industry: t })} placeholder="Industry" />
              <TouchableOpacity style={styles.button} onPress={saveProfile}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => setEditingSection(null)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.detail}>Company: {profile.company}</Text>
              <Text style={styles.detail}>Role: {profile.role}</Text>
              <Text style={styles.detail}>Location: {profile.location}</Text>
              <Text style={styles.detail}>Industry: {profile.industry}</Text>
            </>
          )}
        </View>

        {/* Verification (read-only) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Verification</Text>
          <Text style={styles.detail}>
            Status: {profile.verified ? "✅ Verified" : "❌ Not Verified"}
          </Text>
          <Text style={styles.note}>Verification can only be done by an admin.</Text>
        </View>

        {/* Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          <TouchableOpacity style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <FooterNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: { padding: 16 },

  // Progress Bar
  progressContainer: { marginBottom: 20 },
  progressLabel: { fontSize: 16, fontWeight: "600", color: "#006d3a", marginBottom: 6 },
  progressBar: { height: 12, backgroundColor: "#ddd", borderRadius: 6, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#006d3a" },

  // Cards
  card: { backgroundColor: "#fff", borderRadius: 8, padding: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#006d3a" },
  detail: { fontSize: 14, color: "#555", marginBottom: 4 },
  note: { fontSize: 12, color: "#777", fontStyle: "italic" },

  // Dialog
  dialogBox: { marginTop: 8 },

  // Inputs
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 8, marginBottom: 8, backgroundColor: "#fff" },
  error: { color: "#cc0000", fontSize: 12, marginBottom: 6 },

  // Buttons
  button: { backgroundColor: "#006d3a", borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12, marginTop: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  cancel: { backgroundColor: "#cc0000" },
});










