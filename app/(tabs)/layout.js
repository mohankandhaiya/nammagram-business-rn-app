import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
       <Tabs.Screen name="home" options={{ title: "Home" }} /> 
      <Tabs.Screen name="wallet" options={{ title: "Wallet" }} />
      <Tabs.Screen name="jobs" options={{ title: "Jobs" }} />
      <Tabs.Screen name="post" options={{ title: "Post" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      <Tabs.Screen name="business" options={{ title: "Business" }} />
      <Tabs.Screen name="orders" options={{ title: "Orders" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="Dashboard" options={{ title: "dashboard" }} />
          <Tabs.Screen name="AddItem" options={{ title: "Additem" }} />
             <Tabs.Screen name="AddItemUnit" options={{ title: "Additemunit" }} />
      <Tabs.Screen name="JobDetails" options={{ title: "JobsDetails" }} />
    </Tabs>
  );
}


