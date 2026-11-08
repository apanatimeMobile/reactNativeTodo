/**
 * RESPONSIBILITY: Thin Screen entry point for User Reminders view (≤80 lines).
 * FLOW: Composes SafeAreaView, StatusBar, and UserRemindersMainView; zero business logic.
 */

import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';
import { UserRemindersSkeleton } from "@/features/frontend_user/user_reminders/reminders_active/components/UserRemindersSkeleton";
import { UserRemindersErrorFallback } from "@/features/frontend_user/user_reminders/reminders_active/components/UserRemindersErrorFallback";
import { UserRemindersMainView } from "@/features/frontend_user/user_reminders/reminders_active/components/UserRemindersMainView";
import { useThemeTokens } from "@/core/theme/useThemeTokens";
import { useUserReminders } from "@/features/frontend_user/user_reminders/reminders_active/hooks/useUserReminders";

export function UserRemindersScreen({ navigation }: { navigation?: any }) {
  const tokens = useThemeTokens();
  const { loading, loadError, retryLoad, reminders, snoozeReminder } = useUserReminders();

  const handleOpenDrawer = () => {
    if (navigation?.dispatch) {
      navigation.dispatch(DrawerActions.openDrawer());
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
      {loading ? <UserRemindersSkeleton /> : loadError ? <UserRemindersErrorFallback onRetry={retryLoad} /> : <UserRemindersMainView reminders={reminders} onOpenDrawer={handleOpenDrawer} onSnoozeReminder={snoozeReminder} />}
    </SafeAreaView>
  );
}
