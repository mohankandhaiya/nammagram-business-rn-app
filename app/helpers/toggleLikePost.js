// helpers/toggleLikePost.js
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../helpers/firebaseConfig";

const TEST_USER_ID = "testUser123";

export const toggleLikePost = async (post) => {
  const postRef = doc(db, "users", TEST_USER_ID, "likedPosts", post.id);

  try {
    if (!post.liked) {
      // ✅ Add to likedPosts
      await setDoc(postRef, {
        ...post,
        likedAt: new Date().toISOString(),
      });
      return true;
    } else {
      // ❌ Remove from likedPosts
      await deleteDoc(postRef);
      return false;
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return post.liked; // fallback
  }
};


