import React, { useState } from "react";
import { StyleSheet, View, ImageBackground, Text, Image } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../app/helpers/firebaseConfig";
import { useRouter } from "expo-router";

// ✅ Import your existing Nammagram logo
import NammagramLogo from "../app/assets/ng-logo.png";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      alert("Verification email sent! Please check your inbox.");
      router.push("/Login"); // ✅ navigate back to login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../app/assets/login_bg.png")} // ✅ use your green background
      style={styles.background}
    >
      {/* Logo + Title outside card */}
      <View style={styles.header}>
        <Image source={NammagramLogo} style={styles.logo} resizeMode="contain" />
        {/* <Text style={styles.appTitle}>Nammagram</Text> */}
      </View>

      {/* Solid Card with form */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subtitle}>Create an Account</Text>

          <TextInput
            label="Full Name"
            mode="outlined"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          <TextInput
            label="Confirm Password"
            mode="outlined"
            secureTextEntry={!showConfirm}
            value={confirm}
            onChangeText={setConfirm}
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
            style={styles.signUpButton}
            contentStyle={{ borderRadius: 8 }}
            onPress={handleRegister}
          >
            Sign Up
          </Button>

          <Text style={styles.footer}>
            Already have an account?{" "}
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
  logo: { width: 150, height: 100,  },
  appTitle: { fontSize: 28, fontWeight: "bold", color: "#006d3a" },
  card: {
    width: "100%",
    backgroundColor: "#ffffff", // ✅ solid card
    borderRadius: 12,
    paddingVertical: 10,
    elevation: 4, // ✅ subtle shadow for depth
  },
  subtitle: { fontSize: 20, fontWeight: "600", color: "#006d3a", textAlign: "center", marginBottom: 20 },
  input: { marginBottom: 15 },
  signUpButton: { backgroundColor: "#006d3a", width: "100%", marginTop: 10, borderRadius: 8 },
  footer: { textAlign: "center", marginTop: 20, color: "#333", fontSize: 14 },
  link: { color: "#006d3a", fontWeight: "bold" },
});


