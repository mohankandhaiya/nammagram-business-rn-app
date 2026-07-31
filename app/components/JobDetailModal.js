// JobDetailModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function JobDetailModal({ visible, job, onClose }) {
  if (!job) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.dialogOverlay}>
        <View style={styles.dialogBox}>
          <ScrollView>
            <Text style={styles.dialogTitle}>{job.role}</Text>
            <Text style={styles.dialogSubtitle}>{job.company}</Text>

            <View style={styles.detailRow}>
              <Icon name="map-marker" size={18} color="#006d3a" />
              <Text style={styles.detailText}>{job.location}</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="school" size={18} color="#006d3a" />
              <Text style={styles.detailText}>Experience: {job.experience}</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="currency-inr" size={18} color="#006d3a" />
              <Text style={styles.detailText}>Salary: {job.salary}</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="calendar" size={18} color="#006d3a" />
              <Text style={styles.detailText}>
                Posted: {job.posted?.toDate().toLocaleString()}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="check-circle" size={18} color="#006d3a" />
              <Text style={styles.detailText}>Status: {job.status}</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="account-group" size={18} color="#006d3a" />
              <Text style={styles.detailText}>Applicants: {job.applicants}</Text>
            </View>

            {/* Tags */}
            <View style={styles.tagContainer}>
              {job.tags?.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Icon name="tag" size={14} color="#006d3a" />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Description Section */}
            {job.description && (
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{job.description}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "80%", // allow scrolling
    elevation: 5,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#006d3a",
    marginBottom: 4,
  },
  dialogSubtitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#444",
    marginLeft: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f2e6",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: "#006d3a",
    fontWeight: "600",
    marginLeft: 4,
  },
  descriptionBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#006d3a",
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: "#006d3a",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
