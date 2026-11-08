/**
 * RESPONSIBILITY: Day pill button for the horizontal calendar strip (≤60 lines).
 * FLOW: Renders date number and abbreviated weekday with active highlight.
 */

import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useThemeTokens } from "@/core/theme/useThemeTokens";
import { useTranslation } from "@/core/i18n/useTranslation";

interface UserCalendarDayPillProps {
  dateStr: string;
  dayNum: number;
  dayName: string;
  dateLabel: string;
  isActive: boolean;
  onSelect: (dateStr: string) => void;
}

export function UserCalendarDayPill({
  dateStr,
  dayNum,
  dayName,
  dateLabel,
  isActive,
  onSelect,
}: UserCalendarDayPillProps) {
  const tokens = useThemeTokens();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    dayPill: {
      width: 48,
      height: 64,
      borderRadius: tokens.radius.lg,
      backgroundColor: isActive ? tokens.color.primary : tokens.color.card,
      borderWidth: 1,
      borderColor: isActive ? tokens.color.primary : tokens.color.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayName: {
      ...tokens.typography.caption,
      color: isActive ? tokens.color.onPrimary : tokens.color.muted,
      fontWeight: isActive ? '600' : '400',
      marginBottom: 2,
    },
    dayNum: {
      ...tokens.typography.body,
      fontWeight: '700',
      color: isActive ? tokens.color.onPrimary : tokens.color.foreground,
    },
  });

  return (
    <Pressable
      style={styles.dayPill}
      onPress={() => onSelect(dateStr)}
      accessibilityRole="button"
      accessibilityLabel={t('user_calendar_agenda.SELECT_DATE').replace('{date}', dateLabel)}
      accessibilityState={{ selected: isActive }}
    >
      <Text style={styles.dayName}>{dayName}</Text>
      <Text style={styles.dayNum}>{dayNum}</Text>
    </Pressable>
  );
}
