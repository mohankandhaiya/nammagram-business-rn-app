// helpers/sharePost.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "../helpers/firebaseConfig";

const TEST_USER_ID = "testUser123";

export const sharePost = async (post) => {
  const postRef = doc(db, "users", TEST_USER_ID, "sharedPosts", post.id);

  try {
    // ✅ Add to sharedPosts
    await setDoc(postRef, {
      ...post,
      sharedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error("Error sharing post:", error);
    return false;
  }
};
