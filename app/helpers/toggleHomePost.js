// helpers/toggleSavePost.js
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../helpers/firebaseConfig";

const TEST_USER_ID = "testUser123";

export const toggleSavePost = async (post) => {
  const postRef = doc(db, "users", TEST_USER_ID, "savedPosts", post.id);

  try {
    if (!post.saved) {
      // ✅ Save post
      await setDoc(postRef, {
        author: post.author,
        content: post.content,
        image: post.image || null,
        createdAt: post.createdAt,
        savedAt: new Date().toISOString(),
      });
      post.saved = true;
    } else {
      // ❌ Remove post
      await deleteDoc(postRef);
      post.saved = false;
    }
  } catch (error) {
    console.error("Error saving post:", error);
  }

  return post.saved;
};
