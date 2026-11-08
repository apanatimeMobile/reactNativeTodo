/**
 * RESPONSIBILITY: Recover from a deleted or unavailable task instead of rendering a blank screen.
 * FLOW: Missing record → clear message → explicit navigation back to the task list.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeTokens } from '../../../../../core/theme/useThemeTokens';
import { getMinTouchTarget } from '../../../../../core/theme/getMinTouchTarget';
import { useTranslation } from '../../../../../core/i18n/useTranslation';

export function UserTodosMissingRecord({ onBack }: { onBack: () => void }) {
  const tokens = useThemeTokens();
  const { t } = useTranslation();
  const styles = StyleSheet.create({
    container: { flex: 1, padding: tokens.space[6], justifyContent: 'center' },
    message: { ...tokens.typography.body, color: tokens.color.foreground, marginBottom: tokens.space[4] },
    button: { minHeight: getMinTouchTarget(), padding: tokens.space[3], borderRadius: tokens.radius.md, backgroundColor: tokens.color.primary, justifyContent: 'center', alignItems: 'center' },
    buttonText: { ...tokens.typography.body, color: tokens.color.onPrimary },
  });
  return <View style={styles.container}>
    <Text style={styles.message} accessibilityRole="alert">{t('user_todos_management.TASK_NOT_FOUND')}</Text>
    <Pressable style={styles.button} accessibilityRole="button" onPress={onBack} testID="user_todos-missing-back">
      <Text style={styles.buttonText}>{t('user_todos_management.BACK_TO_TASKS')}</Text>
    </Pressable>
  </View>;
}
