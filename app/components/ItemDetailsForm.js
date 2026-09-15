import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default function ItemDetailsForm({
  itemName,
  setItemName,
  itemCode,
  setItemCode,
  hsnCode,
  setHsnCode,
}) {
  const router = useRouter();

  return (
    <>
      {/* Item Name */}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Item Name *"
          value={itemName}
          onChangeText={setItemName}
        />
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => router.push("/business/AddItemUnit")}
        >
          <Text style={styles.roundButtonText}>Unit</Text>
        </TouchableOpacity>
      </View>

      {/* Item Code */}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Item Code / Barcode"
          value={itemCode}
          onChangeText={setItemCode}
        />
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => {
            const randomCode = Math.floor(10000000000 + Math.random() * 90000000000).toString();
            setItemCode(randomCode);
          }}
        >
          <Text style={styles.roundButtonText}>Assign</Text>
        </TouchableOpacity>
      </View>

      {/* HSN/SAC Code */}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="HSN/SAC Code"
          value={hsnCode}
          onChangeText={setHsnCode}
        />
        <TouchableOpacity style={styles.roundButton}>
          <Text style={styles.roundButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  roundButton: {
    marginLeft: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 7,
    backgroundColor: "#006d3a",
    justifyContent: "center",
    alignItems: "center",
  },
  roundButtonText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
});
