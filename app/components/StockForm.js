// app/business/StockForm.js
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function StockForm() {
  const [openingStock, setOpeningStock] = useState("");
  const [asOfDate, setAsOfDate] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [minStockQty, setMinStockQty] = useState("");
  const [itemLocation, setItemLocation] = useState("");

  return (
    <View style={styles.container}>
       <Text style={styles.sectionTitle}>Stock</Text> 

      <TextInput
        style={styles.input}
        placeholder="Opening Stock (Ex: 300)"
        value={openingStock}
        onChangeText={setOpeningStock}
      />
      <TextInput
        style={styles.input}
        placeholder="As of Date (DD/MM/YYYY)"
        value={asOfDate}
        onChangeText={setAsOfDate}
      />
      <TextInput
        style={styles.input}
        placeholder="At Price/Unit (Ex: 2000)"
        value={pricePerUnit}
        onChangeText={setPricePerUnit}
      />
      <TextInput
        style={styles.input}
        placeholder="Min Stock Qty (Ex: 5)"
        value={minStockQty}
        onChangeText={setMinStockQty}
      />
      <TextInput
        style={styles.input}
        placeholder="Item Location"
        value={itemLocation}
        onChangeText={setItemLocation}
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
});
