import React, { useState } from "react";
import { StyleSheet, View, ImageBackground, Text, Image } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../app/helpers/firebaseConfig";
import { useRouter } from "expo-router";

import NammagramLogo from "../app/assets/ng-logo.png";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Please check your inbox.");
      router.push("/Login");
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
        
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subtitle}>Forgot Password</Text>

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />

          <Button
            mode="contained"
            style={styles.resetButton}
            contentStyle={{ borderRadius: 8 }}
            onPress={handleReset}
          >
            Send Reset Email
          </Button>

          <Text style={styles.footer}>
            Remembered your password?{" "}
            <Text style={styles.link} onPress={() => router.push("/Login")}>
              Login
            </Text>
          </Text>
        </Card.Content>
      </Card>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  header: { alignItems: "center",},
  logo: { width: 150, height: 100, },
  appTitle: { fontSize: 28, fontWeight: "bold", color: "#006d3a" },
  card: { width: "100%", backgroundColor: "#fff", borderRadius: 12, paddingVertical: 10, elevation: 4 },
  subtitle: { fontSize: 20, fontWeight: "600", color: "#006d3a", textAlign: "center", marginBottom: 20 },
  input: { marginBottom: 15 },
  resetButton: { backgroundColor: "#006d3a", width: "100%", marginTop: 10, borderRadius: 8 },
  footer: { textAlign: "center", marginTop: 20, color: "#333", fontSize: 14 },
  link: { color: "#006d3a", fontWeight: "bold" },
});


