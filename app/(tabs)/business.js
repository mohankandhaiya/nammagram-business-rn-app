import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal } from "react-native";
import Header from "../../app/components/Header";
import FooterNav from "../../app/components/FooterNav";

export default function Business() {
  const [activeTab, setActiveTab] = useState("jobs");

  const [company, setCompany] = useState({
    name: "Namma Business",
    address: "Chennai, India",
    description: "We are a growing tech company.",
    verified: false,
  });

  const [jobs, setJobs] = useState([
    { id: 1, role: "Software Engineer", applicants: 12, status: "Open" },
    { id: 2, role: "Marketing Manager", applicants: 5, status: "Closed" },
  ]);

  const [posts, setPosts] = useState([
    { id: 1, author: "Namma Business", content: "We just launched a new product!", type: "general" },
    { id: 2, author: "HR Team", content: "We are hiring Software Engineers. Apply now!", type: "job" },
  ]);

  // Dialog states
  const [jobDialogVisible, setJobDialogVisible] = useState(false);
  const [postDialogVisible, setPostDialogVisible] = useState(false);

  const [newRole, setNewRole] = useState("");
  const [newPost, setNewPost] = useState("");

  const addJob = () => {
    if (!newRole) return;
    const newJob = { id: Date.now(), role: newRole, applicants: 0, status: "Open" };
    setJobs([newJob, ...jobs]);
    setNewRole("");
    setJobDialogVisible(false);
  };

  const addPost = () => {
    if (!newPost) return;
    const newPostObj = { id: Date.now(), author: company.name, content: newPost, type: "general" };
    setPosts([newPostObj, ...posts]);
    setNewPost("");
    setPostDialogVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "jobs" && styles.activeTab]}
          onPress={() => setActiveTab("jobs")}
        >
          <Text style={styles.tabText}>Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "posts" && styles.activeTab]}
          onPress={() => setActiveTab("posts")}
        >
          <Text style={styles.tabText}>Posts</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Jobs Posted</Text>
            <TouchableOpacity style={styles.button} onPress={() => setJobDialogVisible(true)}>
              <Text style={styles.buttonText}>+ Add Job</Text>
            </TouchableOpacity>
            {jobs.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <Text style={styles.jobRole}>{job.role}</Text>
                <Text style={styles.jobDetail}>Applicants: {job.applicants}</Text>
                <Text style={styles.jobDetail}>Status: {job.status}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Posts Feed</Text>
            <TouchableOpacity style={styles.button} onPress={() => setPostDialogVisible(true)}>
              <Text style={styles.buttonText}>+ Add Post</Text>
            </TouchableOpacity>
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <Text style={styles.postAuthor}>{post.author}</Text>
                <Text style={styles.postContent}>{post.content}</Text>
                <Text style={styles.postTag}>
                  {post.type === "job" ? "💼 Job Post" : "📢 General Post"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Company Info at bottom */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Company Info</Text>
          <Text style={styles.detail}>Name: {company.name}</Text>
          <Text style={styles.detail}>Address: {company.address}</Text>
          <Text style={styles.detail}>Description: {company.description}</Text>
          <Text style={styles.detail}>
            Verification: {company.verified ? "✅ Verified" : "❌ Not Verified"}
          </Text>
        </View>
      </ScrollView>

      <FooterNav />

      {/* Job Dialog */}
      <Modal visible={jobDialogVisible} transparent animationType="slide">
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>Add New Job</Text>
            <TextInput
              style={styles.input}
              placeholder="Job Role"
              value={newRole}
              onChangeText={setNewRole}
            />
            <TouchableOpacity style={styles.button} onPress={addJob}>
              <Text style={styles.buttonText}>Save Job</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => setJobDialogVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Post Dialog */}
      <Modal visible={postDialogVisible} transparent animationType="slide">
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>Add New Post</Text>
            <TextInput
              style={styles.input}
              placeholder="Write your post..."
              value={newPost}
              onChangeText={setNewPost}
            />
            <TouchableOpacity style={styles.button} onPress={addPost}>
              <Text style={styles.buttonText}>Publish Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => setPostDialogVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: { padding: 16 },
  tabBar: { flexDirection: "row", backgroundColor: "#eee" },
  tabButton: { flex: 1, padding: 12, alignItems: "center" },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "#006d3a" },
  tabText: { fontSize: 16, fontWeight: "600", color: "#006d3a" },
  card: { backgroundColor: "#fff", borderRadius: 8, padding: 16, marginBottom: 16, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#006d3a", marginBottom: 8 },
  detail: { fontSize: 14, color: "#555", marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 8, marginTop: 8, backgroundColor: "#fff" },
  button: { backgroundColor: "#006d3a", borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12, marginTop: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  cancel: { backgroundColor: "#cc0000" },
  jobCard: { marginTop: 10, padding: 10, backgroundColor: "#f1f1f1", borderRadius: 6 },
  jobRole: { fontSize: 16, fontWeight: "600", color: "#006d3a" },
  jobDetail: { fontSize: 14, color: "#555" },
  postCard: { marginTop: 10, padding: 12, backgroundColor: "#fafafa", borderRadius: 6 },
  postAuthor: { fontSize: 14, fontWeight: "bold", color: "#006d3a" },
  postContent: { fontSize: 14, color: "#333", marginTop: 4 },
  postTag: { fontSize: 12, color: "#777", marginTop: 6, fontStyle: "italic"},
    dialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 4,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006d3a",
    marginBottom: 12,
    textAlign: "center",
  },
});




