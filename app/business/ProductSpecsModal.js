// app/business/ProductSpecsModal.js
import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function ProductSpecsModal({ visible, onClose, product }) {
  const [activeTab, setActiveTab] = useState("specs");


  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header row */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Product Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close-circle" size={28} color="#cc0000" />
            </TouchableOpacity>
          </View>

          {/* Tab buttons */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "specs" && styles.activeTab]}
              onPress={() => setActiveTab("specs")}
            >
              <Text style={[styles.tabText, activeTab === "specs" && styles.activeTabText]}>
                Specifications
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "info" && styles.activeTab]}
              onPress={() => setActiveTab("info")}
            >
              <Text style={[styles.tabText, activeTab === "info" && styles.activeTabText]}>
                More Info
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab content */}
          <ScrollView style={styles.tabContent}>
            {activeTab === "specs" ? (
              <>
                <Text style={styles.specText}>HSN Code: {product.hsnCode}</Text>
                <Text style={styles.specText}>Tax Rate: {product.pricing?.taxRate}</Text>
                <Text style={styles.specText}>Minimum Stock Qty: {product.stock?.minStockQty}</Text>
                <Text style={styles.specText}>Location: {product.stock?.itemLocation}</Text>
              </>
            ) : (
              <>
                {/* <Text style={styles.specText}>Created At: {product.createdAt}</Text>
                <Text style={styles.specText}>Updated At: {product.updatedAt}</Text> */}
                <Text style={styles.specText}>Created At: {createdAt}</Text>
<Text style={styles.specText}>Updated At: {updatedAt}</Text>

                <Text style={styles.specText}>Additional Notes: {product.notes || "N/A"}</Text>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalBox: {
    height: "50%", // ✅ half screen
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#006d3a" },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabText: { fontSize: 14, color: "#666" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#006d3a" },
  activeTabText: { color: "#006d3a", fontWeight: "bold" },
  tabContent: { marginTop: 10 },
  specText: { fontSize: 14, color: "#333", marginBottom: 8 },
});

