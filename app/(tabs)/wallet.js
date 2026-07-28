import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import Header from "../../app/components/Header";
import FooterNav from "../../app/components/FooterNav";

export default function Wallet() {
  const [balance, setBalance] = useState(2500);
  const [transactions, setTransactions] = useState([
    { id: 1, type: "Credit", amount: 500, detail: "Payment from Client", time: "2h ago" },
    { id: 2, type: "Debit", amount: 200, detail: "Food Order", time: "5h ago" },
    { id: 3, type: "Debit", amount: 1000, detail: "Vendor Payment", time: "Yesterday" },
  ]);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSendMoney = () => {
    if (!recipient || !amount) return;
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0 || amt > balance) return;
    setShowConfirm(true); // show modal before finalizing
  };

  const confirmSend = () => {
    const amt = parseFloat(amount);
    setBalance(balance - amt);
    const newTxn = {
      id: Date.now(),
      type: "Debit",
      amount: amt,
      detail: `Sent to ${recipient}`,
      time: "Just now",
    };
    setTransactions([newTxn, ...transactions]);
    setRecipient("");
    setAmount("");
    setShowConfirm(false);
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Wallet Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Wallet Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance}</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Send Money */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Money</Text>
          <TextInput
            style={styles.input}
            placeholder="Recipient name"
            value={recipient}
            onChangeText={setRecipient}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMoney}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.map((txn) => (
            <View key={txn.id} style={styles.transactionRow}>
              <Text style={[styles.txnType, txn.type === "Credit" ? styles.credit : styles.debit]}>
                {txn.type}
              </Text>
              <View style={styles.txnDetail}>
                <Text style={styles.txnText}>{txn.detail}</Text>
                <Text style={styles.txnTime}>{txn.time}</Text>
              </View>
              <Text style={styles.txnAmount}>
                {txn.type === "Credit" ? "+" : "-"}₹{txn.amount}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.methodCard}>
            <Text style={styles.methodText}>💳 Visa **** 1234</Text>
          </View>
          <View style={styles.methodCard}>
            <Text style={styles.methodText}>📱 UPI: hari@upi</Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Are you sure you want to send ₹{amount} to {recipient}?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmSend}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowConfirm(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FooterNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: { padding: 16 },

  // Balance
  balanceCard: {
    backgroundColor: "#006d3a",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  balanceTitle: { fontSize: 18, color: "#fff", marginBottom: 8 },
  balanceAmount: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  balanceActions: { flexDirection: "row", marginTop: 12 },
  actionButton: {
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
  },
  actionText: { color: "#006d3a", fontWeight: "bold" },

  // Sections
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#006d3a", marginBottom: 10 },

  // Send Money
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#006d3a",
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
  },
  sendButtonText: { color: "#fff", fontWeight: "bold" },

  // Transactions
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
  },
  txnType: { fontSize: 14, fontWeight: "bold", width: 60 },
  credit: { color: "#006d3a" },
  debit: { color: "#cc0000" },
  txnDetail: { flex: 1 },
  txnText: { fontSize: 14, color: "#333" },
  txnTime: { fontSize: 12, color: "#666" },
  txnAmount: { fontSize: 14, fontWeight: "bold", color: "#333" },

  // Payment Methods
  methodCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
  },
  methodText: { fontSize: 14, color: "#333" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalText: { fontSize: 16, color: "#333", marginBottom: 20, textAlign: "center" },
  modalActions: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
  modalButton: {
    backgroundColor: "#006d3a",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
  },
  cancelButton: { backgroundColor: "#cc0000" },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
});


