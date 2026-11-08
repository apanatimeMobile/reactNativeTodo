/**
 * RESPONSIBILITY: KPI summary section rendering high-level productivity metrics.
 * FLOW: Rendered inside UserOverviewMainView; presents completion rate, streaks, and focus metrics.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame, CheckCircle2, Target } from 'lucide-react-native';
import type { OverviewMetrics } from "@/features/frontend_user/user_overview/overview_dashboard/types/user_overview.types";
import { useThemeTokens } from "@/core/theme/useThemeTokens";
import { useTranslation } from "@/core/i18n/useTranslation";
import { displayValue } from "@/core/utils/displayValue";

interface UserOverviewKPISectionProps {
  metrics: OverviewMetrics;
}

export function UserOverviewKPISection({ metrics }: UserOverviewKPISectionProps) {
  const tokens = useThemeTokens();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: tokens.space[3],
      marginBottom: tokens.space[4],
    },
    card: {
      flex: 1,
      backgroundColor: tokens.color.card,
      borderRadius: tokens.radius.lg,
      borderWidth: 1,
      borderColor: tokens.color.border,
      padding: tokens.space[3],
      alignItems: 'center',
    },
    iconWrapper: {
      padding: tokens.space[2],
      borderRadius: tokens.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: tokens.space[2],
    },
    value: {
      ...tokens.typography.kpi,
      color: tokens.color.foreground,
      marginBottom: tokens.space[1],
    },
    label: {
      ...tokens.typography.labelUppercase,
      color: tokens.color.muted,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={[styles.iconWrapper, { backgroundColor: tokens.color.primarySubtle }]}>
          <Target size={tokens.icon.md} color={tokens.color.primary} />
        </View>
        <Text style={styles.value}>{metrics.completionRate}%</Text>
        <Text style={styles.label}>{t('user_overview_dashboard.DONE_RATE')}</Text>
      </View>

      <View style={styles.card}>
        <View style={[styles.iconWrapper, { backgroundColor: tokens.color.statusSuccessBg }]}>
          <CheckCircle2 size={tokens.icon.md} color={tokens.color.statusSuccessText} />
        </View>
        <Text style={styles.value}>
          {displayValue(metrics.completedTasks)}/{displayValue(metrics.totalTasks)}
        </Text>
        <Text style={styles.label}>{t('user_overview_dashboard.COMPLETED')}</Text>
      </View>

      <View style={styles.card}>
        <View style={[styles.iconWrapper, { backgroundColor: tokens.color.statusWarningBg }]}>
          <Flame size={tokens.icon.md} color={tokens.color.statusWarningText} />
        </View>
        <Text style={styles.value}>{metrics.currentStreak} {t('user_overview_dashboard.DAYS')}</Text>
        <Text style={styles.label}>{t('user_overview_dashboard.CURRENT_STREAK')}</Text>
      </View>
    </View>
  );
}
