import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function StockForm({ stockData, onStockChange }) {
  const { openingStock, asOfDate, pricePerUnit, minStockQty, itemLocation } = stockData;
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Stock</Text>

      <TextInput
        style={styles.input}
        placeholder="Opening Stock (Ex: 300)"
        value={openingStock}
        onChangeText={(val) => onStockChange({ ...stockData, openingStock: val })}
        keyboardType="numeric"
      />

      {/* As of Date with Calendar */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="As of Date (DD/MM/YYYY)"
          value={asOfDate}
          editable={false}
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={asOfDate ? new Date(asOfDate) : new Date()}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const formatted = selectedDate.toLocaleDateString("en-GB"); // DD/MM/YYYY
              onStockChange({ ...stockData, asOfDate: formatted });
            }
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="At Price/Unit (Ex: 2000)"
        value={pricePerUnit}
        onChangeText={(val) => onStockChange({ ...stockData, pricePerUnit: val })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Min Stock Qty (Ex: 5)"
        value={minStockQty}
        onChangeText={(val) => onStockChange({ ...stockData, minStockQty: val })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Item Location"
        value={itemLocation}
        onChangeText={(val) => onStockChange({ ...stockData, itemLocation: val })}
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

