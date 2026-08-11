import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";
import Header from "../../app/components/Header";
import FooterNav from "../../app/components/FooterNav";
import JobsTab from "./JobsTab";
import PostsTab from "./PostsTab";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AddItem from "./AddItem";
import ProductList from "./ProductList";

export default function Business() {
  const [activeTab, setActiveTab] = useState("product");
  const [productDialogVisible, setProductDialogVisible] = useState(false);

  const [company] = useState({
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

  // Dialog state for Jobs and Posts
  const [jobDialogVisible, setJobDialogVisible] = useState(false);
  const [postDialogVisible, setPostDialogVisible] = useState(false);

  // Handle FAB click
  const handleFabClick = () => {
    if (activeTab === "jobs") {
      setJobDialogVisible(true);
    } else if (activeTab === "posts") {
      setPostDialogVisible(true);
    } else if (activeTab === "product") {
      setProductDialogVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "product" && styles.activeTab]}
          onPress={() => setActiveTab("product")}
        >
          <Text style={styles.tabText}>Product</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "posts" && styles.activeTab]}
          onPress={() => setActiveTab("posts")}
        >
          <Text style={styles.tabText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "jobs" && styles.activeTab]}
          onPress={() => setActiveTab("jobs")}
        >
          <Text style={styles.tabText}>Jobs</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.content}>
        {activeTab === "product" && <ProductList />}
        {activeTab === "posts" && (
          <PostsTab
            posts={posts}
            setPosts={setPosts}
            company={company}
            postDialogVisible={postDialogVisible}
            setPostDialogVisible={setPostDialogVisible}
          />
        )}
        {activeTab === "jobs" && (
          <JobsTab
            jobs={jobs}
            setJobs={setJobs}
            jobDialogVisible={jobDialogVisible}
            setJobDialogVisible={setJobDialogVisible}
          />
        )}
      </View>

      {/* FAB for all tabs */}
      {(activeTab === "product" || activeTab === "jobs" || activeTab === "posts") && (
        <TouchableOpacity style={styles.fab} onPress={handleFabClick}>
          <Icon name="plus-circle" size={36} color="#eee" />
        </TouchableOpacity>
      )}

      {/* Product AddItem Modal */}
      <Modal visible={productDialogVisible} animationType="slide">
        <AddItem />
      </Modal>

      <FooterNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: { flex: 1, padding: 16 },
  tabBar: { flexDirection: "row", backgroundColor: "#eee" },
  tabButton: { flex: 1, padding: 12, alignItems: "center" },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "#006d3a" },
  tabText: { fontSize: 16, fontWeight: "600", color: "#006d3a" },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#006d3a",
    width: 60,
    height: 60,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    zIndex: 10,
  },
});










