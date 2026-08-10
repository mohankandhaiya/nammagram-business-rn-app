// app/components/ProductCard.js
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Left: Product Image */}
      <Image
        source={{ uri: product.imageUrl || "https://via.placeholder.com/80" }}
        style={styles.image}
      />

      {/* Right: Product Details */}
      <View style={styles.details}>
        <Text style={styles.name}>{product.itemName}</Text>
        <Text style={styles.category}>{product.itemCategory}</Text>
        <Text style={styles.code}>Code: {product.itemCode}</Text>
        <Text style={styles.price}>Sale Price: {product.pricing?.salePrice}</Text>
        <Text style={styles.tax}>Tax: {product.pricing?.taxRate}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    padding: 10,
    alignItems: "center",
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "#006d3a" },
  category: { fontSize: 14, color: "#555", marginVertical: 2 },
  code: { fontSize: 12, color: "#777" },
  price: { fontSize: 14, fontWeight: "600", marginTop: 4 },
  tax: { fontSize: 12, color: "#999", marginTop: 2 },
});
