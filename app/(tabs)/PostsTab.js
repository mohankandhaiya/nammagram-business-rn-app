import React, { useState, useEffect,useRef } from "react";
import {View,Text,StyleSheet,TouchableOpacity,TextInput,Image,Modal,FlatList,RefreshControl,Share
} from "react-native";
import {collection,onSnapshot,query,orderBy,updateDoc,doc,deleteDoc,addDoc,arrayUnion,serverTimestamp,setDoc,increment
} from "firebase/firestore";
import { toggleSavePost } from "../helpers/toggleSavePost";
// import { Share } from "react-native";
import { getAuth } from "firebase/auth";
import { db} from "../helpers/firebaseConfig";
import { uploadToCloudinary } from "../helpers/cloudinaryUpload";
import * as ImagePicker from "expo-image-picker";
import { Animated,showHeart } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
export default function PostsTab({ company, postDialogVisible, setPostDialogVisible }) {
  const [newCaption, setNewCaption] = useState("");
   const [posts, setPosts] = useState([]);
  const [newImageUri, setNewImageUri] = useState(null);


  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const [commentDialogVisible, setCommentDialogVisible] = useState(false);
  const [commentPostId, setCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
 

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });
    return () => unsubscribe();
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
    setTimeout(() => setRefreshing(false), 1000);
  };
const openCommentDialog = (postId) => {
    setCommentPostId(postId);
    setCommentDialogVisible(true);
  };
  const pickImage = async (setter) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
  };

  const addPost = async () => {
    if (!newCaption) return;
    let cloudinaryUrl = null;
    if (newImageUri) {
      cloudinaryUrl = await uploadToCloudinary(newImageUri);
    }
    await addDoc(collection(db, "posts"), {
      author: company.name,
      content: newCaption,
      type: "general",
      image: cloudinaryUrl,
      likes: 0,
      comments: [],
      createdAt: serverTimestamp(),
    });
    setNewCaption("");
    setNewImageUri(null);
    setPostDialogVisible(false); // 🔑 controlled by Business FAB
  };

  // const likePost = async (postId, currentLikes = 0) => {
  //   const postRef = doc(db, "posts", postId);
  //   await updateDoc(postRef, { likes: (currentLikes || 0) + 1 });
  // };
  const likePost = async (postId, currentLikes) => {
  try {
    const postRef = doc(db, "posts", postId);

    // Toggle like
    const post = posts.find((p) => p.id === postId);
    if (!post.liked) {
      await updateDoc(postRef, { likes: increment(1) });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, liked: true, likes: currentLikes + 1 } : p
        )
      );
    } else {
      await updateDoc(postRef, { likes: increment(-1) });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, liked: false, likes: currentLikes - 1 } : p
        )
      );
    }
  } catch (err) {
    console.error("Error liking post:", err);
  }
};

  
  const addComment = async () => {
    if (!commentText || !commentPostId) return;
    const postRef = doc(db, "posts", commentPostId);
    await updateDoc(postRef, {
      comments: arrayUnion({ author: company.name, text: commentText }),
    });
    setCommentText("");
  };

  const openEditDialog = (post) => {
    setEditPostId(post.id);
    setEditContent(post.content);
    setEditDialogVisible(true);
  };

  const saveEdit = async () => {
    if (!editPostId) return;
    const postRef = doc(db, "posts", editPostId);
    let cloudinaryUrl = null;
    if (newImageUri) {
      cloudinaryUrl = await uploadToCloudinary(newImageUri);
    }
    await updateDoc(postRef, {
      content: editContent,
      ...(cloudinaryUrl && { image: cloudinaryUrl }),
    });
    setEditDialogVisible(false);
    setEditPostId(null);
    setEditContent("");
    setNewImageUri(null);
  };

  const deletePost = async (postId) => {
    await deleteDoc(doc(db, "posts", postId));
  };
const handleDoubleTap = () => {
  const now = Date.now();
  if (lastTap && (now - lastTap) < 300) {
    onLike();
    setShowHeart(true);
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => setShowHeart(false), 600);
    });
  }
  lastTap = now;
};
const handleSavePost = async (post) => {
  const postRef = doc(db, "users", TEST_USER_ID, "savedPosts", post.id);

  try {
    if (!post.saved) {
      await setDoc(postRef, {
        author: post.author,
        content: post.content,
        image: post.image || null,
        createdAt: post.createdAt,
        savedAt: new Date().toISOString(),
      });
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, saved: true } : p))
      );
    } else {
      await deleteDoc(postRef);
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, saved: false } : p))
      );
    }
  } catch (error) {
    console.error("Error saving post:", error);
  }
};
const handleSharePost = async (post) => {
  try {
    const shareMessage = `${post.author} shared a post:\n\n${post.content}${
      post.image ? `\n\nImage: ${post.image}` : ""
    }`;

    const result = await Share.share({
      message: shareMessage,
      title: "Share Post",
    });

    if (result.action === Share.sharedAction) {
      console.log("Post shared successfully");
      // ✅ Optionally update Firestore share count
      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, { shares: increment(1) });

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, shares: (p.shares || 0) + 1 } : p
        )
      );
    } else if (result.action === Share.dismissedAction) {
      console.log("Share dismissed");
    }
  } catch (error) {
    console.error("Error sharing post:", error);
  }
};

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={() => likePost(item.id, item.likes)}
            onComment={() => openCommentDialog(item.id)}
            onEdit={() => openEditDialog(item)}
            onDelete={() => deletePost(item.id)}
            onSave={() => handleSavePost(item)} 
             onShare={() => handleSharePost(item)}
          />
        )}
        // ListHeaderComponent={<Text style={styles.cardTitle}>Posts Feed</Text>}
        // ListFooterComponent={<View style={{ height: 80 }} />}
         nestedScrollEnabled
      />
    {/* Add Post Dialog */}
{/* Add Post Dialog */}
<Modal visible={postDialogVisible} transparent animationType="slide">
  <View style={styles.dialogOverlay}>
    <View style={styles.dialogBox}>
      <Text style={styles.dialogTitle}>Add New Post</Text>

      {/* Upload image icon centered with box */}
      <View style={styles.uploadBox}>
        <TouchableOpacity onPress={() => pickImage(setNewImageUri)}>
          <Icon name="image-plus" size={40} color="#006d3a" />
          <Text style={styles.iconText}>Upload Image</Text>
        </TouchableOpacity>
      </View>

      {newImageUri && (
        <Image source={{ uri: newImageUri }} style={styles.previewImage} />
      )}

      {/* Caption box centered */}
      <TextInput
        style={[styles.input, styles.captionBox]}
        placeholder="Write a caption..."
        value={newCaption}
        onChangeText={setNewCaption}
        multiline
      />

      {/* Bottom-right icons */}
       <View style={styles.bottomRightRow}>
        <TouchableOpacity onPress={() => setPostDialogVisible(false)} style={styles.iconButton}>
          <Icon name="close-circle" size={32} color="#cc0000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={addPost} style={styles.iconButton}>
          <Icon name="send" size={32} color="#006d3a" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


  {/* Edit Post Dialog */}
<Modal visible={editDialogVisible} transparent animationType="slide">
  <View style={styles.dialogOverlay}>
    <View style={styles.dialogBox}>
      <Text style={styles.dialogTitle}>Edit Post</Text>

      {/* Upload image icon centered with box */}
      <View style={styles.uploadBox}>
        <TouchableOpacity onPress={() => pickImage(setNewImageUri)}>
          <Icon name="image-edit" size={40} color="#006d3a" />
          <Text style={styles.iconText}>Replace Image</Text>
        </TouchableOpacity>
      </View>

      {/* Show preview if new image picked */}
      {newImageUri && (
        <Image source={{ uri: newImageUri }} style={styles.previewImage} />
      )}

      {/* Caption box centered */}
      <TextInput
        style={[styles.input, styles.captionBox]}
        value={editContent}
        onChangeText={setEditContent}
        multiline
      />

      {/* Bottom-right icons */}
      <View style={styles.bottomRightRow}>
        <TouchableOpacity onPress={() => setEditDialogVisible(false)} style={styles.iconButton}>
          <Icon name="close-circle" size={32} color="#cc0000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={saveEdit} style={styles.iconButton}>
          <Icon name="content-save" size={32} color="#006d3a" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


      {/* Comment Dialog */}
     {/* Comment Dialog */}
<Modal visible={commentDialogVisible} transparent animationType="slide">
  <View style={styles.overlay}>
    <View style={styles.commentModal}>
      {/* Header */}
      <Text style={styles.dialogTitle}>Comments</Text>

      {/* Add new comment */}
      <TextInput
        style={styles.input}
        placeholder="Add a comment..."
        value={commentText}
        onChangeText={setCommentText}
      />

      {/* Existing comments */}
      <FlatList
        data={posts.find((p) => p.id === commentPostId)?.comments || []}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <Text style={styles.commentText}>
            <Text style={{ fontWeight: "bold" }}>{item.author}: </Text>
            {item.text}
          </Text>
        )}
      />

      {/* Action buttons row */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.smallBtn, styles.postBtn]} onPress={addComment}>
          <Icon name="send" size={18} color="#fff" />
          <Text style={styles.btnText}>Post</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.smallBtn, styles.closeBtn]}
          onPress={() => setCommentDialogVisible(false)}
        >
          <Icon name="close" size={18} color="#fff" />
          <Text style={styles.btnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


    </View>
  );
}

function PostCard({ post,onLike, onComment, onEdit, onDelete, onShare }) {
  // let lastTap = null;
  const lastTap = useRef(null); 
  const [showHeart, setShowHeart] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
 const TEST_USER_ID = "testUser123";
  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap && (now - lastTap) < 300) {
      onLike();
      setShowHeart(true);
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => setShowHeart(false), 600);
      });
    }
    lastTap = now;
  };

  // Format timestamp (e.g., "2h ago")
  const formatTimestamp = () => {
    if (!post.createdAt) return "";
    const now = Date.now();
    const created = post.createdAt.toMillis();
    const diffMinutes = Math.floor((now - created) / 60000);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };


// const handleSave = (post) => {
//   setPosts((prev) =>
//     prev.map((p) =>
//       p.id === post.id ? { ...p, saved: !p.saved } : p
//     )
//   );
// };

const handleLikePost = async (post) => {
  try {
    const postRef = doc(db, "posts", post.id);

    // If not liked yet → increment likes
    if (!post.liked) {
      await updateDoc(postRef, {
        likes: increment(1),
        [`likedBy.${TEST_USER_ID}`]: true,
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, liked: true, likes: (p.likes || 0) + 1 } : p
        )
      );
    } else {
      // If already liked → decrement likes
      await updateDoc(postRef, {
        likes: increment(-1),
        [`likedBy.${TEST_USER_ID}`]: false,
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, liked: false, likes: (p.likes || 0) - 1 } : p
        )
      );
    }
  } catch (error) {
    console.error("Error liking post:", error);
  }
};
  return (

<View style={styles.postCard}>
  {/* Top row: author left, edit/delete right */}
  <View style={styles.topRow}>
    <View>
      <Text style={styles.postAuthor}>{post.author}</Text>
      <Text style={styles.timestamp}>{formatTimestamp()}</Text>
    </View>
    <View style={styles.topRightIcons}>
      <TouchableOpacity onPress={onEdit}>
        <Icon name="pencil" size={20} color="#006d3a" style={styles.smallIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete}>
        <Icon name="delete" size={20} color="#cc0000" style={styles.smallIcon} />
      </TouchableOpacity>
    </View>
  </View>

  {/* Image with heart overlay */}
  {post.image && (
    <View style={{ position: "relative" }}>
      <TouchableOpacity activeOpacity={0.9} >
        <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />
      </TouchableOpacity>
      {showHeart && (
        <Animated.View
          style={[
            styles.heartOverlay,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Icon name="heart" size={80} color="red" />
        </Animated.View>
      )}
    </View>
  )}

  {/* Bottom row: likes/comments/shares left, save right */}
  <View style={styles.bottomRow}>
    <View style={styles.leftActions}>
      {/* <TouchableOpacity onPress={onLike} style={styles.actionButton}>
        <Icon name="heart-outline" size={18} color="#006d3a" />
        <Text style={styles.iconText}>{post.likes || 0}</Text>
      </TouchableOpacity> */}
     <TouchableOpacity onPress={onLike} style={styles.actionButton}>
  <Icon
    name={post.liked ? "heart" : "heart-outline"}
    size={18}
    color={post.liked ? "red" : "#006d3a"}
  />
  <Text style={styles.iconText}>{post.likes || 0}</Text>
</TouchableOpacity>

      <TouchableOpacity onPress={onComment} style={styles.actionButton}>
        <Icon name="comment-outline" size={18} color="#006d3a" />
        <Text style={styles.iconText}>{post.comments?.length || 0}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onShare} style={styles.actionButton}>
        <Icon name="share-outline" size={18} color="#006d3a" />
        <Text style={styles.iconText}>{post.shares || 0}</Text>
      </TouchableOpacity>
    </View>
   
{/* <TouchableOpacity onPress={() => handleSave(post)} style={styles.actionButton}>
  <Icon name={post.saved ? "bookmark" : "bookmark-outline"} size={20} color="#006d3a" />
</TouchableOpacity> */}
{/* <TouchableOpacity onPress={() => onSave(post)} style={styles.actionButton}>
  <Icon
    name={post.saved ? "bookmark" : "bookmark-outline"}
    size={20}
    color="#006d3a"
  />
</TouchableOpacity> */}

  </View>
  {/* Caption after actions */}
  <Text style={styles.postContent}>{post.content}</Text>
</View>

  );
}
const styles = StyleSheet.create({
    postAuthor: {
  fontSize: 14,
  fontWeight: "bold",
  color: "#006d3a",
},
  postCard: { marginTop: 10, padding: 12, backgroundColor: "rgba(250, 250, 250, 0.54)", borderRadius: 6 },
  postAuthor: { fontSize: 14, fontWeight: "bold", color: "#006d3a" },
  postImage: { width: "100%", height: 400, borderRadius: 6, marginVertical: 8 },
  postContent: { fontSize: 14, color: "#333", marginTop: 4 },
  iconsRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 8 },
  icon: { fontSize: 22 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#006d3a", margin: 12 },
iconButton: {flexDirection: "row",alignItems: "center",marginVertical: 8},
  dialogOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center",},
  dialogBox: {width: "85%",backgroundColor: "#fff",borderRadius: 8,padding: 20,},
  dialogTitle: {fontSize: 18,fontWeight: "bold",color: "#006d3a",marginBottom: 12,textAlign: "center",
  },
  input: {borderWidth: 1,borderColor: "#ccc",borderRadius: 6,padding: 8,marginBottom: 8,},
  button: {backgroundColor: "#006d3a", borderRadius: 6, paddingVertical: 8, alignItems: "center", marginTop: 8,},
  buttonText: { color: "#fff", fontWeight: "bold" },
  cancel: { backgroundColor: "#cc0000" },
  previewImage: {width: "100%", height: 400,borderRadius: 6,marginVertical: 10,},
  fab: {position: "absolute",bottom: 20,right: 20,backgroundColor: "#006d3a",width: 56,height: 56,borderRadius: 28,justifyContent: "center",alignItems: "center",elevation: 4,},
  fabText: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#006d3a", margin: 12 },
  commentText: { fontSize: 13, color: "#444", marginTop: 4 },
heartOverlay: { position: "absolute", top: "40%", left: "40%", fontSize: 80, opacity: 0.8,},
timestamp: {fontSize: 12,color: "#777",},
topRightIcons: {flexDirection: "row",justifyContent: "flex-end",marginBottom: 4,},
smallIcon: {fontSize: 18,marginHorizontal: 4,},
bottomRow: {flexDirection: "row",justifyContent: "space-between",alignItems: "center",marginTop: 8,},
leftActions: {flexDirection: "row",alignItems: "center",},
topRow: {flexDirection: "row",justifyContent: "space-between",alignItems: "center",marginBottom: 4,},
icon: {fontSize: 16,marginRight: 12,},
actionButton: {flexDirection: "row",alignItems: "center",marginRight: 12,},
iconText: {marginLeft: 2,fontSize: 14,color: "#333"},
uploadBox: {
  width: 200,       // box width in px
  height: 120,      // box height in px
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center", // center horizontally
  marginVertical: 12,
},

captionBox: {
  height: 80,
  textAlignVertical: "top",
  marginVertical: 12,
},

bottomRightRow: {
  flexDirection: "row",
  justifyContent: "flex-end", // push icons to right
  // marginTop: 20,
  marginTop: 16,
  actionBtn: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 6,
  marginHorizontal: 6,
},
closeBtn: {
  backgroundColor: "#cc0000",
},
sendBtn: {
  backgroundColor: "#006d3a",
},
btnText: {
  color: "#fff",
  fontWeight: "bold",
  marginLeft: 6,
},
},
overlay: {
  flex: 1,
  justifyContent: "flex-end",
  backgroundColor: "rgba(0,0,0,0.3)",
},
commentModal: {
  width: "100%",
  height: "50%", // ✅ half screen height
  backgroundColor: "#fff",
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  padding: 16,
},
dialogTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#006d3a",
  marginBottom: 12,
},
input: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  padding: 8,
  marginBottom: 12,
},
commentText: {
  fontSize: 14,
  color: "#333",
  marginBottom: 6,
},
actionRow: {
  flexDirection: "row",
  justifyContent: "flex-end", // ✅ right side corner
  marginTop: 10,
},
smallBtn: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 6,   // ✅ smaller height
  paddingHorizontal: 10,
  borderRadius: 6,
  marginLeft: 8,
},
postBtn: { backgroundColor: "#006d3a" },
closeBtn: { backgroundColor: "#cc0000" },
btnText: {
  color: "#fff",
  fontWeight: "600",
  marginLeft: 4,
  fontSize: 13,
},

});







