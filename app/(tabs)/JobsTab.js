import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from "react-native";
import { db } from "../helpers/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  doc,setDoc
} from "firebase/firestore";
import JobDetailModal from "../components/JobDetailModal";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function JobsTab({ jobs, setJobs, jobDialogVisible, setJobDialogVisible }) {
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  // Form fields
  const [newRole, setNewRole] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newExperience, setNewExperience] = useState("");
  const [newSalary, setNewSalary] = useState("");
  const [newTags, setNewTags] = useState("");
  const [editJobId, setEditJobId] = useState(null);
   const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
const TEST_USER_ID = "testUser123";
  // 🔄 Real-time listener
  useEffect(() => {
    const q = collection(db, "jobs");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedJobs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(fetchedJobs);
    });
    return () => unsubscribe();
  }, []);

  // ➕ Add job
  const addJob = async () => {
    if (!newRole || !newCompany) return;
    await addDoc(collection(db, "jobs"), {
      role: newRole,
      company: newCompany,
      description:newDescription,
      tags: newTags ? newTags.split(",") : [],
      location: newLocation,
      experience: newExperience,
      salary: newSalary,
      applicants: 0,
      status: "Open",
      posted: serverTimestamp(),
    });
    resetForm();
    setJobDialogVisible(false);
  };

  // ✏️ Open edit dialog
  const openEditDialog = (job) => {
    setEditJobId(job.id);
    setNewRole(job.role);
    setNewCompany(job.company);
    setNewLocation(job.location);
    setNewExperience(job.experience);
    setNewSalary(job.salary);
    setNewTags(job.tags.join(","));
    setEditDialogVisible(true);
  };

  // 💾 Save edit
  const saveEdit = async () => {
    if (!editJobId) return;
    const jobRef = doc(db, "jobs", editJobId);
    await updateDoc(jobRef, {
      role: newRole,
      company: newCompany,
      description:newDescription,
      tags: newTags ? newTags.split(",") : [],
      location: newLocation,
      experience: newExperience,
      salary: newSalary,
    });
    resetForm();
    setEditDialogVisible(false);
    setEditJobId(null);
  };

  // 🗑️ Delete job
  const deleteJob = async (jobId) => {
    await deleteDoc(doc(db, "jobs", jobId));
  };

  const resetForm = () => {
    setNewRole(""); setNewCompany(""); setNewLocation("");
    setNewExperience(""); setNewSalary(""); setNewTags("");
  };

  // Format relative posted time
  const formatPosted = (posted) => {
    if (!posted) return "";
    const now = Date.now();
    const created = posted.seconds * 1000;
    const diffMinutes = Math.floor((now - created) / 60000);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };
const handleSaveJob = async (job) => {
  const jobRef = doc(db, "users", TEST_USER_ID, "savedJobs", job.id);

  try {
    if (!job.saved) {
      // ✅ Save job
      await setDoc(jobRef, {
        ...job,
        savedAt: new Date().toISOString(),
      });
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, saved: true } : j))
      );
    } else {
      // ✅ Remove job
      await deleteDoc(jobRef);
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, saved: false } : j))
      );
    }
  } catch (error) {
    console.error("Error saving job:", error);
  }
};
 const openJobDetail = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const closeJobDetail = () => {
    setSelectedJob(null);
    setModalVisible(false);
  };
 return (
  <View style={{ flex: 1 }}>
    {/* <Text style={styles.cardTitle}>Jobs Posted</Text> */}
<>
   {Array.isArray(jobs) && jobs.length > 0 ? (
  jobs.map((job) => (
    <TouchableOpacity
      key={job.id}
      style={styles.jobCard}
      activeOpacity={0.9}
      onPress={() => openJobDetail(job)} // ✅ open modal when card tapped
    >
      {/* Top row: role + edit/delete */}
      <View style={styles.topRow}>
        <Text style={styles.jobRole}>{job.role}</Text>
        <View style={styles.topRightIcons}>
          <TouchableOpacity onPress={() => openEditDialog(job)}>
            <Icon name="pencil" size={20} color="#006d3a" style={styles.smallIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteJob(job.id)}>
            <Icon name="delete" size={20} color="#cc0000" style={styles.smallIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Company */}
      <Text style={styles.jobCompany}>{job.company}</Text>

      {/* Tags */}
      <View style={styles.tagRow}>
        {Array.isArray(job.tags) &&
          job.tags.map((tag, idx) => (
            <Text key={idx} style={styles.tag}>
              {tag}
            </Text>
          ))}
      </View>

      {/* Location + Experience */}
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Icon name="map-marker" size={16} color="#006d3a" />
          <Text style={styles.jobDetail}>{job.location}</Text>
        </View>
        <View style={styles.rowItem}>
          <Icon name="briefcase" size={16} color="#006d3a" />
          <Text style={styles.jobDetail}>{job.experience}</Text>
        </View>
      </View>

      {/* Salary */}
      <View style={styles.rowItem}>
        <Icon name="currency-inr" size={16} color="#006d3a" />
        <Text style={styles.jobDetail}>{job.salary}</Text>
      </View>

      {/* Posted time */}
      {job.posted && (
        <Text style={styles.postedTime}>{formatPosted(job.posted)}</Text>
      )}

      {/* Bottom row: Save icon */}
      {/* <View style={styles.bottomRow}>
        <TouchableOpacity onPress={() => handleSaveJob(job)} style={styles.saveButton}>
          <Icon
            name={job.saved ? "bookmark" : "bookmark-outline"}
            size={22}
            color="#006d3a"
          />
        </TouchableOpacity>
      </View> */}
    </TouchableOpacity>
  ))
) : (
  <Text style={{ color: "#777", marginTop: 12 }}>No jobs available</Text>
)}

 {/* ✅ Job Detail Modal */}
      <JobDetailModal
        visible={modalVisible}
        job={selectedJob}
        onClose={closeJobDetail}
      />
    </>
    {/* Add Job Dialog controlled by props */}
    <Modal visible={jobDialogVisible} transparent animationType="slide">
      <View style={styles.dialogOverlay}>
        <View style={styles.dialogBox}>
          <Text style={styles.dialogTitle}>Add New Job</Text>
          <TextInput style={styles.input} placeholder="Job Role" value={newRole} onChangeText={setNewRole} />
          <TextInput style={styles.input} placeholder="Company" value={newCompany} onChangeText={setNewCompany} />
          <TextInput style={styles.input} placeholder="Location" value={newLocation} onChangeText={setNewLocation} />
          <TextInput style={styles.input} placeholder="Experience (e.g. 0-1 Yrs)" value={newExperience} onChangeText={setNewExperience} />
          <TextInput style={styles.input} placeholder="Salary (e.g. ₹ 2-3 Lacs P.A.)" value={newSalary} onChangeText={setNewSalary} />
          <TextInput style={styles.input} placeholder="Tags (comma separated)" value={newTags} onChangeText={setNewTags} />
 {/* ✅ New Description Field */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Job Description"
        value={newDescription}
        onChangeText={setNewDescription}
        multiline
      />
          <TouchableOpacity style={styles.button} onPress={addJob}>
            <Text style={styles.buttonText}>Save Job</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => setJobDialogVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    {/* Edit Job Dialog */}
    <Modal visible={editDialogVisible} transparent animationType="slide">
      <View style={styles.dialogOverlay}>
        <View style={styles.dialogBox}>
          <Text style={styles.dialogTitle}>Edit Job</Text>
          <TextInput style={styles.input} placeholder="Job Role" value={newRole} onChangeText={setNewRole} />
          <TextInput style={styles.input} placeholder="Company" value={newCompany} onChangeText={setNewCompany} />
          <TextInput style={styles.input} placeholder="Location" value={newLocation} onChangeText={setNewLocation} />
          <TextInput style={styles.input} placeholder="Experience" value={newExperience} onChangeText={setNewExperience} />
          <TextInput style={styles.input} placeholder="Salary" value={newSalary} onChangeText={setNewSalary} />
          <TextInput style={styles.input} placeholder="Tags" value={newTags} onChangeText={setNewTags} />
 {/* ✅ New Description Field */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Job Description"
        value={newDescription}
        onChangeText={setNewDescription}
        multiline
      />
          <TouchableOpacity style={styles.button} onPress={saveEdit}>
            <Text style={styles.buttonText}>Update Job</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => setEditDialogVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
);
}
const styles = StyleSheet.create({
  cardTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#006d3a", 
    marginBottom: 8 
  },
  jobCard: { 
    marginTop: 12, 
    padding: 11, 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    elevation: 3 
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  jobRole: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#006d3a" 
  },
  jobCompany: { 
    fontSize: 14, 
    color: "#333", 
    marginBottom: 6 
  },
  tagRow: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    marginBottom: 6 
  },
  tag: { 
    // backgroundColor: "#e0e0e0", 
     backgroundColor: "#dfece0",
     fontWeight: "600",
    borderRadius: 12, 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    marginRight: 6, 
    fontSize: 12, 
     color: "#006d3a",
  },
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 6 
  },
  rowItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginRight: 16 
  },
  jobDetail: { 
    fontSize: 13, 
    color: "#555", 
    marginLeft: 4 
  },
  postedTime: { 
    fontSize: 12, 
    color: "#777", 
    marginTop: 6 
  },
  topRightIcons: { 
    flexDirection: "row" ,
  
  
  },
  smallIcon: { 
    marginLeft: 6 
  },
  dialogOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  dialogBox: { 
    width: "85%", 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    padding: 20 
  },
  dialogTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#006d3a", 
    marginBottom: 12, 
    textAlign: "center" 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 6, 
    padding: 8, 
    marginBottom: 8 
  },
  button: { 
    backgroundColor: "#006d3a", 
    borderRadius: 6, 
    paddingVertical: 8, 
    alignItems: "center", 
    marginTop: 8 
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  cancel: { 
    backgroundColor: "#cc0000" 
  },
  bottomRow: {
  flexDirection: "row",
  justifyContent: "flex-end", // ✅ pushes save icon to bottom-right
  // marginTop: 5,
},

saveButton: {
  // padding: 2,
},
textArea: {
  height: 80,          // taller input box
  textAlignVertical: "top", // ensures text starts at top
},

});

