import { Drawer } from "expo-router/drawer";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerStyle: { backgroundColor: "#006d3a", width: 240 },
        drawerLabelStyle: { color: "#fff" },
      }}
    >
      {/* Tabs inside Drawer */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Main Tabs",
          title: "Dashboard",
        }}
      />
      {/* Extra Drawer Items */}
      <Drawer.Screen name="coupons" options={{ drawerLabel: "Coupons" }} />
      <Drawer.Screen name="users" options={{ drawerLabel: "Users" }} />
      <Drawer.Screen name="businesssettings" options={{ drawerLabel: "Business Settings" }} />
    </Drawer>
  );
}
