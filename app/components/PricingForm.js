// app/components/PricingForm.js
import React, { useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function PricingForm({ pricingData, onPricingChange }) {
  const { salePrice, salePriceType, discount, discountType, purchasePrice, purchasePriceType, taxRate } = pricingData;

  const priceOptions = ["Without Tax", "With Tax"];
  const discountOptions = ["Percentage", "Amount"];
  const taxOptions = [
    "None — 0.0","Exempted — 0.0","GST@0% — 0.0","IGST@0% — 0.0",
    "GST@0.25% — 0.25","IGST@0.25% — 0.25","GST@3% — 3.0","IGST@3% — 3.0",
    "GST@5% — 5.0","IGST@5% — 5.0","GST@12% — 12.0","IGST@12% — 12.0",
  ];

  // Dropdown visibility states (UI only)
  const [saleDropdownVisible, setSaleDropdownVisible] = React.useState(false);
  const [discountDropdownVisible, setDiscountDropdownVisible] = React.useState(false);
  const [purchaseDropdownVisible, setPurchaseDropdownVisible] = React.useState(false);
  const [taxDropdownVisible, setTaxDropdownVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      {/* Sale Price */}
      <Text style={styles.sectionTitle}>Sale Price</Text>
      <TouchableOpacity style={styles.inputRowFull} onPress={() => setSaleDropdownVisible(true)} activeOpacity={0.7}>
        <TextInput
  style={[styles.input, { flex: 1 }]}
  placeholder="Sale Price"
  value={salePrice}
  keyboardType="numeric"
  onChangeText={(val) => {
    // allow only digits
    const numericVal = val.replace(/[^0-9]/g, "");
    onPricingChange({ ...pricingData, salePrice: numericVal });
  }}
/>

        <Text style={styles.dropdownText}>{salePriceType}</Text>
        <Icon name="chevron-down" size={20} color="#666" style={styles.dropdownIcon} />
      </TouchableOpacity>
      <DropdownModal visible={saleDropdownVisible} options={priceOptions} onClose={() => setSaleDropdownVisible(false)} onSelect={(val) => onPricingChange({ ...pricingData, salePriceType: val })} />

      {/* Discount */}
      <TouchableOpacity style={styles.inputRowFull} onPress={() => setDiscountDropdownVisible(true)} activeOpacity={0.7}>
       <TextInput
  style={[styles.input, { flex: 1 }]}
  placeholder="Disc. On Sale Price"
  value={discount}
  keyboardType="numeric"
  maxLength={2} // restrict to 2 digits
  onChangeText={(val) => {
    // allow only numbers
    const numericVal = val.replace(/[^0-9]/g, "");
    onPricingChange({ ...pricingData, discount: numericVal });
  }}
/>

        <Text style={styles.dropdownText}>{discountType}</Text>
        <Icon name="chevron-down" size={20} color="#666" style={styles.dropdownIcon} />
      </TouchableOpacity>
      <DropdownModal visible={discountDropdownVisible} options={discountOptions} onClose={() => setDiscountDropdownVisible(false)} onSelect={(val) => onPricingChange({ ...pricingData, discountType: val })} />

      {/* Purchase Price */}
      <Text style={styles.sectionTitle}>Purchase Price</Text>
      <TouchableOpacity style={styles.inputRowFull} onPress={() => setPurchaseDropdownVisible(true)} activeOpacity={0.7}>
    <TextInput
  style={[styles.input, { flex: 1 }]}
  placeholder="Purchase Price"
  value={purchasePrice}
  keyboardType="numeric"
  onChangeText={(val) => {
    // allow only digits
    const numericVal = val.replace(/[^0-9]/g, "");
    onPricingChange({ ...pricingData, purchasePrice: numericVal });
  }}
/>

        <Text style={styles.dropdownText}>{purchasePriceType}</Text>
        <Icon name="chevron-down" size={20} color="#666" style={styles.dropdownIcon} />
      </TouchableOpacity>
      <DropdownModal visible={purchaseDropdownVisible} options={priceOptions} onClose={() => setPurchaseDropdownVisible(false)} onSelect={(val) => onPricingChange({ ...pricingData, purchasePriceType: val })} />

      {/* Taxes */}
      <Text style={styles.sectionTitle}>Taxes</Text>
      <TouchableOpacity style={styles.inputRowFull} onPress={() => setTaxDropdownVisible(true)} activeOpacity={0.7}>
        <Text style={{ flex: 1, color: taxRate !== "None" ? "#000" : "#999" }}>{taxRate}</Text>
        <Icon name="chevron-down" size={20} color="#666" style={styles.dropdownIcon} />
      </TouchableOpacity>
      <DropdownModal visible={taxDropdownVisible} options={taxOptions} onClose={() => setTaxDropdownVisible(false)} onSelect={(val) => onPricingChange({ ...pricingData, taxRate: val })} />
    </View>
  );
}

function DropdownModal({ visible, options, onClose, onSelect }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={onClose}>
        <View style={styles.dropdownContainer}>
          <FlatList
            data={options}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.dropdownItem} onPress={() => { onSelect(item); onClose(); }}>
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#006d3a", marginBottom: 8 },
  inputRowFull: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 6, backgroundColor: "#fff", paddingHorizontal: 12, marginBottom: 12, minHeight: 44 },
  input: { paddingVertical: 10, paddingHorizontal: 8, backgroundColor: "#fff" },
  dropdownText: { marginLeft: 8, color: "#333" },
  dropdownIcon: { marginLeft: 6 },
  modalOverlay: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  dropdownContainer: { marginHorizontal: 40, backgroundColor: "#fff", borderRadius: 6, paddingVertical: 8 },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16 },
  dropdownItemText: { fontSize: 14, color: "#333" },
});









