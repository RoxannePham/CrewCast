import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="gigs">
        <Icon sf={{ default: "briefcase", selected: "briefcase.fill" }} />
        <Label>Gigs</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="post">
        <Icon sf={{ default: "plus.circle.fill", selected: "plus.circle.fill" }} />
        <Label>Post</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="crew">
        <Icon sf={{ default: "person.2", selected: "person.2.fill" }} />
        <Label>Crew</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const isWeb = Platform.OS === "web";
  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accentPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : "#F6F1E8",
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: "#E6DED1",
          elevation: 0,
          height: isWeb ? 84 : 60 + insets.bottom,
          paddingBottom: isWeb ? 0 : insets.bottom,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "#F6F1E8" }]} />
          ) : null,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter_500Medium",
          marginTop: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gigs"
        options={{
          title: "Gigs",
          tabBarIcon: ({ color }) => (
            <Ionicons name="briefcase-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "",
          tabBarIcon: () => (
            <View style={styles.fabWrapper}>
              <LinearGradient
                colors={["#FF8F9B", "#FF5E73"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fabMini}
              >
                <Ionicons name="add" size={26} color="#fff" />
              </LinearGradient>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="crew"
        options={{
          title: "Crew",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="discussions" options={{ href: null }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}

const styles = StyleSheet.create({
  fabWrapper: {
    bottom: 6,
  },
  fabMini: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
