// utils/formatTimestamp.js
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";

  try {
    // Firestore Timestamp object
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    // JS Date object
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    }
    // Already a string
    if (typeof timestamp === "string") {
      return timestamp;
    }
    return "Invalid date";
  } catch (err) {
    console.error("Error formatting timestamp:", err);
    return "Invalid date";
  }
};
