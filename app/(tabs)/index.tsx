import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
} from "react-native";
import { useTodos } from "@/context/TodoContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Todo } from "@/types/todo";

const GRADIENTS = {
  dark: ["#1f1f2c", "#2d2d44"],
  light: ["#f0f2ff", "#e4e7fc"],
};

export default function TodoListScreen() {
  const { todos, toggleTodo } = useTodos();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null);
  const [timerTodos, setTimerTodos] = useState<Todo[]>([]);
  const [now, setNow] = useState(new Date());
  const completedTimerIds = useRef<Set<string>>(new Set());
  const gradientColors = isDark ? GRADIENTS.dark : GRADIENTS.light;

  // Define styles inside the component so we have access to isDark
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? GRADIENTS.dark[0] : GRADIENTS.light[0],
    },
    contentContainer: {
      padding: 16,
      paddingTop: 24,
    },
    listContainer: {
      gap: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    sectionHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      letterSpacing: 0.3,
    },
    countBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
    },
    countText: {
      fontSize: 12,
      fontWeight: "600",
    },
    todoItem: {
      borderRadius: 16,
      marginBottom: 12,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4.5,
      elevation: 5,
    },
    todoContent: {
      padding: 16,
    },
    todoHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    todoTitle: {
      fontSize: 16,
      fontWeight: "600",
      flex: 1,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 22,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    todoDescription: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 20,
    },
    descriptionContainer: {
      marginTop: 12,
    },
    viewDetailsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    timerItem: {
      marginBottom: 12,
      padding: 16,
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 6,
    },
    timerHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    timerInfo: {
      flex: 1,
    },
    timerTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 4,
    },
    timerTimeDisplay: {
      fontSize: 24,
      fontWeight: "700",
    },
    timerCheckbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    timerProgressContainer: {
      marginBottom: 12,
    },
    timerProgressBar: {
      height: 8,
      borderRadius: 4,
      overflow: "hidden",
    },
    timerProgress: {
      height: "100%",
    },
    timerDescription: {
      fontSize: 14,
      lineHeight: 20,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 100,
      opacity: 0.8,
    },
    emptyText: {
      marginTop: 16,
      fontSize: 16,
      textAlign: "center",
    },
  });

  // Update the timerTodos list
  useEffect(() => {
    // Only filter uncompleted timer tasks
    const activeTasks = todos.filter(
      (todo) => todo.isTimerTask && !todo.completed
    );
    setTimerTodos(activeTasks);

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [todos]);

  // Check for completed timers and mark them complete
  useEffect(() => {
    timerTodos.forEach((todo) => {
      const remaining = getTimeRemainingValue(todo);
      if (
        remaining === 0 &&
        !todo.completed &&
        !completedTimerIds.current.has(todo.id)
      ) {
        completedTimerIds.current.add(todo.id);
        toggleTodo(todo.id);
      }
    });
  }, [now, timerTodos, toggleTodo]);

  const { completedTasks, uncompletedTasks, completedTimerTasks } =
    useMemo(() => {
      // Regular tasks (non-timer)
      const regularTasks = todos.filter((todo) => !todo.isTimerTask);
      // Timer tasks
      const timerTasksArray = todos.filter((todo) => todo.isTimerTask);

      return {
        completedTasks: [
          ...regularTasks.filter((todo) => todo.completed),
          // Include completed timer tasks in completed section
          ...timerTasksArray.filter((todo) => todo.completed),
        ],
        uncompletedTasks: regularTasks.filter((todo) => !todo.completed),
        // Only active timer tasks
        completedTimerTasks: timerTasksArray.filter((todo) => todo.completed),
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

  // This function now just calculates the value without side effects
  const getTimeRemainingValue = (todo: Todo) => {
    if (!todo.timerStartTime || !todo.timerDuration) return 0;

    const startTime = new Date(todo.timerStartTime).getTime();
    const currentTime = now.getTime();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    return Math.max(0, todo.timerDuration - elapsedSeconds);
  };

  const getTimeRemaining = (todo: Todo) => {
    return getTimeRemainingValue(todo);
  };

  const getTimerProgress = (todo: Todo) => {
    if (!todo.timerDuration) return 0;
    const remaining = getTimeRemaining(todo);
    return 1 - remaining / todo.timerDuration;
  };

  const TaskItem = ({ todo }: { todo: Todo }) => {
    const isExpanded = expandedTodoId === todo.id;
    const hasDescription = todo.description && todo.description.length > 0;

    // Generate color with transparency for card background
    const cardBgColor = isDark
      ? `${todo.color}22` // 13% opacity for dark mode
      : `${todo.color}15`; // 8% opacity for light mode

    return (
      <TouchableOpacity
        key={todo.id}
        style={[
          styles.todoItem,
          {
            backgroundColor: cardBgColor,
            borderLeftColor: todo.color,
            borderLeftWidth: 4,
            shadowColor: todo.color,
            opacity: todo.completed ? 0.8 : 1,
            transform: [{ scale: todo.completed ? 0.98 : 1 }],
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
        activeOpacity={0.7}
      >
        <View style={styles.todoContent}>
          <View style={styles.todoHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
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

              <Text
                style={[
                  styles.todoTitle,
                  {
                    color: isDark ? "#ffffff" : "#2d2d3a",
                    textDecorationLine: todo.completed
                      ? "line-through"
                      : "none",
                    opacity: todo.completed ? 0.7 : 1,
                    marginLeft: 12,
                  },
                ]}
              >
                {todo.title}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 12,
                color: isDark ? "#adb5bd" : "#5a5a6e",
                opacity: 0.8,
              }}
            >
              {formatDate(todo.time)}
            </Text>
          </View>

          {hasDescription && (
            <View style={styles.descriptionContainer}>
              {isExpanded ? (
                <Text
                  style={[
                    styles.todoDescription,
                    { color: isDark ? "#e9ecef" : "#3f3f52" },
                  ]}
                >
                  {todo.description}
                </Text>
              ) : (
                <View style={styles.viewDetailsRow}>
                  <Ionicons
                    name="information-circle-outline"
                    size={14}
                    color={isDark ? "#adb5bd" : "#5a5a6e"}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: isDark ? "#adb5bd" : "#5a5a6e",
                      marginLeft: 4,
                    }}
                  >
                    View details
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const TimerTaskItem = ({ todo }: { todo: Todo }) => {
    const remaining = getTimeRemaining(todo);
    const progress = getTimerProgress(todo);

    const progressBarBgColor = isDark
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 0, 0, 0.08)";

    // Format remaining time
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    return (
      <View
        style={[
          styles.timerItem,
          {
            backgroundColor: `${todo.color}22`,
            borderColor: todo.color,
            borderWidth: 1,
            borderRadius: 16,
          },
        ]}
      >
        <View style={styles.timerHeader}>
          <View style={styles.timerInfo}>
            <Text
              style={[
                styles.timerTitle,
                { color: isDark ? "#ffffff" : "#2d2d3a" },
              ]}
            >
              {todo.title}
            </Text>

            <Text style={[styles.timerTimeDisplay, { color: todo.color }]}>
              {formattedTime}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.timerCheckbox,
              {
                borderColor: todo.color,
                backgroundColor: todo.completed ? todo.color : "transparent",
              },
            ]}
            onPress={() => toggleTodo(todo.id)}
          >
            {todo.completed && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.timerProgressContainer}>
          <View
            style={[
              styles.timerProgressBar,
              { backgroundColor: progressBarBgColor },
            ]}
          >
            <Animated.View
              style={[
                styles.timerProgress,
                {
                  backgroundColor: todo.color,
                  width: `${progress * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {todo.description && (
          <Text
            style={[
              styles.timerDescription,
              {
                color: isDark
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(0, 0, 0, 0.6)",
              },
            ]}
          >
            {todo.description}
          </Text>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="list-outline"
        size={48}
        color={isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"}
      />
      <Text
        style={[
          styles.emptyText,
          { color: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)" },
        ]}
      >
        No tasks yet. Tap + to add one!
      </Text>
    </View>
  );

  if (todos.length === 0) {
    return renderEmptyState();
  }

  const renderSectionHeader = (
    title: string,
    icon: any,
    count: number,
    badgeColor: string
  ) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        <Ionicons
          name={icon}
          size={22}
          color={isDark ? badgeColor : badgeColor}
          style={{ marginRight: 10 }}
        />
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#ffffff" : "#2d2d3a" },
          ]}
        >
          {title}
        </Text>
      </View>
      <View
        style={[
          styles.countBadge,
          { backgroundColor: `${badgeColor}22`, borderColor: badgeColor },
        ]}
      >
        <Text style={[styles.countText, { color: badgeColor }]}>{count}</Text>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.listContainer}>
          {uncompletedTasks.length > 0 && (
            <View style={styles.section}>
              {renderSectionHeader(
                "Tasks",
                "time-outline" as any,
                uncompletedTasks.length,
                "#7868e6"
              )}
              {uncompletedTasks.map((todo) => (
                <TaskItem key={todo.id} todo={todo} />
              ))}
            </View>
          )}

          {timerTodos.length > 0 && (
            <View style={styles.section}>
              {renderSectionHeader(
                "Timers",
                "timer-outline" as any,
                timerTodos.length,
                "#FF9800"
              )}
              {timerTodos.map((todo) => (
                <TimerTaskItem key={todo.id} todo={todo} />
              ))}
            </View>
          )}

          {completedTasks.length > 0 && (
            <View style={styles.section}>
              {renderSectionHeader(
                "Completed",
                "checkmark-circle-outline" as any,
                completedTasks.length,
                "#4BB543"
              )}
              {completedTasks.map((todo) => (
                <TaskItem key={todo.id} todo={todo} />
              ))}
            </View>
          )}

          {todos.length === 0 && renderEmptyState()}
        </View>
      </ScrollView>
    </>
  );
}
