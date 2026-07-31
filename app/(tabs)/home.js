import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, ImageBackground, Image, TouchableOpacity } from "react-native";
import { Avatar, } from "react-native-paper";
import { Share } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // ✅ MaterialDesignIcons
import Header from "../../app/components/Header";
import FooterNav from "../../app/components/FooterNav";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, arrayUnion, serverTimestamp,deleteDoc,setDoc,getDocs} from "firebase/firestore";
import { db } from "../../app/helpers/firebaseConfig";
import JobDetailModal from "../components/JobDetailModal";
import { toggleSavePost } from "../../app/helpers/toggleHomePost";
import { toggleLikePost } from "../../app/helpers/toggleLikePost";
import AddSection from "../components/AddSection";
import { sharePost } from "../../app/helpers/sharePost";
import QuickAccess from "../components/QuickAccess";
export default function HomeScreen(navigation) {
  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
const[modalVisible,setModalVisible] = useState([]);
const[selectedJob,setSelectedJob] = useState([]);
const TEST_USER_ID = "testUser123";
const ads = [
  {
    image: "https://copilot.microsoft.com/th/id/BCO.abe40cde-0962-4d10-a875-0560901d162d.png",
  },
  {
    image: "https://copilot.microsoft.com/th/id/BCO.20cfddb4-1bf8-4e02-bc8b-1b42ecf8aa99.png",
  },
  {
    image: "https://copilot.microsoft.com/th/id/BCO.62a39411-2577-4f97-8309-7294003575ab.png",
  },
];


  useEffect(() => {
    // 🔥 Listen to posts
    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });

    // 🔥 Listen to jobs
  //   const jobsQuery = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
  //   const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
  //     const fetchedJobs = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setJobs(fetchedJobs);
  //   });

  //   return () => {
  //     unsubscribePosts();
  //     unsubscribeJobs();
  //   };
  // }, []);
  
  const jobsQuery = query(collection(db, "jobs"), orderBy("posted", "desc"));
  const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
    const fetchedJobs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Jobs fetched:", fetchedJobs); // 🔎 debug
    setJobs(fetchedJobs);
  });

  return () => unsubscribeJobs();
}, []);
useEffect(() => {
  const fetchLikedPosts = async () => {
    try {
      const likedSnapshot = await getDocs(
        collection(db, "users", TEST_USER_ID, "likedPosts")
      );
      const likedIds = likedSnapshot.docs.map((doc) => doc.id);

      // merge liked state into posts
      setPosts((prev) =>
        prev.map((p) =>
          likedIds.includes(p.id) ? { ...p, liked: true } : { ...p, liked: false }
        )
      );
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    }
  };

  fetchLikedPosts();
}, []);

  // 🔧 Firestore interaction handlers
  // const handleLike = async (postId, currentLikes) => {
  //   const postRef = doc(db, "posts", postId);
  //   await updateDoc(postRef, { likes: currentLikes + 1 });
  // };

  const handleComment = async (postId) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { comments: arrayUnion("New comment") }); // placeholder
  };

  // const handleShare = async (postId, currentShares) => {
  //   const postRef = doc(db, "posts", postId);
  //   await updateDoc(postRef, { shares: currentShares + 1 });
  // };
//   const handleShare = async (post) => {
//   const shared = await sharePost(post);
//   if (shared) {
//     setPosts((prev) =>
//       prev.map((p) =>
//         p.id === post.id
//           ? { ...p, shares: (p.shares || 0) + 1 }
//           : p
//       )
//     );
//   }
// };
const handleSave = async (post) => {
  const saved = await toggleSavePost(post);
  setPosts((prev) =>
    prev.map((p) => (p.id === post.id ? { ...p, saved } : p))
  );
};

const handleLike = async (post) => {
  const liked = await toggleLikePost(post);
  setPosts((prev) =>
    prev.map((p) =>
      p.id === post.id
        ? { ...p, liked, likes: liked ? (p.likes || 0) + 1 : (p.likes || 0) - 1 }
        : p
    )
  );
};

const handleShare = async (post) => {
  try {
    const result = await Share.share({
      message: `${post.author} shared a post:\n\n${post.content}\n\nCheck it out!`,
      url: post.image || undefined, // optional image link
      title: "Share Post",
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log("Shared with activity type:", result.activityType);
      } else {
        console.log("Post shared successfully");
        // ✅ Update Firestore share count
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? { ...p, shares: (p.shares || 0) + 1 }
              : p
          )
        );
      }
    } else if (result.action === Share.dismissedAction) {
      console.log("Share dismissed");
    }
  } catch (error) {
    console.error("Error sharing post:", error);
  }
};


const handleSaveJob = async (job) => {
  const jobRef = doc(db, "users", TEST_USER_ID, "savedJobs", job.id);

  try {
    if (!job.saved) {
      await setDoc(jobRef, { ...job, savedAt: new Date().toISOString() });
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, saved: true } : j))
      );
    } else {
      await deleteDoc(jobRef);
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, saved: false } : j))
      );
    }
  } catch (error) {
    console.error("Error saving job:", error);
  }
};
  return (
    
    <ImageBackground
      source={require("../../app/assets/home_bg.png")}
      style={styles.background}
    >
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
         {/* Add Section at the top */}
      <AddSection ads={ads} />
      <QuickAccess navigation={navigation} />

        {/* Feed Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Feed</Text> 
             {/* <Text style={styles.link}>See All &gt;</Text>  */}
          </View>

         {posts.map((post) => (
  <View key={post.id} style={styles.postCard}>
    {/* Header */}
    <View style={styles.postHeader}>
      <Avatar.Icon size={40} icon="account" style={styles.icon} />
      <View style={styles.postHeaderText}>
        <Text style={styles.postUser}>{post.author}</Text>
        <Text style={styles.postTime}>
          {post.createdAt?.toDate().toLocaleString() || ""}
        </Text>
      </View>
    </View>

    {/* Content */}
    <Text style={styles.postText}>{post.content}</Text>
    {post.image && (
      <Image source={{ uri: post.image }} style={styles.postImage} />
    )}

    {/* Bottom row: left (like/comment/share), right (save) */}
    <View style={styles.bottomRow}>
      <View style={styles.leftActions}>
    <TouchableOpacity onPress={() => handleLike(post)} style={styles.actionButton}>
  <Icon
    name={post.liked ? "heart" : "heart-outline"}
    size={20}
    color={post.liked ? "#cc0000" : "#006d3a"}
  />
  <Text style={styles.stat}>{post.likes || 0}</Text>
</TouchableOpacity>



        <TouchableOpacity
          onPress={() => handleComment(post.id)}
          style={styles.actionButton}
        >
          <Icon name="comment-outline" size={20} color="#006d3a" />
          <Text style={styles.stat}>{post.comments?.length || 0}</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => handleShare(post.id, post.shares || 0)}
          style={styles.actionButton}
        >
          <Icon name="share-outline" size={20} color="#006d3a" />
          <Text style={styles.stat}>{post.shares || 0}</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity onPress={() => handleShare(post)} style={styles.actionButton}>
  <Icon name="share-outline" size={20} color="#006d3a" />
  <Text style={styles.stat}>{post.shares || 0}</Text>
</TouchableOpacity> */}
<TouchableOpacity onPress={() => handleShare(post)} style={styles.actionButton}>
  <Icon name="share-outline" size={20} color="#006d3a" />
  <Text style={styles.stat}>{post.shares || 0}</Text>
</TouchableOpacity>

      </View>

      <TouchableOpacity
        // onPress={() => toggleSavePost(post)}
        onPress={() => handleSave(post)} 
        style={styles.actionButton}
      >
        <Icon
          name={post.saved ? "bookmark" : "bookmark-outline"}
          size={22}
           color="#006d3a"
        />
      </TouchableOpacity>
    </View>
  </View>
))}


          {/* Jobs Section */}
        {/* Jobs Section */}
<View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>Jobs</Text>
  {/* <Text style={styles.link}>See All &gt;</Text> */}
</View>

{jobs.length === 0 ? (
  <Text style={{ textAlign: "center", color: "#666" }}>No jobs available</Text>
) : (
 jobs.map((job) => (
  <View key={job.id} style={styles.jobCard}>
    <View style={styles.jobContent}>
      {/* Line 1: Role */}
      <View style={styles.jobRow}>
        <Icon name="account-tie" size={18} color="#006d3a" />
        <Text style={styles.jobTitle}>{job.role}</Text>
      </View>

      {/* Line 2: Company */}
      <View style={styles.jobRow}>
        <Icon name="office-building" size={18} color="#006d3a" />
        <Text style={styles.jobDetails}>{job.company}</Text>
      </View>

      {/* Line 3: Experience + Salary */}
      <View style={styles.jobRow}>
        <View style={styles.inlineItem}>
          <Icon name="school" size={18} color="#006d3a" />
          <Text style={styles.jobDetails}>{job.experience}</Text>
        </View>
        <View style={styles.inlineItem}>
          <Icon name="currency-inr" size={18} color="#006d3a" />
          <Text style={styles.jobDetails}>{job.salary}</Text>
        </View>
      </View>

      {/* Line 4: Status + Applicants */}
      <View style={styles.jobRow}>
        <View style={styles.inlineItem}>
          <Icon
            name="check-circle"
            size={18}
            color={job.status === "Open" ? "#006d3a" : "#cc0000"}
          />
          <Text style={styles.jobDetails}>{job.status}</Text>
        </View>
        <View style={styles.inlineItem}>
          <Icon name="account-group" size={18} color="#006d3a" />
          <Text style={styles.jobDetails}>{job.applicants}</Text>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.tagContainer}>
        {job.tags?.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Icon name="tag" size={14} color="#006d3a" />
            <Text style={styles.tagText}>{tag}</Text>
          </View>
          
        ))}
      </View>
      <View style= {styles.saveButton}>
         <TouchableOpacity
          onPress={() => handleSaveJob(job)}
          style={styles.saveButton}
        >
          <Icon
            name={job.saved ? "bookmark" : "bookmark-outline"}
            size={22}
            color="#006d3a"
          />
        </TouchableOpacity>
        </View>
    </View>

   {/* View Button */}
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => {
          setSelectedJob(job);
          setModalVisible(true);
        }}
      >
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
      
  </View>


  ))
  
)}
<JobDetailModal
  visible={modalVisible}
  job={selectedJob}
  onClose={() => setModalVisible(false)}
/> 
        </View>
      </ScrollView>

      <FooterNav />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  content: { padding: 16 },

  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#006d3a",marginTop:20, },
  link: { fontSize: 14, color: "#006d3a", fontWeight: "600" },

  // Posts
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
  postImage: { width: "100%", height: 400, borderRadius: 8, marginBottom: 8 },
  postStats: { flexDirection: "row", justifyContent: "space-around", marginTop: 8 },
  stat: { fontSize: 14, color: "#333", fontWeight: "600", marginLeft: 4 },
  actionButton: { flexDirection: "row", alignItems: "center", marginRight: 12, },
bottomRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 8,
},
leftActions: {
  flexDirection: "row",
  alignItems: "center",
},
  // Jobs
jobCard: {
  flexDirection: "row",
  alignItems: "flex-start",
  backgroundColor: "#ffffff",
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
  elevation: 3,
},
jobContent: { flex: 1 },
jobText: { flex: 1 },
jobRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
jobTitle: { fontSize: 16, fontWeight: "bold", color: "#333",marginLeft: 6  },
jobDetails: { fontSize: 14, color: "#666", marginLeft: 6},
jobMeta: { fontSize: 13, color: "#444", marginVertical: 1 },
applyButton: {
  backgroundColor: "#006d3a",
  borderRadius: 6,
  paddingVertical: 6,
  paddingHorizontal: 12,
  alignSelf: "center",
},
applyButtonText: { color: "#fff", fontWeight: "bold" },

// Tags
tagContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 6, },
tag: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#e6f2e6",
  borderRadius: 12,
  paddingHorizontal: 8,
  paddingVertical: 4,
  marginRight: 6,
  marginBottom: 6,
},
tagText: { fontSize: 12, color: "#006d3a", fontWeight: "600", marginLeft: 4 },
inlineItem: { flexDirection: "row", alignItems: "center", marginRight: 12 },
viewButton: {
  backgroundColor: "#006d3a",
  borderRadius: 6,
  paddingVertical: 5,
  paddingHorizontal: 12,
  // alignSelf: "center",
},
viewButtonText: { color: "#fff", fontWeight: "bold" },
saveButton: {
  //  padding: 2,
  //  marginBottom:5,
    flexDirection: "row",
     marginRight: 19,
    // justifyContent: "flex-end"
},
});








