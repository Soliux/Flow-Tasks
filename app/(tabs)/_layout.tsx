import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { HapticTab } from "@/components/HapticTab";
import { BlurView } from "expo-blur";

// Custom TabBar component for a more modern look
function CustomTabBar({ state, descriptors, navigation }: any) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          backgroundColor: isDark
            ? "rgba(26, 26, 39, 0.98)"
            : "rgba(255, 255, 255, 0.98)",
          borderTopColor: isDark
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.05)",
        },
      ]}
    >
      <BlurView
        intensity={80}
        tint={isDark ? "dark" : "light"}
        style={styles.tabBarBlur}
      >
        <View style={styles.tabBar}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel || options.title || route.name;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Get icon component from the options
            const IconComponent = options.tabBarIcon
              ? options.tabBarIcon({
                  color: isFocused
                    ? isDark
                      ? "#7868e6"
                      : "#6558d1"
                    : isDark
                    ? "#888"
                    : "#aaa",
                  size: 24,
                })
              : null;

            return (
              <HapticTab
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                style={styles.tabItem}
              >
                <View style={styles.tabItemContent}>
                  {IconComponent}
                  <Text
                    style={[
                      styles.tabLabel,
                      {
                        color: isFocused
                          ? isDark
                            ? "#7868e6"
                            : "#6558d1"
                          : isDark
                          ? "#888"
                          : "#aaa",
                        opacity: isFocused ? 1 : 0.8,
                      },
                    ]}
                  >
                    {label}
                  </Text>

                  {isFocused && (
                    <View
                      style={[
                        styles.tabIndicator,
                        { backgroundColor: isDark ? "#7868e6" : "#6558d1" },
                      ]}
                    />
                  )}
                </View>
              </HapticTab>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

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
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
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
            <Ionicons name="home-outline" size={24} color={color} />
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
            <Ionicons name="add-circle-outline" size={24} color={color} />
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
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 90 : 65,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  tabBarBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBar: {
    flexDirection: "row",
    height: "100%",
    paddingBottom: Platform.OS === "ios" ? 30 : 0,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  tabItemContent: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingTop: 3,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },
  tabIndicator: {
    position: "absolute",
    bottom: -10,
    width: 20,
    height: 3,
    borderRadius: 1.5,
  },
});
