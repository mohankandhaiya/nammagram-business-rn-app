import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, ImageBackground, Image, TextInput, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";
import Header from "../../app/components/Header";
import FooterNav from "../../app/components/FooterNav";

export default function HomeScreen() {
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "InnovateTech Solutions",
      time: "2 hours ago • Bangalore",
      text: "Exciting new product launch! Check out our latest innovation in AI technology!",
      image: require("../../app/assets/post1.jpg"),
      likes: 250,
      comments: 45,
      shares: 12,
    },
  ]);

  const handleAddPost = () => {
    if (postText.trim() === "") return;
    const newPost = {
      id: Date.now(),
      user: "You",
      time: "Just now",
      text: postText,
      image: null, // no image for text-only posts
      likes: 0,
      comments: 0,
      shares: 0,
    };
    setPosts([newPost, ...posts]); // add new post at top
    setPostText(""); // clear input
  };

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
        {/* <Text style={styles.appName}>Nammagram</Text> */}

        {/* Create Post Area */}
        {/* <View style={styles.createPost}>
          <View style={styles.createHeader}>
            <Avatar.Icon size={40} icon="account" style={styles.icon} />
            <Text style={styles.createPrompt}>Share a photo or write a post</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="What's on your mind?"
            placeholderTextColor="#666"
            value={postText}
            onChangeText={setPostText}
          />
          <View style={styles.createActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Avatar.Icon size={24} icon="image" style={styles.actionIcon} />
              <Text style={styles.actionText}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddPost}>
              <Avatar.Icon size={24} icon="pencil" style={styles.actionIcon} />
              <Text style={styles.actionText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Feed Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Feed</Text>
            <Text style={styles.link}>See All &gt;</Text>
          </View>

          {posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <Avatar.Icon size={40} icon="account" style={styles.icon} />
                <View style={styles.postHeaderText}>
                  <Text style={styles.postUser}>{post.user}</Text>
                  <Text style={styles.postTime}>{post.time}</Text>
                </View>
              </View>
              <Text style={styles.postText}>{post.text}</Text>
              {post.image && <Image source={post.image} style={styles.postImage} />}
              <View style={styles.postStats}>
                <Text style={styles.stat}>❤️ {post.likes} Likes</Text>
                <Text style={styles.stat}>💬 {post.comments} Comments</Text>
                <Text style={styles.stat}>🔁 {post.shares} Shares</Text>
              </View>
            </View>
          ))}

          {/* Job Banner */}
          <View style={styles.jobBanner}>
            <Text style={styles.jobBannerTitle}>Hiring Now!</Text>
            <Text style={styles.jobBannerText}>Software Engineer • Bangalore</Text>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>
          </View>

          {/* Sponsored Ad */}
          <View style={styles.adCard}>
            <Image source={require("../../app/assets/ad1.jpg")} style={styles.adImage} />
            <Text style={styles.adText}>Boost Your Business with Sustainable Packaging!</Text>
            <TouchableOpacity style={styles.learnButton}>
              <Text style={styles.learnButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>

          {/* Upcoming Event */}
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>Upcoming Event</Text>
            <Text style={styles.eventDetails}>
              Business Networking Meet • Friday, Jan 28 • 5:00 PM - 8:00 PM • MG Road, Bangalore
            </Text>
            <TouchableOpacity style={styles.rsvpButton}>
              <Text style={styles.rsvpButtonText}>RSVP</Text>
            </TouchableOpacity>
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
    color: "#ff6600",
    marginBottom: 20,
  },

  // Create Post
  createPost: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    elevation: 3,
  },
  createHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  createPrompt: { fontSize: 14, color: "#666" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    color: "#333",
  },
  createActions: { flexDirection: "row", justifyContent: "space-around" },
  actionButton: { flexDirection: "row", alignItems: "center" },
  actionIcon: { backgroundColor: "#006d3a", marginRight: 6 },
  actionText: { color: "#006d3a", fontWeight: "bold" },

  // Feed
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#006d3a" },
  link: { fontSize: 14, color: "#006d3a", fontWeight: "600" },

  postCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    elevation: 3,
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  icon: { backgroundColor: "#006d3a", marginRight: 10 },
  postHeaderText: { flex: 1 },
  postUser: { fontSize: 16, fontWeight: "bold", color: "#333" },
  postTime: { fontSize: 12, color: "#666" },
  postText: { fontSize: 14, color: "#333", marginBottom: 8 },
  postImage: { width: "100%", height: 180, borderRadius: 8, marginBottom: 8 },
  postStats: { flexDirection: "row", justifyContent: "space-between" },
  stat: { fontSize: 12, color: "#666" },

  // Job Banner
  jobBanner: {
    backgroundColor: "#e6f2e6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  jobBannerTitle: { fontSize: 18, fontWeight: "bold", color: "#006d3a" },
  jobBannerText: { fontSize: 14, color: "#333", marginVertical: 4 },
  applyButton: {
    backgroundColor: "#006d3a",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  applyButtonText: { color: "#fff", fontWeight: "bold" },

  // Ads
  adCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    alignItems: "center",
  },
  adImage: { width: "100%", height: 120 },
   adText: { padding: 8, fontSize: 14, fontWeight: "600", color: "#333" },
  learnButton: {
    backgroundColor: "#006d3a",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  learnButtonText: { color: "#fff", fontWeight: "bold" },

  // Events
  eventCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    elevation: 3,
    alignItems: "center",
  },
  eventTitle: { fontSize: 18, fontWeight: "bold", color: "#006d3a", marginBottom: 4 },
  eventDetails: { fontSize: 14, color: "#333", textAlign: "center", marginBottom: 8 },
  rsvpButton: {
    backgroundColor: "#006d3a",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  rsvpButtonText: { color: "#fff", fontWeight: "bold" },
});







