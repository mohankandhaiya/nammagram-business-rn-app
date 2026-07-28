import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../app/components/Header";
import FooterNav from "../../app/components/FooterNav";

export default function Orders() {
  const [orders, setOrders] = useState([
    { id: 1, item: "Office Supplies", customer: "ABC Corp", status: "Pending", amount: "₹5,000" },
    { id: 2, item: "Marketing Services", customer: "XYZ Ltd", status: "Completed", amount: "₹20,000" },
    { id: 3, item: "Software License", customer: "TechSoft", status: "Pending", amount: "₹15,000" },
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [newCustomer, setNewCustomer] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const markCompleted = (id) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: "Completed" } : order));
  };

  const cancelOrder = (id) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: "Cancelled" } : order));
  };

  const addOrder = () => {
    if (!newItem || !newCustomer || !newAmount) return;
    const newOrder = {
      id: Date.now(),
      item: newItem,
      customer: newCustomer,
      status: "Pending",
      amount: newAmount,
    };
    setOrders([newOrder, ...orders]);
    setNewItem("");
    setNewCustomer("");
    setNewAmount("");
    setShowDialog(false);
  };

  const pendingOrders = orders.filter(o => o.status === "Pending");
  const completedOrders = orders.filter(o => o.status === "Completed");
  const cancelledOrders = orders.filter(o => o.status === "Cancelled");

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Pending Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Orders</Text>
          {pendingOrders.length > 0 ? pendingOrders.map(order => (
            <View key={order.id} style={styles.card}>
              <Text style={styles.item}>{order.item}</Text>
              <Text style={styles.detail}>Customer: {order.customer}</Text>
              <Text style={styles.detail}>Amount: {order.amount}</Text>
              <Text style={styles.status}>Status: {order.status}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.actionButton, styles.complete]} onPress={() => markCompleted(order.id)}>
                  <Text style={styles.actionText}>Mark Completed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.cancel]} onPress={() => cancelOrder(order.id)}>
                  <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )) : <Text style={styles.empty}>No pending orders</Text>}
        </View>

        {/* Completed Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed Orders</Text>
          {completedOrders.length > 0 ? completedOrders.map(order => (
            <View key={order.id} style={styles.card}>
              <Text style={styles.item}>{order.item}</Text>
              <Text style={styles.detail}>Customer: {order.customer}</Text>
              <Text style={styles.detail}>Amount: {order.amount}</Text>
              <Text style={styles.status}>Status: {order.status}</Text>
            </View>
          )) : <Text style={styles.empty}>No completed orders</Text>}
        </View>

        {/* Cancelled Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cancelled Orders</Text>
          {cancelledOrders.length > 0 ? cancelledOrders.map(order => (
            <View key={order.id} style={styles.card}>
              <Text style={styles.item}>{order.item}</Text>
              <Text style={styles.detail}>Customer: {order.customer}</Text>
              <Text style={styles.detail}>Amount: {order.amount}</Text>
              <Text style={[styles.status, { color: "#cc0000" }]}>Status: {order.status}</Text>
            </View>
          )) : <Text style={styles.empty}>No cancelled orders</Text>}
        </View>

        {/* Analytics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Analytics</Text>
          <View style={styles.card}>
            <Text style={styles.detail}>Total Orders: {orders.length}</Text>
            <Text style={styles.detail}>Pending: {pendingOrders.length}</Text>
            <Text style={styles.detail}>Completed: {completedOrders.length}</Text>
            <Text style={styles.detail}>Cancelled: {cancelledOrders.length}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Plus Icon */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowDialog(true)}>
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Dialog Form */}
      {showDialog && (
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>New Order</Text>
            <TextInput style={styles.input} placeholder="Item" value={newItem} onChangeText={setNewItem} />
            <TextInput style={styles.input} placeholder="Customer" value={newCustomer} onChangeText={setNewCustomer} />
            <TextInput style={styles.input} placeholder="Amount" value={newAmount} onChangeText={setNewAmount} />
            <View style={styles.dialogActions}>
              <TouchableOpacity style={[styles.actionButton, styles.complete]} onPress={addOrder}>
                <Text style={styles.actionText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.cancel]} onPress={() => setShowDialog(false)}>
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <FooterNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: { padding: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#006d3a", marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  item: { fontSize: 16, fontWeight: "600", color: "#333" },
  detail: { fontSize: 14, color: "#555" },
  status: { fontSize: 14, fontWeight: "600", color: "#006d3a", marginTop: 6 },
  actions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  actionButton: { borderRadius: 6, paddingVertical: 6, paddingHorizontal: 12 },
  complete: { backgroundColor: "#006d3a" },
  cancel: { backgroundColor: "#cc0000" },
  actionText: { color: "#fff", fontWeight: "bold" },
  empty: { fontSize: 14, color: "#777", fontStyle: "italic" },

  // Floating Action Button
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#006d3a",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  // Dialog
  dialogOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "80%",
    elevation: 5,
  },
  dialogTitle: { fontSize: 18, fontWeight: "bold", color: "#006d3a", marginBottom: 12 },
   input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  dialogActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
});



