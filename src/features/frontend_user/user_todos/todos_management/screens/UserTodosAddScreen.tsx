/**
 * RESPONSIBILITY: Thin Screen entry point for User Todos Add view (≤80 lines).
 * FLOW: Composes SafeAreaView, StatusBar, and UserTodosAddMainView; delegates persistence to useTodos hook.
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserTodosAddMainView } from '../components/UserTodosAddMainView';
import { useThemeTokens } from '../../../../../core/theme/useThemeTokens';
import { useUserTodos } from '../hooks/useUserTodos';
import type { TodoFormInput } from '../schemas/user_todos.schemas';

export function UserTodosAddScreen({ navigation }: { navigation: { goBack: () => void } }) {
  const tokens = useThemeTokens();
  const { todoCategories: categories, addTodo } = useUserTodos();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: TodoFormInput) => {
    setIsSubmitting(true);
    try {
      await addTodo(values);
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={tokens.isDark ? 'light-content' : 'dark-content'}
      />
      <UserTodosAddMainView
        categories={categories}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onBack={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
}
