/**
 * RESPONSIBILITY: Thin Screen entry point for User Todos Detail view (≤80 lines).
 * FLOW: Composes SafeAreaView, StatusBar, and UserTodosDetailMainView; routes actions to navigator or useTodos hook.
 */

import React, { useMemo } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserTodosDetailMainView } from "@/features/frontend_user/user_todos/todos_management/components/UserTodosDetailMainView";
import { useThemeTokens } from "@/core/theme/useThemeTokens";
import { useUserTodos } from "@/features/frontend_user/user_todos/todos_management/hooks/useUserTodos";
import { UserTodosMissingRecord } from "@/features/frontend_user/user_todos/todos_management/components/UserTodosMissingRecord";
import { UserTodosSkeleton } from "@/features/frontend_user/user_todos/todos_management/components/UserTodosSkeleton";
import { UserTodosErrorFallback } from "@/features/frontend_user/user_todos/todos_management/components/UserTodosErrorFallback";
import { USER_TODOS_ROUTES } from "@/features/frontend_user/user_todos/todos_management/config/user_todos.url_config";

export function UserTodosDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const tokens = useThemeTokens();
  const { id } = route?.params || {};
  const { todos, deleteTodo, toggleComplete, toggleFavorite, loading, loadError, refreshTodos } = useUserTodos();

  const todo = useMemo(() => todos.find((t: any) => String(t.id) === String(id)), [todos, id]);

  const handleDelete = () => {
    deleteTodo(id);
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate(USER_TODOS_ROUTES.EDIT, { id });
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: tokens.color.background,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={tokens.isDark ? 'light-content' : 'dark-content'}
      />
      {loading ? <UserTodosSkeleton /> : loadError ? <UserTodosErrorFallback onRetry={refreshTodos} /> : !todo ? <UserTodosMissingRecord onBack={() => navigation.goBack()} /> : <UserTodosDetailMainView
        todo={todo}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleComplete={() => toggleComplete(id)}
        onToggleFavorite={() => toggleFavorite(id)}
        onBack={() => navigation.goBack()}
      />}
    </SafeAreaView>
  );
}
