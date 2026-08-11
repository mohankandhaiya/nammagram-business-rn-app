import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,Image,Modal } from "react-native";
import { useRouter } from "expo-router";
import PricingForm from "../components/PricingForm";
import StockForm from "../components/StockForm";
import CategoryModal from "../components/CategoryModal";
import { useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; 
import { collection, addDoc } from "firebase/firestore";
import { db } from "../helpers/firebaseConfig"; // adjust path
import * as ImagePicker from "expo-image-picker";
// import ImageCropPicker from "react-native-image-crop-picker";
import * as ImageManipulator from "expo-image-manipulator";
export default function AddItem() {
  const router = useRouter();
const [imageUri, setImageUri] = useState(null);
const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState("product"); // product | service
  const [activeSubTab, setActiveSubTab] = useState("pricing"); // pricing | stock
const [pricingData, setPricingData] = useState({
  salePrice: "",
  taxRate: "",
  discount: "",
});

const [stockData, setStockData] = useState({
  openingStock: "",
  asOfDate: "",
  pricePerUnit: "",
  minStockQty: "",
  itemLocation: "",
});

  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [hsnCode, setHsnCode] = useState("");
const [previewIndex, setPreviewIndex] = useState(null); // for full image view
const [dialogVisible, setDialogVisible] = useState(false);
    // Category modal state
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [categories, setCategories] = useState(["RO Water", "Electronics", "Groceries"]);

  const handleAddCategory = () => {
    const newCat = `Category ${categories.length + 1}`;
    setCategories([...categories, newCat]);
  };
const params = useLocalSearchParams();

React.useEffect(() => {
  if (params.categories) {
    try {
      const parsed = JSON.parse(params.categories); // array of categories
      setItemCategory(parsed.join(", ")); // show them in the input as comma-separated
      // Optionally merge into categories list
      const newCats = parsed.filter(c => !categories.includes(c));
      if (newCats.length > 0) {
        setCategories([...categories, ...newCats]);
      }
    } catch (e) {
      console.error("Failed to parse categories:", e);
    }
  }
}, [params.categories]);

const pickFromGallery = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 0.7,
  });
  if (!result.canceled) {
    const selected = result.assets.map(a => a.uri);
    setImages([...images, ...selected]);
  }
  setDialogVisible(false);
};

const captureFromCamera = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });
  if (!result.canceled) {
    setImages([...images, result.assets[0].uri]);
  }
  setDialogVisible(false);
};

const cropImage = async (uri) => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ crop: { originX: 0, originY: 0, width: 300, height: 300 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};


const uploadToCloudinary = async (uri) => {
  const data = new FormData();
  data.append("file", {
    uri,
    type: "image/jpeg",
    name: "upload.jpg",
  });
  data.append("upload_preset", "MedLink"); // set in Cloudinary dashboard
  data.append("cloud_name", "dwxchrrsl");

  const res = await fetch("https://api.cloudinary.com/v1_1/dwxchrrsl/image/upload", {
    method: "POST",
    body: data,
  });

  const json = await res.json();
  return json.secure_url; // Cloudinary hosted URL
};

 const handleSaveItem = async () => {
    try {
      let imageUrls = [];
    for (const uri of images) {
      const url = await uploadToCloudinary(uri);
      imageUrls.push(url);
    }
      await addDoc(collection(db, "products"), {
        itemName,
        itemCode,
        itemCategory,
        hsnCode,
        pricing: pricingData, // collected from PricingForm
         stock: stockData,
        images: imageUrls,  // Cloudinary URL
        createdAt: new Date(),
      });
      alert("Item saved successfully!");
      // router.back();
      router.push("/ProductList");
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item.");
    }
  };
  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/business")} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Item</Text>
      </View>
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
{/* Centered Upload Box */}
<View style={styles.imageUploadBox}>
  <TouchableOpacity style={styles.uploadBox} onPress={() => setDialogVisible(true)}>
    <Icon name="image-plus" size={40} color="#666" />
    <Text style={styles.uploadText}>Add Images</Text>
  </TouchableOpacity>

  {/* Preview Thumbnails */}
  <View style={styles.previewRow}>
    {images.map((uri, idx) => (
      <TouchableOpacity key={idx} onPress={() => setPreviewIndex(idx)}>
        <Image source={{ uri }} style={styles.previewImage} />
      </TouchableOpacity>
    ))}
  </View>
</View>

{/* Dialog for Camera/Gallery */}
<Modal visible={dialogVisible} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.dialogBox}>
      <TouchableOpacity style={styles.dialogOption} onPress={captureFromCamera}>
        <Icon name="camera" size={28} color="#006d3a" />
        <Text style={styles.dialogText}>Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dialogOption} onPress={pickFromGallery}>
        <Icon name="image" size={28} color="#006d3a" />
        <Text style={styles.dialogText}>Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dialogCancel} onPress={() => setDialogVisible(false)}>
        <Text style={styles.dialogCancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>




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
  <TouchableOpacity
    style={styles.roundButton}
    onPress={() => {
      // Generate random 11-digit number
      const randomCode = Math.floor(10000000000 + Math.random() * 90000000000).toString();
      setItemCode(randomCode);
    }}
  >
    <Text style={styles.roundButtonText}>Assign</Text>
  </TouchableOpacity>
</View>

            {/* Item Category input + button */}
{/* Item Category input (tappable with dropdown icon) */}
<View style={styles.inputRow}>
  <TouchableOpacity
    style={[styles.input, styles.categoryInput]}
    onPress={() => router.push("/AddCategory")}
    activeOpacity={0.7}
  >
    <Text style={{ color: itemCategory ? "#000" : "#999" }}>
      {itemCategory || "Item Category"}
    </Text>
    <Icon name="chevron-down" size={20} color="#666" style={styles.dropdownIcon} />
  </TouchableOpacity>
</View>



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
            {/* {activeSubTab === "pricing" && <PricingForm />} */}
            {activeSubTab === "pricing" && (
  <PricingForm pricingData={pricingData} onPricingChange={setPricingData} />
)}

{activeSubTab === "stock" && (
  <StockForm stockData={stockData} onStockChange={setStockData} />
)}

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
        <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSaveItem}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
       {/* Category Modal */}
      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onSelectCategory={setItemCategory}
      />
<Modal visible={previewIndex !== null} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      {/* Header */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Preview Image</Text>
        <TouchableOpacity onPress={() => setPreviewIndex(null)}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Full Image */}
      <Image source={{ uri: images[previewIndex] }} style={styles.fullImage} />

      {/* Footer Actions */}
      <View style={styles.modalFooter}>
         <TouchableOpacity
  style={styles.footerButton}
  onPress={async () => {
    try {
      const cropped = await ImageManipulator.manipulateAsync(
        images[previewIndex],
        [{ crop: { originX: 0, originY: 0, width: 300, height: 300 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      const updated = [...images];
      updated[previewIndex] = cropped.uri;
      setImages(updated);
    } catch (e) {
      console.log("Crop cancelled", e);
    }
  }}
>
  <Icon name="pencil" size={20} color="#006d3a" />
  <Text style={styles.footerText}>Edit</Text>
</TouchableOpacity>


        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => {
            const updated = images.filter((_, i) => i !== previewIndex);
            setImages(updated);
            setPreviewIndex(null);
          }}
        >
          <Icon name="delete" size={20} color="#cc0000" />
          <Text style={[styles.footerText, { color: "#cc0000" }]}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => {
            setPreviewIndex(null);
            setDialogVisible(true); // open camera/gallery dialog again
          }}
        >
          <Icon name="plus" size={20} color="#006d3a" />
          <Text style={styles.footerText}>Add</Text>
        </TouchableOpacity>
      </View>
       <View style={styles.previewRow}>
        {images.map((uri, idx) => (
          <TouchableOpacity key={idx} onPress={() => setPreviewIndex(idx)}>
            <Image source={{ uri }} style={styles.previewThumb} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </View>
</Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  tabRow: { flexDirection: "row", marginBottom: 16 },
  tabButton: {flex: 1,paddingVertical: 10,marginHorizontal: 4, borderRadius: 6, backgroundColor: "#eee", alignItems: "center",
  },
  activeTab: { backgroundColor: "#006d3a" },
  tabText: { fontSize: 16, fontWeight: "600", color: "#333" },
  activeTabText: { color: "#fff" },
  sectionDivider: {fontSize: 18,fontWeight: "bold",color: "#006d3a",marginBottom: 12,borderBottomWidth: 1,borderBottomColor: "#ccc",paddingBottom: 6,},
  subTabRow: { flexDirection: "row", marginBottom: 16 },
  subTabButton: {flex: 1,paddingVertical: 10,justifyContent: "center",marginHorizontal: 4,borderRadius: 6,backgroundColor: "#eee",alignItems: "center",},
  activeSubTab: { backgroundColor: "#006d3a" },
  subTabText: { fontSize: 16, fontWeight: "600", color: "#333" },
  activeSubTabText: { color: "#fff" },
   input: {flex: 1,borderWidth: 1,borderColor: "#ccc",borderRadius: 6,paddingVertical: 10,paddingHorizontal: 12,backgroundColor: "#fff",},
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  roundButton: {
    marginLeft: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 7,
    backgroundColor: "#006d3a",
    justifyContent: "center",
    alignItems: "center",
  },
  roundButtonText: { color: "#fff", fontWeight: "bold", fontSize: 12 },

  stickyButtonRow: {flexDirection: "row",justifyContent: "space-between",padding: 16,borderTopWidth: 1,borderTopColor: "#ccc",  backgroundColor: "#fff",position: "absolute",bottom: 0,left: 0,right: 0,
  },
  button: { flex: 1, padding: 12, borderRadius: 6, alignItems: "center", marginHorizontal: 5 },
  cancel: { backgroundColor: "#cc0000" },
  save: { backgroundColor: "#006d3a" },
  buttonText: { color: "#fff", fontWeight: "bold" },
   categoryInput: {
    // width:"90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  imageRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 12,
},
itemImage: {
  width: 80,
  height: 80,
  borderRadius: 6,
  marginRight: 12,
},
placeholderImage: {
  width: 80,
  height: 80,
  borderRadius: 6,
  marginRight: 12,
  backgroundColor: "#eee",
  justifyContent: "center",
  alignItems: "center",
},
imageUploadBox: {
  alignItems: "center",
  marginVertical: 16,
},
uploadBox: {
  width: 120, height: 120,
  borderWidth: 1, borderColor: "#ccc",
  borderRadius: 8, justifyContent: "center", alignItems: "center",
  backgroundColor: "#f9f9f9",
},
// uploadBox: {
//   flexDirection: "row",
//   justifyContent: "space-around",
//   width: 220,
//   padding: 12,
//   borderWidth: 1,
//   borderColor: "#ccc",
//   borderRadius: 8,
//   backgroundColor: "#f9f9f9",
// },
iconButton: {
  alignItems: "center",
},
uploadText: {
  fontSize: 12,
  color: "#666",
  marginTop: 6,
},
previewRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 12,
},
previewImage: {
  width: 60,
  height: 60,
  borderRadius: 6,
  margin: 4,
},
previewWrapper: {
  position: "relative",
  margin: 4,
},
removeIcon: {
  position: "absolute",
  top: -6,
  right: -6,
  backgroundColor: "#fff",
  borderRadius: 10,
},

modalOverlay: { flex: 1,   justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
dialogBox: { backgroundColor: "#fff", borderRadius: 8, padding: 20, width: 220 },
dialogOption: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
dialogText: { marginLeft: 8, fontSize: 16, color: "#333" },
dialogCancel: { marginTop: 10, alignItems: "center" },
dialogCancelText: { color: "#cc0000", fontWeight: "bold" },
modalBox: {
  width: "95%",
  backgroundColor: "#fff",
  borderRadius: 8,
  padding: 12,
},
modalHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
},
modalTitle: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#006d3a",
},

fullImageBox: { backgroundColor: "#fff", borderRadius: 8, padding: 12, alignItems: "center" },
fullImage: { width: 320, height: 250,  borderRadius: 7,
  marginBottom: 12, },
fullImageActions: { flexDirection: "row", marginTop: 12 },
modalFooter: {
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: 8,
},
footerButton: {
  alignItems: "center",
},
footerText: {
  fontSize: 14,
  marginTop: 4,
  color: "#333",
},
actionButton: { marginHorizontal: 10 },
actionText: { fontSize: 16, color: "#006d3a", fontWeight: "bold" },
previewRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 12,
},
previewThumb: {
  width: 50,
  height: 50,
  borderRadius: 6,
  margin: 4,
},
 header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#006d3a", // your green theme
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});















