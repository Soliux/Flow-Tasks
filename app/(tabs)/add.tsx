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
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useTodos } from "@/context/TodoContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
            >
              Task Title
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? "#2a2a2a" : "#f5f5f5",
                  color: Colors[colorScheme ?? "light"].text,
                },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              placeholderTextColor={isDark ? "#888" : "#666"}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
            >
              Description (optional)
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: isDark ? "#2a2a2a" : "#f5f5f5",
                  color: Colors[colorScheme ?? "light"].text,
                },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add details about your task..."
              placeholderTextColor={isDark ? "#888" : "#666"}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.switchContainer}>
            <Text
              style={[
                styles.label,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
            >
              Timer Task
            </Text>
            <Switch
              value={isTimerTask}
              onValueChange={setIsTimerTask}
              trackColor={{ false: "#767577", true: selectedColor }}
              thumbColor={isTimerTask ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>

          {isTimerTask ? (
            <View style={styles.timerContainer}>
              <Text
                style={[
                  styles.timerLabel,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
              >
                Duration: {formatTimerDuration(timerDuration)}
              </Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={5}
                maximumValue={300}
                step={5}
                value={timerDuration}
                onValueChange={setTimerDuration}
                minimumTrackTintColor={selectedColor}
                maximumTrackTintColor={isDark ? "#555" : "#ddd"}
                thumbTintColor={selectedColor}
              />
            </View>
          ) : (
            <>
              <View style={styles.section}>
                <Text
                  style={[
                    styles.label,
                    { color: Colors[colorScheme ?? "light"].text },
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
                        <Ionicons name="checkmark" size={20} color="white" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text
                  style={[
                    styles.label,
                    { color: Colors[colorScheme ?? "light"].text },
                  ]}
                >
                  Due Date & Time
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    { backgroundColor: isDark ? "#2a2a2a" : "#f5f5f5" },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].text}
                  />
                  <Text
                    style={[
                      styles.dateText,
                      { color: Colors[colorScheme ?? "light"].text },
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

        <TouchableOpacity
          style={[styles.button, { backgroundColor: selectedColor }]}
          onPress={handleSubmit}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Create Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
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
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textArea: {
    height: 100,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
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
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    shadowRadius: 5.46,
    elevation: 9,
    flexDirection: "row",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});
