/**
 * RESPONSIBILITY: Thin Screen entry point for User Overview view (≤80 lines).
 * FLOW: Composes SafeAreaView, StatusBar, and UserOverviewMainView; zero business logic.
 */

import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';
import { UserOverviewSkeleton } from "@/features/frontend_user/user_overview/overview_dashboard/components/UserOverviewSkeleton";
import { UserOverviewErrorFallback } from "@/features/frontend_user/user_overview/overview_dashboard/components/UserOverviewErrorFallback";
import { UserOverviewMainView } from "@/features/frontend_user/user_overview/overview_dashboard/components/UserOverviewMainView";
import { useThemeTokens } from "@/core/theme/useThemeTokens";
import { useUserOverview } from "@/features/frontend_user/user_overview/overview_dashboard/hooks/useUserOverview";

export function UserOverviewScreen({ navigation }: { navigation?: any }) {
  const tokens = useThemeTokens();
  const { loading, loadError, retryLoad, metrics, categoryData, activityData, insightText, refreshing, refreshOverview } = useUserOverview();

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
      {loading ? <UserOverviewSkeleton /> : loadError ? <UserOverviewErrorFallback onRetry={retryLoad} /> : <UserOverviewMainView
        metrics={metrics}
        categoryData={categoryData}
        activityData={activityData}
        insightText={insightText}
        refreshing={refreshing}
        onRefresh={refreshOverview}
        onOpenDrawer={handleOpenDrawer}
      />}
    </SafeAreaView>
  );
}
