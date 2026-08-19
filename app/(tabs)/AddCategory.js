// app/business/AddCategory.js
import React, { useState,useEffect } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useRouter, useLocalSearchParams  } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function AddCategory() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState(["RO Water", "Electronics", "Groceries"]);
  const [selectedCategories, setSelectedCategories] = useState([]); // array now
  const [newCategory, setNewCategory] = useState("");
 
  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCategory = (item) => {
    if (selectedCategories.includes(item)) {
      setSelectedCategories(selectedCategories.filter(c => c !== item));
    } else {
      setSelectedCategories([...selectedCategories, item]);
    }
  };

  const handleApply = () => {
    if (selectedCategories.length > 0) {
      router.push({
        pathname: "/business/AddItem",
        params: { categories: JSON.stringify(selectedCategories) }, 
        // pass as JSON string so AddItem can parse back into array
      });
    } else {
      router.back();
    }
  };

  const handleSaveNewCategory = () => {
    if (newCategory.trim()) {
      const created = newCategory.trim();
      setCategories([...categories, created]);
      setNewCategory("");
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Sticky Header fills safe area */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Select Category</Text>
      </View>

      {/* FlatList as main scroll container */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          // <TouchableOpacity
          //   style={styles.categoryRow}
          //   onPress={() => toggleCategory(item)}
          // >
          //   <Text style={styles.categoryText}>{item}</Text>
          //   {selectedCategories.includes(item) && (
          //     <Icon name="check" size={20} color="#006d3a" />
          //   )}
          // </TouchableOpacity>
          <TouchableOpacity
  style={styles.categoryRow}
  onPress={() => toggleCategory(item)}
>
  <Text style={styles.categoryText}>{item}</Text>
  {selectedCategories.includes(item) && (
    <Text style={styles.tickSymbol}>✔</Text>  
  )}
</TouchableOpacity>

        )}
        ListHeaderComponent={
          <View style={styles.container}>
            {/* Search Bar */}
            <TextInput
              placeholder="Search Category"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />

            {/* Add New Category Form */}
            <Text style={styles.subHeader}>Add New Category</Text>
            <TextInput
              placeholder="Enter Category Name"
              value={newCategory}
              onChangeText={setNewCategory}
              style={styles.input}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveNewCategory}>
              <Text style={styles.saveText}>Save Category</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Sticky Apply Button full-width */}
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
  categoryText: { fontSize: 14, color: "#333" },

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
  tickSymbol: {
  fontSize: 18,
  color: "#006d3a",
  fontWeight: "bold",
},

});


