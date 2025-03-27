import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
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
  const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null);
  const [timerTodos, setTimerTodos] = useState<Todo[]>([]);
  const [now, setNow] = useState(new Date());

  // Update timerTodos and now every second
  useEffect(() => {
    const timerTasks = todos.filter(
      (todo) => todo.isTimerTask && !todo.completed
    );
    setTimerTodos(timerTasks);

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [todos]);

  const { completedTasks, uncompletedTasks } = useMemo(() => {
    // Regular tasks (non-timer)
    const regularTasks = todos.filter((todo) => !todo.isTimerTask);

    return {
      completedTasks: regularTasks.filter((todo) => todo.completed),
      uncompletedTasks: regularTasks.filter((todo) => !todo.completed),
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

  const formatTimerDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTimeRemaining = (todo: Todo) => {
    if (!todo.timerStartTime || !todo.timerDuration) return 0;

    const startTime = new Date(todo.timerStartTime).getTime();
    const currentTime = now.getTime();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    const remainingSeconds = Math.max(0, todo.timerDuration - elapsedSeconds);

    // Auto-complete the task if the timer is done
    if (remainingSeconds === 0 && !todo.completed) {
      toggleTodo(todo.id);
    }

    return remainingSeconds;
  };

  const getTimerProgress = (todo: Todo) => {
    if (!todo.timerDuration) return 0;
    const remaining = getTimeRemaining(todo);
    return 1 - remaining / todo.timerDuration;
  };

  const TaskItem = ({ todo }: { todo: Todo }) => {
    const isExpanded = expandedTodoId === todo.id;
    const hasDescription = todo.description && todo.description.length > 0;

    return (
      <TouchableOpacity
        key={todo.id}
        style={[
          styles.todoItem,
          {
            backgroundColor: isDark ? "#2a2a2a" : "#fff",
            borderLeftColor: todo.color,
          },
        ]}
        onPress={() => {
          if (hasDescription) {
            setExpandedTodoId(isExpanded ? null : todo.id);
          } else {
            toggleTodo(todo.id);
          }
        }}
        onLongPress={() => toggleTodo(todo.id)}
      >
        <View style={styles.todoContent}>
          <View style={styles.todoHeader}>
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
          </View>

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

          {hasDescription && isExpanded && (
            <View style={styles.descriptionContainer}>
              <Text
                style={[
                  styles.description,
                  {
                    color: Colors[colorScheme ?? "light"].text,
                    opacity: todo.completed ? 0.6 : 0.9,
                  },
                ]}
              >
                {todo.description}
              </Text>
            </View>
          )}

          {hasDescription && !isExpanded && (
            <View style={styles.expandIndicator}>
              <Ionicons
                name="chevron-down"
                size={16}
                color={isDark ? "#888" : "#666"}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: isDark ? "#888" : "#666",
                  marginLeft: 4,
                }}
              >
                View details
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const TimerTaskItem = ({ todo }: { todo: Todo }) => {
    const remaining = getTimeRemaining(todo);
    const progress = getTimerProgress(todo);

    return (
      <View
        style={[
          styles.timerItem,
          {
            backgroundColor: isDark ? "#2a2a2a" : "#fff",
            borderColor: todo.color,
          },
        ]}
      >
        <View style={styles.timerHeader}>
          <Text
            style={[
              styles.timerTitle,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            {todo.title}
          </Text>
          <TouchableOpacity
            style={[styles.timerCheckbox, { borderColor: todo.color }]}
            onPress={() => toggleTodo(todo.id)}
          />
        </View>

        <View style={styles.timerProgressContainer}>
          <View
            style={[
              styles.timerProgressBar,
              { backgroundColor: isDark ? "#444" : "#eee" },
            ]}
          >
            <View
              style={[
                styles.timerProgress,
                {
                  backgroundColor: todo.color,
                  width: `${progress * 100}%`,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.timerText,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            {formatTimerDuration(remaining)}
          </Text>
        </View>
      </View>
    );
  };

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

        {timerTodos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="timer-outline"
                size={24}
                color={Colors[colorScheme ?? "light"].text}
              />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
              >
                Timers
              </Text>
              <View style={[styles.badge, { backgroundColor: "#FF9800" }]}>
                <Text style={styles.badgeText}>{timerTodos.length}</Text>
              </View>
            </View>
            {timerTodos.map((todo) => (
              <TimerTaskItem key={todo.id} todo={todo} />
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
    alignItems: "flex-start",
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
  },
  todoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
    flex: 1,
  },
  todoTime: {
    fontSize: 14,
    marginBottom: 8,
  },
  descriptionContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  expandIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  timerItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  timerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  timerCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  timerProgressContainer: {
    alignItems: "center",
  },
  timerProgressBar: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  timerProgress: {
    height: "100%",
  },
  timerText: {
    fontSize: 20,
    fontWeight: "600",
  },
});
