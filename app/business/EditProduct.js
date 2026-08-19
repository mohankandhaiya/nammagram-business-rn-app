// app/business/EditProduct.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AddItemForm from "./AddItem"; // reuse your existing AddItem form component

export default function EditProduct() {
  const router = useRouter();
  const { product } = useLocalSearchParams();
  const parsedProduct = product ? JSON.parse(product) : {};

  // Local state for editing
  const [formData, setFormData] = useState(parsedProduct);

  useEffect(() => {
    if (parsedProduct) {
      setFormData(parsedProduct);
    }
  }, [product]);

  const handleSave = (updatedData) => {
    // TODO: implement update logic (API call or state update)
    console.log("Updated product:", updatedData);
    router.back(); // go back after saving
  };

  return (
    <View style={styles.safeArea}>
      {/* Sticky Header */}
     

      {/* Reuse AddItem form */}
      <AddItemForm
        initialData={formData}
        onSave={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#006d3a",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
