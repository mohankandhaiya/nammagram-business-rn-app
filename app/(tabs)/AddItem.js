import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import PricingForm from "../components/PricingForm";
import StockForm from "../components/StockForm";

export default function AddItem() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("product"); // product | service
  const [activeSubTab, setActiveSubTab] = useState("pricing"); // pricing | stock

  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [hsnCode, setHsnCode] = useState("");

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "product" && styles.activeTab]}
            onPress={() => setActiveTab("product")}
          >
            <Text style={[styles.tabText, activeTab === "product" && styles.activeTabText]}>
              Product
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "service" && styles.activeTab]}
            onPress={() => setActiveTab("service")}
          >
            <Text style={[styles.tabText, activeTab === "service" && styles.activeTabText]}>
              Service
            </Text>
          </TouchableOpacity>
        </View>

        {/* Product Form */}
        {activeTab === "product" && (
          <>
            {/* Item Details always visible */}
             {/* <Text style={styles.sectionDivider}>Item Details</Text>  */}
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Item Name *"
                value={itemName}
                onChangeText={setItemName}
              />
              <TouchableOpacity
                style={styles.roundButton}
                onPress={() => router.push("/AddItemUnit")}
              >
                <Text style={styles.roundButtonText}>Unit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Item Code / Barcode"
                value={itemCode}
                onChangeText={setItemCode}
              />
              <TouchableOpacity style={styles.roundButton}>
                <Text style={styles.roundButtonText}>Assign</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Item Category"
              value={itemCategory}
              onChangeText={setItemCategory}
            />

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

            {/* Sub Tabs for Pricing & Stock */}
            <View style={styles.subTabRow}>
              <TouchableOpacity
                style={[styles.subTabButton, activeSubTab === "pricing" && styles.activeSubTab]}
                onPress={() => setActiveSubTab("pricing")}
              >
                <Text style={[styles.subTabText, activeSubTab === "pricing" && styles.activeSubTabText]}>
                  Pricing
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.subTabButton, activeSubTab === "stock" && styles.activeSubTab]}
                onPress={() => setActiveSubTab("stock")}
              >
                <Text style={[styles.subTabText, activeSubTab === "stock" && styles.activeSubTabText]}>
                  Stock
                </Text>
              </TouchableOpacity>
            </View>

            {/* Show Pricing or Stock form */}
            {activeSubTab === "pricing" && <PricingForm />}
            {activeSubTab === "stock" && <StockForm />}
          </>
        )}

        {/* Service Form */}
        {activeTab === "service" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Service Name *"
              value={itemName}
              onChangeText={setItemName}
            />
            <TextInput
              style={styles.input}
              placeholder="Service Code"
              value={itemCode}
              onChangeText={setItemCode}
            />
            <TextInput
              style={styles.input}
              placeholder="Service Category"
              value={itemCategory}
              onChangeText={setItemCategory}
            />
          </>
        )}
      </ScrollView>

      {/* Sticky Action Buttons */}
      <View style={styles.stickyButtonRow}>
        <TouchableOpacity style={[styles.button, styles.cancel]}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.save]}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 16, paddingBottom: 100 },

  tabRow: { flexDirection: "row", marginBottom: 16 },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#006d3a" },
  tabText: { fontSize: 16, fontWeight: "600", color: "#333" },
  activeTabText: { color: "#fff" },

  sectionDivider: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006d3a",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 6,
  },

  subTabRow: { flexDirection: "row", marginBottom: 16 },
  subTabButton: {
    flex: 1,
    // height: 44,  
    paddingVertical: 10,
    justifyContent: "center",
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  activeSubTab: { backgroundColor: "#006d3a" },
  subTabText: { fontSize: 16, fontWeight: "600", color: "#333" },
  activeSubTabText: { color: "#fff" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  roundButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#006d3a",
    justifyContent: "center",
    alignItems: "center",
  },
  roundButtonText: { color: "#fff", fontWeight: "bold", fontSize: 12 },

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
  button: { flex: 1, padding: 12, borderRadius: 6, alignItems: "center", marginHorizontal: 5 },
  cancel: { backgroundColor: "#cc0000" },
  save: { backgroundColor: "#006d3a" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});















