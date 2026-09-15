import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";

export default function ImageUploadBox({ images, setImages }) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);

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

  return (
    <View style={styles.imageUploadBox}>
      {/* Upload Box */}
      <TouchableOpacity style={styles.uploadBox} onPress={() => setDialogVisible(true)}>
        <Icon name="image-plus" size={40} color="#666" />
        <Text style={styles.uploadText}>Add Images</Text>
      </TouchableOpacity>

      {/* Preview Thumbnails */}
      <View style={styles.previewRow}>
        {images.map((uri, idx) => (
          <TouchableOpacity key={idx} onPress={() => setPreviewIndex(idx)}>
            <Image source={{ uri }} style={styles.previewImage} />
            <View style={styles.editIcon}>
              <Icon name="pencil" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        ))}
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

      {/* Full Image Preview */}
      <Modal visible={previewIndex !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Preview Image</Text>
              <TouchableOpacity onPress={() => setPreviewIndex(null)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Image source={{ uri: images[previewIndex] }} style={styles.fullImage} />
            <View style={styles.modalFooter}>
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
                onPress={() => setPreviewIndex(null)}
              >
                <Icon name="close" size={20} color="#006d3a" />
                <Text style={styles.footerText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  imageUploadBox: { alignItems: "center", marginVertical: 16 },
  uploadBox: {
    width: 120, height: 120,
    borderWidth: 1, borderColor: "#ccc",
    borderRadius: 8, justifyContent: "center", alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  uploadText: { fontSize: 12, color: "#666", marginTop: 6 },
  previewRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 12 },
  previewImage: { width: 80, height: 80, borderRadius: 6, margin: 4 },
  editIcon: {
    position: "absolute", top: 4, right: 4,
    backgroundColor: "#006d3a", borderRadius: 10, padding: 3,
  },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  dialogBox: { backgroundColor: "#fff", borderRadius: 8, padding: 20, width: 220 },
  dialogOption: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  dialogText: { marginLeft: 8, fontSize: 16, color: "#333" },
  dialogCancel: { marginTop: 10, alignItems: "center" },
  dialogCancelText: { color: "#cc0000", fontWeight: "bold" },
  modalBox: { width: "95%", backgroundColor: "#fff", borderRadius: 8, padding: 12 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  modalTitle: { fontSize: 16, fontWeight: "bold", color: "#006d3a" },
  fullImage: { width: 320, height: 250, borderRadius: 7, marginBottom: 12 },
  modalFooter: { flexDirection: "row", justifyContent: "space-around", marginTop: 8 },
  footerButton: { alignItems: "center" },
  footerText: { fontSize: 14, marginTop: 4, color: "#333" },
});
