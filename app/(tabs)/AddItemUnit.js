// app/business/AddItemUnit.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

export default function AddItemUnit() {
  const router = useRouter();
  const [primaryUnit, setPrimaryUnit] = useState("");
  const [secondaryUnit, setSecondaryUnit] = useState("");

  const handleSave = () => {
    // Pass units back to AddItem via router params
    router.push({
      pathname: "/AddItem",
      params: { primaryUnit, secondaryUnit },
    });
  };

  return (
   
    <SafeAreaView style={styles.safeArea}>
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
      <Icon name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Add Item Unit</Text>
  </View>
      <View style={styles.container}>
        <Text style={styles.title}>Add Item Unit</Text>

        <Text style={styles.label}>Primary Unit</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={primaryUnit} onValueChange={setPrimaryUnit} style={styles.picker}>
            <Picker.Item label="Select Primary Unit" value="" />
            <Picker.Item label="Piece" value="piece" />
            <Picker.Item label="Kg" value="kg" />
            <Picker.Item label="Litre" value="litre" />
            <Picker.Item label="Box" value="box" />
          </Picker>
        </View>

        <Text style={styles.label}>Secondary Unit</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={secondaryUnit} onValueChange={setSecondaryUnit} style={styles.picker}>
            <Picker.Item label="Select Secondary Unit" value="" />
            <Picker.Item label="Piece" value="piece" />
            <Picker.Item label="Kg" value="kg" />
            <Picker.Item label="Litre" value="litre" />
            <Picker.Item label="Box" value="box" />
          </Picker>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      </SafeAreaView>
  
  );
}

const styles = StyleSheet.create({
  // background: { flex: 1 },
  container: { flex: 1, padding: 16,backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#006d3a" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#333" },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  picker: { height: 50 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  button: { flex: 1, padding: 12, borderRadius: 6, alignItems: "center", marginHorizontal: 5 },
  cancel: { backgroundColor: "#cc0000" },
  save: { backgroundColor: "#006d3a" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  safeArea: { flex: 1, backgroundColor: "#006d3a" },
header: { flexDirection: "row", alignItems: "center", padding: 12 },
backButton: { marginRight: 12 },
headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },

});


