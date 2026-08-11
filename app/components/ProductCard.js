// app/components/ProductCard.js
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native";

export default function ProductCard({ product, onPress }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
    );
    setActiveIndex(index);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
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
      <View style={styles.details}>
        <Text style={styles.name}>{product.itemName}</Text>
        <Text style={styles.category}>{product.itemCategory}</Text>
        <Text style={styles.code}>Code: {product.itemCode}</Text>

        {/* Pricing Summary */}
        <Text style={styles.price}>Sale Price: {product.pricing?.salePrice}</Text>
        <Text style={styles.tax}>Tax: {product.pricing?.taxRate}</Text>

        {/* Stock Summary */}
        <Text style={styles.stock}>Opening Stock: {product.stock?.openingStock}</Text>
        <Text style={styles.location}>Location: {product.stock?.itemLocation}</Text>
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
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "#006d3a" },
  category: { fontSize: 14, color: "#555", marginVertical: 2 },
  code: { fontSize: 12, color: "#777" },
  price: { fontSize: 14, fontWeight: "600", marginTop: 4 },
  tax: { fontSize: 12, color: "#999", marginTop: 2 },
  stock: { fontSize: 13, fontWeight: "500", marginTop: 6, color: "#333" },
  location: { fontSize: 12, color: "#555", marginTop: 2 },
});


