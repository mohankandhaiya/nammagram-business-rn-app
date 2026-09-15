import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { db } from "../../app/helpers/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { uploadImageToCloudinary } from "../../app/helpers/cloudinaryHelper";

export default function AddSubCategory() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [imageUri, setImageUri] = useState(null);

  // ✅ Fetch subcategories from Firebase
  useEffect(() => {
    const fetchSubCategories = async () => {
      const snapshot = await getDocs(collection(db, "subcategories"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubCategories(data);
    };
    fetchSubCategories();
  }, []);

  const filteredSubCategories = subCategories.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSaveNewSubCategory = async () => {
    if (newSubCategory.trim()) {
      let uploadedUrl = null;
      if (imageUri) {
        uploadedUrl = await uploadImageToCloudinary(imageUri);
      }
      await addDoc(collection(db, "subcategories"), {
        name: newSubCategory.trim(),
        image: uploadedUrl,
        createdAt: new Date().toISOString(),
      });
      setSubCategories([...subCategories, { name: newSubCategory.trim(), image: uploadedUrl }]);
      setNewSubCategory("");
      setImageUri(null);
    }
  };

  const handleApply = () => {
    if (selectedSubCategory) {
      router.push({
        pathname: "/business/AddItem",
        params: { subcategory: selectedSubCategory },
      });
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Select Subcategory</Text>
      </View>


      <FlatList
        data={filteredSubCategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryRow}
            onPress={() => setSelectedSubCategory(item.name)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.iconImage} />
              )}
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
            {selectedSubCategory === item.name && <Text style={styles.tickSymbol}>✔</Text>}
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <View style={styles.container}>
              {/* Search Bar */}
      <TextInput
        placeholder="Search Subcategory"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />
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
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={styles.stickyButtonRow}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#006d3a",
    paddingVertical: 35,
    paddingHorizontal: 15,
  },
  backButton: { marginRight: 10 },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  container: { backgroundColor: "#fff", padding: 15 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#006d3a",
    marginTop: 10,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  saveBtn: {
    backgroundColor: "#006d3a",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  saveText: { color: "#fff", fontWeight: "bold" },
  preview: { width: 100, height: 100, marginVertical: 8, borderRadius: 8 },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  categoryText: { fontSize: 14, color: "#333", marginLeft: 8 },
  tickSymbol: { fontSize: 18, color: "#006d3a", fontWeight: "bold" },
  stickyButtonRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
  applyButton: {
    backgroundColor: "#cc0000",
    paddingVertical: 25,
    alignItems: "center",
    width: "100%",
    borderRadius: 0,
  },
  applyText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  iconImage: { width: 40, height: 40, borderRadius: 6 },
});



