import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function SaveActions({ onSave, onCancel }) {
  return (
    <View style={styles.stickyButtonRow}>
      <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.save]} onPress={onSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  stickyButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancel: { backgroundColor: "#cc0000" },
  save: { backgroundColor: "#006d3a" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
