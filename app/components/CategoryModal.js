// components/CategoryModal.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Dialog, Portal, Button, Provider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FlatList } from "react-native";

export default function CategoryModal({
  visible,
  onClose,
  categories,
  onAddCategory,
  onSelectCategory,
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = () => {
    if (selectedCategory) {
      onSelectCategory(selectedCategory);
    }
    onClose();
  };

  return (
    <Provider>
      <Portal>
        <Dialog visible={visible} onDismiss={onClose} style={styles.dialogBox}>
          <Dialog.Title style={styles.dialogTitle}>Select Category</Dialog.Title>

          {/* FlatList is the only scroll container */}
          <FlatList
            data={filteredCategories}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryRow,
                  selectedCategory === item && styles.selectedRow,
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={styles.categoryText}>{item}</Text>
              </TouchableOpacity>
            )}
            ListHeaderComponent={
              <View>
                {/* Search Bar */}
                <TextInput
                  placeholder="Search Category"
                  value={search}
                  onChangeText={setSearch}
                  style={styles.searchInput}
                />

                {/* Add New Category */}
                <TouchableOpacity style={styles.addRow} onPress={onAddCategory}>
                  <Icon name="plus" size={20} color="#006d3a" />
                  <Text style={styles.addText}>Add New Category</Text>
                </TouchableOpacity>
              </View>
            }
            ListFooterComponent={
              <View style={styles.footer}>
                <Button
                  mode="contained"
                  color="#cc0000"
                  onPress={onClose}
                  style={styles.footerBtn}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  color="#006d3a"
                  onPress={handleApply}
                  style={styles.footerBtn}
                >
                  Apply
                </Button>
              </View>
            }
          />
        </Dialog>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  dialogBox: { backgroundColor: "#fff" },
  dialogTitle: { color: "#006d3a", fontWeight: "bold" },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  addRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  addText: { marginLeft: 6, color: "#006d3a", fontWeight: "600" },
  categoryRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedRow: { backgroundColor: "#e6f4ea" }, // highlight selected
  categoryText: { fontSize: 14, color: "#333" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 8,
  },
  footerBtn: { flex: 1, marginHorizontal: 4 },
});


