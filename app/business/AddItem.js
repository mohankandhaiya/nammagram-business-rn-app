import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import CategoryModal from "../components/CategoryModal";
import SubCategoryModal from "../components/SubCategoryModal";
import PricingForm from "../components/PricingForm";
import StockForm from "../components/StockForm";
import ImageUploadBox from "../components/ImageUploadBox";
import ItemDetailsForm from "../components/ItemDetailsForm";

import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../helpers/firebaseConfig";
import { uploadImageToCloudinary } from "../helpers/cloudinaryHelper";

export default function AddItem({ initialData = {} }) {
  const router = useRouter();

  // State
  const [itemName, setItemName] = useState(initialData.itemName || "");
  const [itemCode, setItemCode] = useState(initialData.itemCode || "");
  const [itemCategory, setItemCategory] = useState(initialData.itemCategory || "");
  const [itemSubCategory, setItemSubCategory] = useState(initialData.itemSubCategory || "");
  const [hsnCode, setHsnCode] = useState("");
  const [pricingData, setPricingData] = useState(initialData.pricing || {});
  const [stockData, setStockData] = useState(initialData.stock || {});
  const [images, setImages] = useState(initialData.images || []);

  // Modal visibility
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState("pricing");

  // 🔹 Inline saveItem logic (was useSaveItem hook)
  const saveItem = async () => {
    try {
      // Upload images to Cloudinary
      let imageUrls = [];
      for (const uri of images) {
        const url = await uploadImageToCloudinary(uri);
        imageUrls.push(url);
      }

      const productData = {
        itemName,
        itemCode,
        itemCategory,
        itemSubCategory,
        hsnCode,
        pricing: pricingData,
        stock: stockData,
        images: imageUrls,
        updatedAt: new Date(),
      };

      if (initialData?.id) {
        // EDIT MODE
        const productRef = doc(db, "products", initialData.id);
        await updateDoc(productRef, productData);
        return { success: true, message: "Product updated successfully!" };
      } else {
        // ADD MODE
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: new Date(),
        });
        return { success: true, message: "Product added successfully!" };
      }
    } catch (error) {
      console.error("Error saving item:", error);
      return { success: false, message: "Failed to save item." };
    }
  };

  // Save handler
  const handleSaveItem = async () => {
    const result = await saveItem();
    alert(result.message);
    if (result.success) {
      router.push("/business?tab=product");
    }
  };

  // Cancel handler
  const handleCancel = () => {
    if (initialData?.id) {
      router.push({
        pathname: "/business/ProductDetails",
        params: { product: JSON.stringify(initialData) },
      });
    } else {
      router.push("/business?tab=product");
    }
  };

  // 🔹 Inline SaveActions component
  const SaveActions = ({ onSave, onCancel }) => (
    <View style={styles.stickyButtonRow}>
      <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.save]} onPress={onSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/business?tab=product")} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Item</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Upload */}
        <ImageUploadBox images={images} setImages={setImages} />

        {/* Item Details */}
        <ItemDetailsForm
          itemName={itemName}
          setItemName={setItemName}
          itemCode={itemCode}
          setItemCode={setItemCode}
          hsnCode={hsnCode}
          setHsnCode={setHsnCode}
        />

        {/* Category Input */}
        <View style={styles.inputRow}>
          <TouchableOpacity
            style={[styles.input, styles.categoryInput]}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text style={{ color: itemCategory ? "#000" : "#999" }}>
              {itemCategory || "Item Category"}
            </Text>
            <Icon name="chevron-down" size={20} color="#666" style={styles.dropdownIcon} />
          </TouchableOpacity>
        </View>

        {/* Subcategory Input */}
        <View style={styles.inputRow}>
          <TouchableOpacity
            style={[styles.input, styles.categoryInput]}
            onPress={() => setSubCategoryModalVisible(true)}
          >
            <Text style={{ color: itemSubCategory ? "#000" : "#999" }}>
              {itemSubCategory || "Item Subcategory"}
            </Text>
            <Icon name="chevron-down" size={20} color="#666" style={styles.dropdownIcon} />
          </TouchableOpacity>
        </View>

        {/* Pricing & Stock */}
        {/* <PricingForm pricingData={pricingData} onPricingChange={setPricingData} />
        <StockForm stockData={stockData} onStockChange={setStockData} /> */}
          {/* 🔹 Tabs for Pricing & Stock */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "pricing" && styles.activeTab]}
            onPress={() => setActiveTab("pricing")}
          >
            <Text style={[styles.tabText, activeTab === "pricing" && styles.activeTabText]}>Pricing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "stock" && styles.activeTab]}
            onPress={() => setActiveTab("stock")}
          >
            <Text style={[styles.tabText, activeTab === "stock" && styles.activeTabText]}>Stock</Text>
          </TouchableOpacity>
        </View>

        {activeTab === "pricing" ? (
          <PricingForm pricingData={pricingData} onPricingChange={setPricingData} />
        ) : (
          <StockForm stockData={stockData} onStockChange={setStockData} />
        )}
      </ScrollView>

      {/* Modals */}
      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
         onSelect={(cat) => setItemCategory(cat)} 
      />
      <SubCategoryModal
        visible={subCategoryModalVisible}
        onClose={() => setSubCategoryModalVisible(false)}
        onSelect={(sub) => setItemSubCategory(sub)}
      />

      {/* Save/Cancel Actions */}
      <SaveActions onSave={handleSaveItem} onCancel={handleCancel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
   header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#006d3a", // your green theme
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
  },
  categoryInput: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dropdownIcon: { marginLeft: 8 },
    tabRow: { flexDirection: "row", marginTop: 16, marginBottom: 12 },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#006d3a",
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 4,
  },
  activeTab: { backgroundColor: "#006d3a" },
  tabText: { color: "#006d3a", fontWeight: "600" },
  activeTabText: { color: "#fff" },
  stickyButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancel: { backgroundColor: "#cc0000" },
  save: { backgroundColor: "#006d3a" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});


















