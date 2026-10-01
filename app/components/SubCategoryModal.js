import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Modal,Alert, } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { db } from "../helpers/firebaseConfig";
import { collection, getDocs, addDoc,deleteDoc,
doc, } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
export default function SubCategoryModal({ visible, onClose, onSelect }) {
  const [subCategories, setSubCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [imageUri, setImageUri] = useState(null);

  // Fetch all subcategories
  useEffect(() => {
    const fetchSubCategories = async () => {
      const snapshot = await getDocs(collection(db, "subcategories"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSubCategories(data);
    };
    fetchSubCategories();
  }, []);

  const filteredSubCategories = subCategories.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase())
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

  const handleSaveNewSubCategory = async () => {
    if (newSubCategory.trim()) {
      try {
        const docRef = await addDoc(collection(db, "subcategories"), {
          name: newSubCategory.trim(),
          image: imageUri, // ✅ just store local URI
          createdAt: new Date().toISOString(),
        });

        setSubCategories([
          ...subCategories,
          { id: docRef.id, name: newSubCategory.trim(), image: imageUri },
        ]);

        setNewSubCategory("");
        setImageUri(null);
      } catch (error) {
        console.error("Error saving subcategory:", error);
      }
    }
  };
const handleDeleteSubCategory = async (subCategoryId) => {
  try {
    await deleteDoc(doc(db, "subcategories", subCategoryId));

    setSubCategories((prev) =>
      prev.filter((item) => item.id !== subCategoryId)
    );

    console.log("Subcategory deleted successfully");
  } catch (error) {
    console.error("Error deleting subcategory:", error);
  }
};
const confirmDelete = (id, name) => {
  Alert.alert(
    "Delete Subcategory",
    `Are you sure you want to delete "${name}"?`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDeleteSubCategory(id),
      },
    ]
  );
};
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Manage Subcategories</Text>

        {/* Add New Subcategory */}
        <Text style={styles.subHeader}>Add New Subcategory</Text>
        <TextInput
          placeholder="Enter Subcategory Name"
          value={newSubCategory}
          onChangeText={setNewSubCategory}
          style={styles.input}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={pickImage}>
          <Text style={styles.saveText}>{imageUri ? "Change Image" : "Upload Image"}</Text>
        </TouchableOpacity>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveNewSubCategory}>
          <Text style={styles.saveText}>Save Subcategory</Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <TextInput
          placeholder="Search Subcategory"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {/* Subcategory List */}
        <FlatList
          data={filteredSubCategories}
          keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
  <View style={styles.categoryRow}>
    <TouchableOpacity
      style={styles.subCategoryInfo}
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

      <Text style={styles.categoryText}>
        {item.name}
      </Text>
    </TouchableOpacity>

    {/* <TouchableOpacity
      style={styles.deleteBtn}
      onPress={() => confirmDelete(item.id, item.name)}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity> */}
    <TouchableOpacity
  onPress={() => confirmDelete(item.id, item.name)}
>
  <MaterialIcons
    name="delete"
    size={24}
    color="#cc0000"
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
  subCategoryInfo: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
},

deleteBtn: {
  backgroundColor: "#cc0000",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 6,
},

deleteText: {
  color: "#fff",
  fontWeight: "600",
},
});



