import React from "react";
 import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ title: "Login" }} />
          <Stack.Screen name="register" options={{ title: "Register" }} />
          <Stack.Screen name="(tabs)" options={{ title: "Home" }} />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

