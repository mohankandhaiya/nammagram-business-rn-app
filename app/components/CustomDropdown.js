import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Dialog, Portal, TextInput, Button, Provider } from "react-native-paper";

export default function CustomDropdown({ units, selected, setSelected, onAddUnit }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.dropdownWrapper}>
      {/* Selected value */}
      <TouchableOpacity style={styles.dropdownHeader} onPress={() => setOpen(!open)}>
        <Text style={styles.dropdownText}>
          {selected ? selected.toUpperCase() : "Select Unit"}
        </Text>
      </TouchableOpacity>

      {/* Dropdown list */}
      {open && (
        <View style={styles.dropdownList}>
          {/* ✅ Add Unit button at top */}
          <TouchableOpacity
            style={styles.addUnitItem}
            onPress={() => {
              setOpen(false);
              onAddUnit();
            }}
          >
            <Text style={styles.addUnitText}>➕ Add Unit</Text>
          </TouchableOpacity>

          {/* Units list */}
          <FlatList
            data={units}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelected(item);
                  setOpen(false);
                }}
              >
                <Text style={styles.dropdownText}>{item.toUpperCase()}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownWrapper: { marginBottom: 16 },
  dropdownHeader: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#fff",
  },
  dropdownText: { fontSize: 14, color: "#333" },
  dropdownList: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    marginTop: 4,
  },
  dropdownItem: { padding: 12 },
  addUnitItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  addUnitText: { color: "#006d3a", fontWeight: "600" }, // ✅ green text
});
