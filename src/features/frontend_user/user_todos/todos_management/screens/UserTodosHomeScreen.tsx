/**
 * RESPONSIBILITY: Thin Screen entry point for User Todos Home view (≤80 lines).
 * FLOW: Composes SafeAreaView, StatusBar, and UserTodosHomeMainView; zero business logic.
 */

import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';
import { UserTodosSkeleton } from "@/features/frontend_user/user_todos/todos_management/components/UserTodosSkeleton";
import { UserTodosErrorFallback } from "@/features/frontend_user/user_todos/todos_management/components/UserTodosErrorFallback";
import { UserTodosHomeMainView } from "@/features/frontend_user/user_todos/todos_management/components/UserTodosHomeMainView";
import { useThemeTokens } from "@/core/theme/useThemeTokens";
import { useUserTodos } from "@/features/frontend_user/user_todos/todos_management/hooks/useUserTodos";
import { USER_TODOS_ROUTES } from "@/features/frontend_user/user_todos/todos_management/config/user_todos.url_config";

export function UserTodosHomeScreen({ navigation }: { navigation: any }) {
  const tokens = useThemeTokens();
  const { todos, categories, toggleComplete, toggleFavorite, refreshTodos, loading, loadError } = useUserTodos();

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handlePressAdd = () => {
    navigation.navigate(USER_TODOS_ROUTES.ADD);
  };

  const handlePressTodo = (todo: any) => {
    navigation.navigate(USER_TODOS_ROUTES.DETAIL, { id: todo.id });
  };

  const handlePressReminders = () => {
    navigation.navigate('Reminders');
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
      {loading ? <UserTodosSkeleton /> : loadError ? <UserTodosErrorFallback onRetry={refreshTodos} /> : <UserTodosHomeMainView
        todos={todos}
        categories={categories}
        onOpenDrawer={handleOpenDrawer}
        onPressAdd={handlePressAdd}
        onPressTodo={handlePressTodo}
        onToggleComplete={toggleComplete}
        onToggleFavorite={toggleFavorite}
        onPressReminders={handlePressReminders}
        refreshing={loading}
        onRefresh={refreshTodos}
      />}
    </SafeAreaView>
  );
}
