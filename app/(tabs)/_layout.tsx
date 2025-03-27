import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { HapticTab } from "@/components/HapticTab";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerStyle: {
          backgroundColor: isDark ? "#1a1a27" : "#f5f7ff",
        },
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 20,
        },
        headerShadowVisible: false,
        headerTitleAlign: "left",
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 10,
          height: Platform.OS === "ios" ? 90 : 70,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Flow Tasks",
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <FontAwesome
                name="tasks"
                size={24}
                color={isDark ? "#7868e6" : "#6558d1"}
                style={styles.headerIcon}
              />
              <Text
                style={[
                  styles.headerTitle,
                  { color: isDark ? "#ffffff" : "#2d2d3a" },
                ]}
              >
                Flow
                <Text
                  style={[
                    styles.headerAccent,
                    { color: isDark ? "#7868e6" : "#6558d1" },
                  ]}
                >
                  Tasks
                </Text>
              </Text>
            </View>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={26} color={color} />
          ),
          tabBarLabel: "Tasks",
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add Task",
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Text
                style={[
                  styles.headerTitle,
                  { color: isDark ? "#ffffff" : "#2d2d3a" },
                ]}
              >
                New{" "}
                <Text
                  style={[
                    styles.headerAccent,
                    { color: isDark ? "#7868e6" : "#6558d1" },
                  ]}
                >
                  Task
                </Text>
              </Text>
            </View>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={26} color={color} />
          ),
          tabBarLabel: "Add",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  headerAccent: {
    fontWeight: "900",
  },
});
