import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: isDark ? "#1a1a1a" : "#f8f8f8",
        },
        headerTitle: () => null,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: Colors[colorScheme ?? "light"].background,
            borderTopWidth: 0,
            elevation: 0,
            height: 85,
            paddingBottom: 30,
          },
          default: {
            height: 60,
            paddingBottom: 10,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: () => (
            <View style={{ paddingLeft: 8 }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  color: isDark ? "#fff" : "#333",
                }}
              >
                My Tasks
              </Text>
            </View>
          ),
          tabBarLabel: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          headerTitle: () => (
            <View style={{ paddingLeft: 8 }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  color: isDark ? "#fff" : "#333",
                }}
              >
                Create Task
              </Text>
            </View>
          ),
          tabBarLabel: "Add",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
