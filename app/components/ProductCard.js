// app/components/ProductCard.js
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
export default function ProductCard({ product, onPress }) {
   const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
    );
    setActiveIndex(index);
  };

  // Check low stock condition
  const isLowStock =
    product.stock?.openingStock <= product.stock?.minStockQty;

  return (
    // <TouchableOpacity
    //   style={[styles.card, isLowStock && styles.lowStockCard]}
    //   onPress={onPress}
    // >
    <TouchableOpacity
  style={[styles.card, isLowStock && styles.lowStockCard]}
  onPress={() =>
    router.push({
      pathname: "/business/ProductDetails",
      params: { product: JSON.stringify(product) },
    })
  }
>

      {/* Left: Product Images Carousel */}
      <View style={styles.imageContainer}>
        <FlatList
          data={product.images && product.images.length > 0 ? product.images : []}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
        />
        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {(product.images && product.images.length > 0 ? product.images : [null]).map(
            (_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  activeIndex === idx ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            )
          )}
        </View>
      </View>

      {/* Right: Product Details */}
      <View style={[styles.details, isLowStock && styles.lowStockDetails]}>
        <Text style={styles.name}>{product.itemName}</Text>
        <Text style={styles.price}>Sale Price: {product.pricing?.salePrice}</Text>
        <Text style={styles.purchase}>Purchase Price: {product.pricing?.purchasePrice}</Text>
        <Text style={styles.stock}>In Stock: {product.stock?.openingStock}</Text>

        {/* Low Stock Indicator */}
        {isLowStock && (
          <Text style={styles.lowStock}>⚠ Low Stock</Text>
        )}
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
    padding: 12,
    alignItems: "flex-start",
    elevation: 2,
    width: "100%", // full width card
  },
  lowStockCard: {
    borderColor: "#cc0000", // red border when low stock
  },
  imageContainer: {
    width: 100,
    marginRight: 12,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  activeDot: { backgroundColor: "#006d3a" },
  inactiveDot: { backgroundColor: "#ccc" },
  details: { flex: 2, paddingLeft: 8, backgroundColor: "#fff" },
  lowStockDetails: {
    backgroundColor: "#ffe5e5", // light red highlight when low stock
    borderRadius: 6,
    padding: 8,
  },
  name: { fontSize: 16, fontWeight: "bold", color: "#006d3a" },
  price: { fontSize: 14, fontWeight: "600", marginTop: 4 },
  purchase: { fontSize: 14, fontWeight: "600", marginTop: 2, color: "#444" },
  stock: { fontSize: 13, fontWeight: "500", marginTop: 6, color: "#333" },
  lowStock: { fontSize: 13, fontWeight: "bold", color: "#cc0000", marginTop: 4 },
});




