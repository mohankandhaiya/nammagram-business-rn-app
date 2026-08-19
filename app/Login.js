 import React, { useState } from "react";
  import { StyleSheet,View, ImageBackground, Text, Image, TouchableOpacity } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
 import { signInWithEmailAndPassword } from "firebase/auth";
 import { auth } from "../app/helpers/firebaseConfig";
import { useRouter } from "expo-router";

// ✅ Import your existing Nammagram logo
import LoginBackground from "../app/assets/login_bg.png";
import NammagramLogo from "../app/assets/ng-logo.png";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.emailVerified) {
        router.replace("/(tabs)/Dashboard");
      } else {
        alert("Please verify your email before logging in.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ImageBackground
       source={LoginBackground}
      style={styles.background}
    >
      {/* Logo + Title outside card */}
      <View style={styles.header}>
        <Image source={NammagramLogo} style={styles.logo} resizeMode="contain" />
        {/* <Text style={styles.appTitle}>Nammagram</Text> */}
      </View>

      {/* Card containing form */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subtitle}>Login</Text>

          {/* Email Input */}
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />

          {/* Password Input with show/hide icon */}
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

          {/* Forgot Password */}
         <TouchableOpacity style={styles.forgotContainer} onPress={() => router.push("/forgotpassword")}>
  <Text style={styles.forgot}>Forgot Password?</Text>
</TouchableOpacity>


          {/* Login Button */}
          <Button
            mode="contained"
            style={styles.loginButton}
            contentStyle={{ borderRadius: 8 }}
            onPress={handleLogin}
          >
            Login
          </Button>

          {/* Footer */}
          <Text style={styles.footer}>
            Don’t have an account?{" "}
            <Text style={styles.link} onPress={() => router.push("/Register")}>
              Sign Up
            </Text>
          </Text>
        </Card.Content>
      </Card>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  header: { alignItems: "center", },
  logo: { width: 150, height: 100 },
  // appTitle: { fontSize: 28, fontWeight: "bold", color: "#006d3a" },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 10,
    elevation: 4,
  },
  subtitle: { fontSize: 20, fontWeight: "600", color: "#006d3a", textAlign: "center", marginBottom: 20, },
  input: { marginBottom: 15 },
  forgotContainer: { width: "100%", alignItems: "flex-end" },
  forgot: { color: "#006d3a", marginBottom: 10 },
  loginButton: { backgroundColor: "#006d3a", width: "100%", marginTop: 10, borderRadius: 8 },
  footer: { textAlign: "center", marginTop: 20, color: "#333", fontSize: 14 },
  link: { color: "#006d3a", fontWeight: "bold" },
});










