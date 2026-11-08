/**
 * RESPONSIBILITY: Thin Screen entry point for User Todos Edit view (≤80 lines).
 * FLOW: Composes SafeAreaView, StatusBar, and UserTodosEditMainView; forwards updates to useTodos hook.
 */

import React, { useMemo, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserTodosEditMainView } from '../components/UserTodosEditMainView';
import { useThemeTokens } from '../../../../../core/theme/useThemeTokens';
import { useUserTodos } from '../hooks/useUserTodos';
import type { TodoEntity } from '../types/user_todos.types';
import type { TodoFormInput } from '../schemas/user_todos.schemas';

export function UserTodosEditScreen({ route, navigation }: { route: { params?: { id?: string } }; navigation: { goBack: () => void } }) {
  const tokens = useThemeTokens();
  const { id } = route?.params || {};
  const { todos, todoCategories: categories, updateTodo } = useUserTodos();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todo = useMemo<TodoEntity | undefined>(() => todos.find((item) => String(item.id) === String(id)), [todos, id]);

  const handleSubmit = async (values: TodoFormInput) => {
    setIsSubmitting(true);
    try {
      await updateTodo(id, values);
      navigation.goBack();
    } catch (error) {
      setIsSubmitting(false);
      throw error;
    }
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: tokens.color.background,
    },
  });

  if (!todo) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={tokens.isDark ? 'light-content' : 'dark-content'}
      />
      <UserTodosEditMainView
        todo={todo}
        categories={categories}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onBack={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
}
