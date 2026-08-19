// app/business/AddItemUnit.js
import React, { useState,useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { Dialog, Portal, TextInput, Button, Provider } from "react-native-paper";

export default function AddItemUnit() {
  const router = useRouter();

  // Initial units
const {  primaryShort, secondaryShort, } = useLocalSearchParams();

  const [selectedUnits, setSelectedUnits] = useState([]);
       const [conversionRate, setConversionRate] = useState("0.0");
const [editing, setEditing] = useState("");
  const [primaryUnits, setPrimaryUnits] = useState([
    "KILOMETER (Kmt)",
    "UNIT (Unit)",
    "BOTTLES (Btl)",
    "HOUR (Hur)",
    "PIECES (Pcs)",
  ]);
  const [secondaryUnits, setSecondaryUnits] = useState([
    "GRAM (g)",
    "LITRE (Ltr)",
    "PACK (Pkt)",
    "BOX (Box)",
    "METER (Mtr)",
  ]);

   const [primaryUnit, setPrimaryUnit] = useState("");
   const [secondaryUnit, setSecondaryUnit] = useState("");

  // Dialog state
  const [dialogVisible, setDialogVisible] = useState(false);
  const [targetType, setTargetType] = useState("primary"); // "primary" or "secondary"
  const [newFull, setNewFull] = useState("");
  const [newShort, setNewShort] = useState("");

  const handleSave = () => {
    router.push({
      // pathname: "/AddItem",
       pathname: "/business/AddItem",
      // params: { primaryUnit, secondaryUnit, conversionRate },
        params: {
      primaryUnit: primaryUnit,          // full name
      secondaryUnit: secondaryUnit,      // full name
      primaryShort: primaryUnit.match(/\((.*?)\)/)?.[1],   // extract short name
      secondaryShort: secondaryUnit.match(/\((.*?)\)/)?.[1],
      conversionRate,
    },
    });
  };

  const addUnit = () => {
    if (newFull && newShort) {
      const formatted = `${newFull.toUpperCase()} (${newShort})`;
      if (targetType === "primary") {
        setPrimaryUnits([...primaryUnits, formatted]);
        setPrimaryUnit(formatted);
      } else {
        setSecondaryUnits([...secondaryUnits, formatted]);
        setSecondaryUnit(formatted);
      }
      setNewFull("");
      setNewShort("");
      setDialogVisible(false);
    }
  };
useEffect(() => {
  if (primaryUnit && secondaryUnit && conversionRate) {
    setSelectedUnits([
      {
        primaryUnit,
        secondaryUnit,
        primaryShort,
        secondaryShort,
        conversionRate,
      },
    ]);
  }
}, [primaryUnit, secondaryUnit, conversionRate]);
  // Custom dropdown component
  const Dropdown = ({ label, options, selected, setSelected, type }) => {
    const [open, setOpen] = useState(false);

    return (
      <View style={styles.dropdownWrapper}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => setOpen(!open)}
        >
          <Text style={styles.dropdownText}>
            {selected || "Select Unit"}
          </Text>
          <Icon name={open ? "chevron-up" : "chevron-down"} size={20} color="#006d3a" />
        </TouchableOpacity>

        {open && (
          <View style={styles.dropdownList}>
            {/* Add Unit button at top */}
            <TouchableOpacity
              style={styles.addUnitItem}
              onPress={() => {
                setTargetType(type);
                setDialogVisible(true);
                setOpen(false);
              }}
            >
              <Text style={styles.addUnitText}>➕ Add Unit</Text>
            </TouchableOpacity>

            {options.map((opt, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelected(opt);
                  setOpen(false);
                }}
              >
                <Text style={styles.dropdownText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Provider>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/business/AddItem")} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
           <Text style={styles.headerTitle}>Add Item Unit</Text> 
        </View>

        <View style={styles.container}>
          {/* <Text style={styles.title}>Add Item Unit</Text> */}

          {/* Primary Dropdown */}
          <Dropdown
            label="Primary Unit"
            options={primaryUnits}
            selected={primaryUnit}
            setSelected={setPrimaryUnit}
            type="primary"
          />

          {/* Secondary Dropdown */}
          <Dropdown
            label="Secondary Unit"
            options={secondaryUnits}
            selected={secondaryUnit}
            setSelected={setSecondaryUnit}
            type="secondary"
          />
<View style={styles.conversionRow}>
  <Text style={styles.label}>Select Conversion Rate</Text>
  <TouchableOpacity
    onPress={() => setEditing(true)}
    style={styles.conversionBox}
  >
    <Text style={styles.conversionText}>
      1 {primaryUnit || "Primary"} = {conversionRate} {secondaryUnit || "Secondary"}
    </Text>
  </TouchableOpacity>

  {editing && (
    <TextInput
      style={styles.input}
      placeholder="Enter conversion"
      value={conversionRate}
      keyboardType="numeric"
      onChangeText={setConversionRate}
      onBlur={() => setEditing(false)}
    />
  )}
</View>
<View style={styles.selectedList}>
  {selectedUnits.map((u, idx) => (
    <View key={idx} style={styles.selectedRow}>
      <Text style={styles.selectedText}>
        1 {u.primaryShort} = {u.conversionRate} {u.secondaryShort}
      </Text>
      <TouchableOpacity
        onPress={() => setSelectedUnits(selectedUnits.filter((_, i) => i !== idx))}
      >
        <Icon name="trash" size={20} color="#cc0000" />
      </TouchableOpacity>
    </View>
  ))}
</View>


          {/* Save/Cancel */}
          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              color="#cc0000"
              style={styles.flexBtn}
              onPress={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              color="#006d3a"
              style={styles.flexBtn}
              onPress={handleSave}
            >
              Save
            </Button>
          </View>
        </View>

        {/* Dialog */}
        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
            style={styles.dialogBox}
          >
            <Dialog.Title style={{ color: "#006d3a" }}>Add New Unit</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Full name"
                value={newFull}
                onChangeText={setNewFull}
                style={styles.input}
              />
              <TextInput
                label="Shortname"
                value={newShort}
                onChangeText={setNewShort}
                style={styles.input}
              />
              <Text style={styles.warningText}>This Unit cannot be deleted</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)} color="#cc0000">
                Cancel
              </Button>
              <Button onPress={addUnit} color="#006d3a">
                Save
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#006d3a" },
  header: { flexDirection: "row", alignItems: "center", padding: 12 },
  backButton: { marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#006d3a" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#333" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  flexBtn: { flex: 1, marginHorizontal: 5 },
  dropdownWrapper: { marginBottom: 16 },
  dropdownHeader: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  dialogBox: { backgroundColor: "#fff" }, // ✅ white background
  input: { marginBottom: 12 },
  warningText: { color: "#cc0000", fontSize: 12, marginTop: 4 },
//   conversionRow: { marginVertical: 12 },
// conversionText: { fontSize: 14, color: "#333", marginBottom: 6 },
conversionRow: { marginVertical: 16 },
conversionBox: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  padding: 12,
  backgroundColor: "#fff",
  marginBottom: 8,
},
conversionText: { fontSize: 14, color: "#333" },
selectedList: { marginTop: 20 },
selectedRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderBottomColor: "#ccc",
},
selectedText: { fontSize: 14, color: "#333", fontWeight: "600" },

});









