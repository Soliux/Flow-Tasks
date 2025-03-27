import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
  Platform,
} from "react-native";
import { useTodos } from "@/context/TodoContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Todo } from "@/types/todo";
import { useRouter } from "expo-router";

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
  const router = useRouter();

  // Define styles inside the component so we have access to isDark
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? GRADIENTS.dark[0] : GRADIENTS.light[0],
    },
    contentContainer: {
      padding: 20,
      paddingTop: 28,
      paddingBottom: Platform.OS === "ios" ? 100 : 80,
    },
    listContainer: {
      gap: 28,
    },
    section: {
      marginBottom: 28,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
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
      marginBottom: 16,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4.5,
      elevation: 5,
    },
    todoContent: {
      padding: 18,
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
      paddingHorizontal: 32,
      flex: 1,
    },
    emptyStateVisual: {
      position: "relative",
      marginBottom: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyCircle: {
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: isDark
        ? "rgba(120, 104, 230, 0.15)"
        : "rgba(120, 104, 230, 0.1)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    emptyDecorations: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    emptySmallCircle: {
      position: "absolute",
      width: 16,
      height: 16,
      borderRadius: 8,
      opacity: 0.8,
    },
    emptyTitle: {
      fontSize: 28,
      fontWeight: "700",
      marginBottom: 16,
      textAlign: "center",
      letterSpacing: 0.5,
    },
    emptyText: {
      fontSize: 16,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 32,
    },
    emptyAddButton: {
      flexDirection: "row",
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 6,
    },
    emptyAddButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    emptyContentContainer: {
      flexGrow: 1,
      justifyContent: "center",
    },
    timerTimeWrapper: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
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

    // Choose appropriate icon based on the task content
    const getTaskIcon = () => {
      const title = todo.title.toLowerCase();
      if (
        title.includes("meet") ||
        title.includes("call") ||
        title.includes("chat")
      )
        return "people-outline";
      if (
        title.includes("email") ||
        title.includes("mail") ||
        title.includes("message")
      )
        return "mail-outline";
      if (
        title.includes("review") ||
        title.includes("read") ||
        title.includes("study")
      )
        return "book-outline";
      if (
        title.includes("buy") ||
        title.includes("shop") ||
        title.includes("purchase")
      )
        return "cart-outline";
      if (
        title.includes("gym") ||
        title.includes("workout") ||
        title.includes("exercise")
      )
        return "fitness-outline";
      if (
        title.includes("eat") ||
        title.includes("food") ||
        title.includes("dinner")
      )
        return "restaurant-outline";
      return "document-text-outline";
    };

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
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.todoContent}>
          <View style={styles.todoHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <TouchableOpacity
                onPress={() => toggleTodo(todo.id)}
                style={[
                  styles.checkbox,
                  { borderColor: todo.color },
                  todo.completed && { backgroundColor: todo.color },
                ]}
              >
                {todo.completed && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </TouchableOpacity>

              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text
                  style={[
                    styles.todoTitle,
                    {
                      color: isDark ? "#ffffff" : "#2d2d3a",
                      textDecorationLine: todo.completed
                        ? "line-through"
                        : "none",
                      opacity: todo.completed ? 0.7 : 1,
                    },
                  ]}
                >
                  {todo.title}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 6,
                  }}
                >
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={isDark ? "#adb5bd" : "#5a5a6e"}
                    style={{ opacity: 0.8, marginRight: 4 }}
                  />
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
              </View>
            </View>

            <Ionicons
              name={getTaskIcon()}
              size={22}
              color={todo.color}
              style={{ opacity: 0.8 }}
            />
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

    // Determine if timer is getting low
    const isAlmostDone = remaining <= 30;

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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="timer-outline"
                size={20}
                color={todo.color}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.timerTitle,
                  { color: isDark ? "#ffffff" : "#2d2d3a" },
                ]}
              >
                {todo.title}
              </Text>
            </View>

            <View style={styles.timerTimeWrapper}>
              <Text
                style={[
                  styles.timerTimeDisplay,
                  {
                    color: isAlmostDone ? "#FF6B6B" : todo.color,
                    fontSize: isAlmostDone ? 32 : 28,
                  },
                ]}
              >
                {formattedTime}
              </Text>
              {isAlmostDone && (
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color="#FF6B6B"
                  style={{ marginLeft: 6, alignSelf: "flex-start" }}
                />
              )}
            </View>
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
                  backgroundColor: isAlmostDone
                    ? remaining <= 10
                      ? "#FF6B6B"
                      : "#FFA500"
                    : todo.color,
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
      <View style={styles.emptyStateVisual}>
        <View style={styles.emptyCircle}>
          <Ionicons
            name="checkmark-done-outline"
            size={80}
            color={isDark ? "#7868e6" : "#6558d1"}
          />
        </View>
        <View style={styles.emptyDecorations}>
          <View
            style={[
              styles.emptySmallCircle,
              {
                backgroundColor: "#FF6B6B",
                top: -20,
                right: -15,
              },
            ]}
          />
          <View
            style={[
              styles.emptySmallCircle,
              {
                backgroundColor: "#4ECDC4",
                bottom: 10,
                left: -10,
              },
            ]}
          />
          <View
            style={[
              styles.emptySmallCircle,
              {
                backgroundColor: "#45B7D1",
                top: 40,
                right: -20,
                width: 12,
                height: 12,
              },
            ]}
          />
        </View>
      </View>
      <Text
        style={[styles.emptyTitle, { color: isDark ? "#ffffff" : "#2d2d3a" }]}
      >
        All Caught Up!
      </Text>
      <Text
        style={[
          styles.emptyText,
          { color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.5)" },
        ]}
      >
        Tap the + button to add your first task and start being productive.
      </Text>

      <TouchableOpacity
        style={[styles.emptyAddButton, { backgroundColor: "#7868e6" }]}
        onPress={() => router.push("/(tabs)/add")}
        activeOpacity={0.8}
      >
        <Ionicons
          name="add-circle-outline"
          size={22}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.emptyAddButtonText}>Create New Task</Text>
      </TouchableOpacity>
    </View>
  );

  if (todos.length === 0) {
    return (
      <>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.contentContainer,
            styles.emptyContentContainer,
          ]}
        >
          {renderEmptyState()}
        </ScrollView>
      </>
    );
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
        </View>
      </ScrollView>
    </>
  );
}
