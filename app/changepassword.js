import React, { useState } from "react";
import { StyleSheet, View, ImageBackground, Text, Image } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { updatePassword } from "firebase/auth";
import { auth } from "../app/helpers/firebaseConfig";
import { useRouter } from "expo-router";

import NammagramLogo from "../app/assets/Nammagram.png";

export default function ChangePasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        alert("Password updated successfully!");
        router.push("/(tabs)/home");
      } else {
        alert("You must be logged in to change your password.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../app/assets/login_bg.png")}
      style={styles.background}
    >
      <View style={styles.header}>
        <Image source={NammagramLogo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appTitle}>Nammagram</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subtitle}>Change Password</Text>

          <TextInput
            label="New Password"
            mode="outlined"
            secureTextEntry={!showNew}
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showNew ? "eye-off" : "eye"}
                onPress={() => setShowNew(!showNew)}
              />
            }
          />
          <TextInput
            label="Confirm New Password"
            mode="outlined"
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock-check" />}
            right={
              <TextInput.Icon
                icon={showConfirm ? "eye-off" : "eye"}
                onPress={() => setShowConfirm(!showConfirm)}
              />
            }
          />

          <Button
            mode="contained"
            style={styles.updateButton}
            contentStyle={{ borderRadius: 8 }}
            onPress={handleUpdatePassword}
          >
            Update Password
          </Button>
        </Card.Content>
      </Card>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  header: { alignItems: "center", marginBottom: 20 },
  logo: { width: 80, height: 80, marginBottom: 10 },
  appTitle: { fontSize: 28, fontWeight: "bold", color: "#006d3a" },
  card: { width: "100%", backgroundColor: "#fff", borderRadius: 12, paddingVertical: 20, elevation: 4 },
  subtitle: { fontSize: 20, fontWeight: "600", color: "#006d3a", textAlign: "center", marginBottom: 20 },
  input: { marginBottom: 15 },
  updateButton: { backgroundColor: "#006d3a", width: "100%", marginTop: 10, borderRadius: 8 },
});
