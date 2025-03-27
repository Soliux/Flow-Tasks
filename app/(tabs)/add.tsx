import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Switch,
  Alert,
  StatusBar,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useTodos } from "@/context/TodoContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9B59B6",
  "#3498DB",
];

export default function AddTodoScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isTimerTask, setIsTimerTask] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60); // 60 seconds default
  const { addTodo } = useTodos();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedColor(COLORS[0]);
    setDate(new Date());
    setIsTimerTask(false);
    setTimerDuration(60);
  };

  const handleSubmit = () => {
    if (title.trim()) {
      addTodo({
        title: title.trim(),
        description: description.trim(),
        color: selectedColor,
        time: date.toISOString(),
        isTimerTask,
        timerDuration: isTimerTask ? timerDuration : undefined,
      });

      resetForm();
      Alert.alert("Success", "Task created successfully!");
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", "Task title is required");
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimerDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={[
            styles.container,
            isDark
              ? { backgroundColor: "#1f1f2c" }
              : { backgroundColor: "#f0f2ff" },
          ]}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.formSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#ffffff" : "#2d2d3a" },
              ]}
            >
              Task Details
            </Text>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.07)"
                    : "rgba(255, 255, 255, 0.8)",
                },
              ]}
            >
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    { color: isDark ? "#e9ecef" : "#3f3f52" },
                  ]}
                >
                  Task Title
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark
                        ? "rgba(0, 0, 0, 0.2)"
                        : "rgba(0, 0, 0, 0.03)",
                      color: isDark ? "#ffffff" : "#2d2d3a",
                      borderColor: isDark
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                    },
                  ]}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="What needs to be done?"
                  placeholderTextColor={
                    isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    { color: isDark ? "#e9ecef" : "#3f3f52" },
                  ]}
                >
                  Description (optional)
                </Text>
                <TextInput
                  style={[
                    styles.textArea,
                    {
                      backgroundColor: isDark
                        ? "rgba(0, 0, 0, 0.2)"
                        : "rgba(0, 0, 0, 0.03)",
                      color: isDark ? "#ffffff" : "#2d2d3a",
                      borderColor: isDark
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                    },
                  ]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add details about your task..."
                  placeholderTextColor={
                    isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"
                  }
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#ffffff" : "#2d2d3a" },
              ]}
            >
              Options
            </Text>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.07)"
                    : "rgba(255, 255, 255, 0.8)",
                },
              ]}
            >
              <View style={styles.switchContainer}>
                <View style={styles.switchLabel}>
                  <MaterialCommunityIcons
                    name="timer-outline"
                    size={22}
                    color={isDark ? selectedColor : selectedColor}
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={[
                      styles.label,
                      {
                        color: isDark ? "#e9ecef" : "#3f3f52",
                        marginBottom: 0,
                      },
                    ]}
                  >
                    Timer Task
                  </Text>
                </View>
                <Switch
                  value={isTimerTask}
                  onValueChange={setIsTimerTask}
                  trackColor={{
                    false: isDark ? "#3a3a3a" : "#d1d1d1",
                    true: selectedColor,
                  }}
                  thumbColor={"#fff"}
                />
              </View>

              {isTimerTask ? (
                <View style={styles.timerContainer}>
                  <Text
                    style={[
                      styles.timerLabel,
                      { color: isDark ? selectedColor : selectedColor },
                    ]}
                  >
                    {formatTimerDuration(timerDuration)}
                  </Text>
                  <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={5}
                    maximumValue={300}
                    step={5}
                    value={timerDuration}
                    onValueChange={setTimerDuration}
                    minimumTrackTintColor={selectedColor}
                    maximumTrackTintColor={
                      isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"
                    }
                    thumbTintColor={selectedColor}
                  />
                  <View style={styles.timerLabelsContainer}>
                    <Text
                      style={{
                        color: isDark ? "#adb5bd" : "#5a5a6e",
                        fontSize: 12,
                      }}
                    >
                      5 sec
                    </Text>
                    <Text
                      style={{
                        color: isDark ? "#adb5bd" : "#5a5a6e",
                        fontSize: 12,
                      }}
                    >
                      5 min
                    </Text>
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.section}>
                    <Text
                      style={[
                        styles.label,
                        { color: isDark ? "#e9ecef" : "#3f3f52" },
                      ]}
                    >
                      Color Tag
                    </Text>
                    <View style={styles.colorPicker}>
                      {COLORS.map((color) => (
                        <TouchableOpacity
                          key={color}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color },
                            selectedColor === color && styles.selectedColor,
                          ]}
                          onPress={() => setSelectedColor(color)}
                        >
                          {selectedColor === color && (
                            <Ionicons
                              name="checkmark"
                              size={20}
                              color="white"
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.section}>
                    <Text
                      style={[
                        styles.label,
                        { color: isDark ? "#e9ecef" : "#3f3f52" },
                      ]}
                    >
                      Due Date & Time
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.dateButton,
                        {
                          backgroundColor: isDark
                            ? "rgba(0, 0, 0, 0.2)"
                            : "rgba(0, 0, 0, 0.03)",
                          borderColor: isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                        },
                      ]}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={24}
                        color={selectedColor}
                      />
                      <Text
                        style={[
                          styles.dateText,
                          { color: isDark ? "#e9ecef" : "#3f3f52" },
                        ]}
                      >
                        {formatDate(date)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="datetime"
                      display="default"
                      onChange={(
                        event: DateTimePickerEvent,
                        selectedDate?: Date
                      ) => {
                        setShowDatePicker(Platform.OS === "ios");
                        if (selectedDate) {
                          setDate(selectedDate);
                        }
                      }}
                    />
                  )}
                </>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: selectedColor }]}
            onPress={handleSubmit}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Create Task</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  inputContainer: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  input: {
    height: 54,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 120,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  timerLabel: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  timerLabelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  colorPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 5,
  },
  selectedColor: {
    borderWidth: 0,
    transform: [{ scale: 1.1 }],
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  dateText: {
    marginLeft: 12,
    fontSize: 16,
  },
  button: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.5,
    elevation: 8,
    flexDirection: "row",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});
