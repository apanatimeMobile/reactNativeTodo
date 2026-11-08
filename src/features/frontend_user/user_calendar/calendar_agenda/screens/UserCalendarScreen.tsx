/**
 * RESPONSIBILITY: Thin Screen entry point for User Calendar view (≤80 lines).
 * FLOW: Composes SafeAreaView, StatusBar, and UserCalendarMainView; zero business logic.
 */

import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';
import { UserCalendarMainView } from "@/features/frontend_user/user_calendar/calendar_agenda/components/UserCalendarMainView";
import { UserCalendarSkeleton } from "@/features/frontend_user/user_calendar/calendar_agenda/components/UserCalendarSkeleton";
import { UserCalendarErrorFallback } from "@/features/frontend_user/user_calendar/calendar_agenda/components/UserCalendarErrorFallback";
import { useThemeTokens } from "@/core/theme/useThemeTokens";
import { useUserCalendar } from "@/features/frontend_user/user_calendar/calendar_agenda/hooks/useUserCalendar";

export function UserCalendarScreen({ navigation }: { navigation: any }) {
  const tokens = useThemeTokens();
  const { todos, selectedDate, selectDate, toggleComplete, loading, loadError, loadTodos } = useUserCalendar();

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handlePressTask = (task: any) => {
    navigation.navigate('Todos', {
      screen: 'UserTodosDetail',
      params: { id: task.id },
    });
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
      {loadError ? (
        <UserCalendarErrorFallback onRetry={loadTodos} />
      ) : loading ? (
        <UserCalendarSkeleton />
      ) : (
        <UserCalendarMainView
          todos={todos}
          onOpenDrawer={handleOpenDrawer}
          selectedDate={selectedDate}
          onSelectDate={selectDate}
          onPressTask={handlePressTask}
          onToggleTask={toggleComplete}
        />
      )}
    </SafeAreaView>
  );
}
