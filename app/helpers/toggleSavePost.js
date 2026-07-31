// helpers/toggleSavePost.js
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../helpers/firebaseConfig";

export const toggleSavePost = async (post) => {
  const testUserId = "testUser123"; // 🔑 example user ID for testing
  const postRef = doc(db, "users", testUserId, "savedPosts", post.id);

  if (!post.saved) {
    await setDoc(postRef, { ...post, savedAt: new Date().toISOString() });
    return true; // means saved
  } else {
    await deleteDoc(postRef);
    return false; // means unsaved
  }
};



