// app/business/PricingForm.js
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";

export default function PricingForm() {
  const [salePrice, setSalePrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [taxRate, setTaxRate] = useState("");

  return (
    <View style={styles.container}>
       <Text style={styles.sectionTitle}>Pricing</Text> 

      {/* Sale Price */}
      <TextInput
        style={styles.input}
        placeholder="Sale Price"
        value={salePrice}
        onChangeText={setSalePrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Disc. On Sale Price (%)"
        value={discount}
        onChangeText={setDiscount}
      />

      {/* Add Wholesale Price */}
      <TouchableOpacity>
        <Text style={styles.linkText}>+ Add Wholesale Price 👑</Text>
      </TouchableOpacity>

      {/* Purchase Price */}
      <TextInput
        style={styles.input}
        placeholder="Purchase Price"
        value={purchasePrice}
        onChangeText={setPurchasePrice}
      />

      {/* Taxes */}
      <TextInput
        style={styles.input}
        placeholder="Tax Rate"
        value={taxRate}
        onChangeText={setTaxRate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#006d3a",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  linkText: { color: "#006d3a", fontWeight: "600", marginBottom: 12 },
});
