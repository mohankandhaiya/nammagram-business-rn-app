import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Modal,Alert, } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { db } from "../helpers/firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc,
  doc, } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
export default function CategoryModal({ visible, onClose, onSelect }) {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Expo ImagePicker with MediaTypeOptions.Images
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("ImagePicker error:", error);
    }
  };

  const handleSaveNewCategory = async () => {
    if (newCategory.trim()) {
      try {
        const docRef = await addDoc(collection(db, "categories"), {
          name: newCategory.trim(),
          image: imageUri, // ✅ just store local URI
          createdAt: new Date().toISOString(),
        });

        setCategories([
          ...categories,
          { id: docRef.id, name: newCategory.trim(), image: imageUri },
        ]);

        setNewCategory("");
        setImageUri(null);
      } catch (error) {
        console.error("Error saving category:", error);
      }
    }
  };
const handleDeleteCategory = async (categoryId) => {
  try {
    await deleteDoc(doc(db, "categories", categoryId));

    setCategories((prev) =>
      prev.filter((item) => item.id !== categoryId)
    );

    console.log("Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

const confirmDelete = (categoryId, categoryName) => {
  Alert.alert(
    "Delete Category",
    `Are you sure you want to delete "${categoryName}"?`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDeleteCategory(categoryId),
      },
    ]
  );
};
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Manage Categories</Text>

        {/* Add New Category */}
        <Text style={styles.subHeader}>Add New Category</Text>
        <TextInput
          placeholder="Enter Category Name"
          value={newCategory}
          onChangeText={setNewCategory}
          style={styles.input}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={pickImage}>
          <Text style={styles.saveText}>{imageUri ? "Change Image" : "Upload Image"}</Text>
        </TouchableOpacity>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveNewCategory}>
          <Text style={styles.saveText}>Save Category</Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <TextInput
          placeholder="Search Category"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {/* Category List */}
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
  <View style={styles.categoryRow}>
    
    <TouchableOpacity
      style={styles.categoryInfo}
      onPress={() => {
        onSelect?.(item.name);
        onClose?.();
      }}
    >
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.iconImage}
        />
      )}

      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>

    {/* <TouchableOpacity
      style={styles.deleteBtn}
      onPress={() =>
        confirmDelete(item.id, item.name)
      }
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity> */}
<TouchableOpacity
  onPress={() => confirmDelete(item.id, item.name)}
>
  <MaterialIcons
    name="delete"
    size={24}
    color="red"
  />
</TouchableOpacity>
  </View>
)}
        />

        {/* Close Modal */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => onClose?.()}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: "#fff", padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  subHeader: { fontSize: 16, fontWeight: "600", color: "#006d3a", marginTop: 10, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginBottom: 12 },
  saveBtn: { backgroundColor: "#006d3a", paddingVertical: 12, borderRadius: 6, alignItems: "center", marginBottom: 12 },
  saveText: { color: "#fff", fontWeight: "bold" },
  preview: { width: 100, height: 100, marginVertical: 8, borderRadius: 8 },
  searchInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginBottom: 12 },
  categoryRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  categoryText: { fontSize: 14, color: "#333", marginLeft: 8 },
  iconImage: { width: 40, height: 40, borderRadius: 6 },
  closeBtn: { backgroundColor: "#cc0000", paddingVertical: 12, borderRadius: 6, alignItems: "center", marginTop: 20 },
  closeText: { color: "#fff", fontWeight: "700" },
  categoryInfo: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
},

deleteBtn: {
  backgroundColor: "#cc0000",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 6,
},

deleteText: {
  color: "#fff",
  fontWeight: "600",
},
});






