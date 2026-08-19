// app/business/ProductDetails.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import { formatTimestamp } from "../utils/formatTimestamp";
import ProductSpecsModal from "./ProductSpecsModal";
import { db } from "../helpers/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";


export default function ProductDetails() {
  const router = useRouter();
  const { product } = useLocalSearchParams();
  const parsedProduct = product ? JSON.parse(product) : {};
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSpecs, setShowSpecs] = useState(false);
  const handleEdit = () => {
    router.push({
      pathname: "/business/EditProduct",
      params: { product: JSON.stringify(parsedProduct) },
    });
  };

  // const handleDelete = () => {
  //   Alert.alert("Delete Product", "Are you sure you want to delete this product?", [
  //     { text: "Cancel", style: "cancel" },
  //     {
  //       text: "Delete",
  //       style: "destructive",
  //       onPress: () => {
  //         // TODO: implement delete logic
  //         router.back();
  //       },
  //     },
  //   ]);
  // };
const handleDelete = async () => {
  Alert.alert("Delete Product", "Are you sure?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        try {
          const productRef = doc(db, "products", parsedProduct.id);
          await deleteDoc(productRef);
          alert("Product deleted successfully!");
          router.push("/business?tab=product");
        } catch (err) {
          console.error("Error deleting product:", err);
          alert("Failed to delete product.");
        }
      },
    },
  ]);
};

  const handleScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
    );
    setActiveIndex(index);
  };

  return (
    <View style={styles.safeArea}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Image Carousel */}
        {parsedProduct.images && parsedProduct.images.length > 0 && (
          <View style={styles.imageContainer}>
            <FlatList
              data={parsedProduct.images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.image} />
              )}
            />
            {/* Dots Overlay */}
            <View style={styles.dotsContainer}>
              {parsedProduct.images.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    activeIndex === idx ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Product Details with icons */}
       {/* Product Details with icons inside a card */}
<View style={styles.detailsCard}>
  <View style={styles.detailRow}>
    <Icon name="pricetag" size={18} color="#006d3a" />
    <Text style={styles.detail}>Sale Price: {parsedProduct.pricing?.salePrice}</Text>
  </View>
  <View style={styles.detailRow}>
    <Icon name="cash" size={18} color="#006d3a" />
    <Text style={styles.detail}>Purchase Price: {parsedProduct.pricing?.purchasePrice}</Text>
  </View>
  <View style={styles.detailRow}>
    <Icon name="cube" size={18} color="#006d3a" />
    <Text style={styles.detail}>In Stock: {parsedProduct.stock?.openingStock}</Text>
  </View>
  <View style={styles.detailRow}>
    <Icon name="list" size={18} color="#006d3a" />
    <Text style={styles.detail}>Category: {parsedProduct.itemCategory}</Text>
  </View>
  <View style={styles.detailRow}>
    <Icon name="barcode" size={18} color="#006d3a" />
    <Text style={styles.detail}>Code: {parsedProduct.itemCode}</Text>
  </View>
  <View style={styles.detailRow}>
    <Icon name="time" size={18} color="#006d3a" />
    <Text style={styles.detail}>Created At: {formatTimestamp(parsedProduct.createdAt)}</Text>
  </View>
</View>
 {/* View Details Arrow aligned right */}
         <TouchableOpacity onPress={() => setShowSpecs(true)} style={styles.viewDetailsRow}>
    <Text style={styles.viewDetailsLink}>View Details</Text>
    <Icon name="chevron-forward-circle" size={20} color="#006d3a" />
  </TouchableOpacity>
     
      </ScrollView>

      {/* Sticky Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.editBtn]} onPress={handleEdit}>
          <Icon name="create" size={18} color="#fff" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteBtn]} onPress={handleDelete}>
          <Icon name="trash" size={18} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
       {/* Specs Modal */}
      <ProductSpecsModal
        visible={showSpecs}
        onClose={() => setShowSpecs(false)}
        product={parsedProduct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#006d3a",
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  backButton: { marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  content: { padding: 20 },
  imageContainer: { alignItems: "center", marginBottom: 0 },
  image: {
    width: 320,
    height: 220,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 3 },
  activeDot: { backgroundColor: "#006d3a" },
  inactiveDot: { backgroundColor: "#ccc" },
  detailsContainer: { marginTop: 16 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  detail: { fontSize: 14, color: "#333", marginLeft: 8 },
  detailsCard: {
  backgroundColor: "#fff",
  borderRadius: 12,       // ✅ rounded corners
  padding: 16,            // ✅ inner padding
  marginTop: 16,
  marginBottom: 16,
  shadowColor: "#000",    // ✅ subtle shadow for card effect
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,           // ✅ Android shadow
},
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  editBtn: { backgroundColor: "#006d3a" },
  deleteBtn: { backgroundColor: "#cc0000" },
  buttonText: { color: "#fff", fontWeight: "bold", marginLeft: 6 },
  viewDetailsRow: {
  flexDirection: "row",
  justifyContent: "flex-end",   // ✅ right side
  alignItems: "center",
  marginTop: 4,
},
viewDetailsText: {
  fontSize: 14,
  color: "#006d3a",
  fontWeight: "600",
  marginRight: 4,
},
viewDetailsLink: {
  fontSize: 14,
  color: "#006d3a",             // ✅ lighter link color
  textDecorationLine: "underline", // ✅ underline for link style
  fontWeight: "500",
  marginRight: 4,
},
});



