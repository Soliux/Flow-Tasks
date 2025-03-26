import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTodos } from "@/context/TodoContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { Todo } from "@/types/todo";

export default function TodoListScreen() {
  const { todos, toggleTodo } = useTodos();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { completedTasks, uncompletedTasks } = useMemo(() => {
    return {
      completedTasks: todos.filter((todo) => todo.completed),
      uncompletedTasks: todos.filter((todo) => !todo.completed),
    };
  }, [todos]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const TaskItem = ({ todo }: { todo: Todo }) => (
    <TouchableOpacity
      key={todo.id}
      style={[
        styles.todoItem,
        {
          backgroundColor: isDark ? "#2a2a2a" : "#fff",
          borderLeftColor: todo.color,
        },
      ]}
      onPress={() => toggleTodo(todo.id)}
    >
      <View style={styles.todoContent}>
        <Text
          style={[
            styles.todoTitle,
            {
              color: Colors[colorScheme ?? "light"].text,
              textDecorationLine: todo.completed ? "line-through" : "none",
              opacity: todo.completed ? 0.6 : 1,
            },
          ]}
        >
          {todo.title}
        </Text>
        <Text
          style={[
            styles.todoTime,
            {
              color: isDark ? "#888" : "#666",
              opacity: todo.completed ? 0.6 : 1,
            },
          ]}
        >
          {formatDate(todo.time)}
        </Text>
      </View>
      <View
        style={[
          styles.checkbox,
          { borderColor: todo.color },
          todo.completed && { backgroundColor: todo.color },
        ]}
      >
        {todo.completed && (
          <Ionicons name="checkmark" size={16} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );

  if (todos.length === 0) {
    return (
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.emptyContainer}>
          <Ionicons
            name="list-circle-outline"
            size={80}
            color={isDark ? "#666" : "#ccc"}
          />
          <Text
            style={[
              styles.emptyTitle,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            No tasks yet
          </Text>
          <Text style={[styles.emptyText, { color: isDark ? "#888" : "#666" }]}>
            Add some tasks to get started with your day
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.listContainer}>
        {uncompletedTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="time-outline"
                size={24}
                color={Colors[colorScheme ?? "light"].text}
              />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
              >
                In Progress
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{uncompletedTasks.length}</Text>
              </View>
            </View>
            {uncompletedTasks.map((todo) => (
              <TaskItem key={todo.id} todo={todo} />
            ))}
          </View>
        )}

        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color={Colors[colorScheme ?? "light"].text}
              />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
              >
                Completed
              </Text>
              <View style={[styles.badge, { backgroundColor: "#4CAF50" }]}>
                <Text style={styles.badgeText}>{completedTasks.length}</Text>
              </View>
            </View>
            {completedTasks.map((todo) => (
              <TaskItem key={todo.id} todo={todo} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  listContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
  },
  badge: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  todoItem: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  todoContent: {
    flex: 1,
    marginRight: 12,
  },
  todoTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
  },
  todoTime: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
