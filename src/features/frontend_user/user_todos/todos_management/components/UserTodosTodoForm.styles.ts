import { StyleSheet } from 'react-native';
import type { useThemeTokens } from '../../../../../core/theme/useThemeTokens';

type ThemeTokens = ReturnType<typeof useThemeTokens>;

export function createUserTodosTodoFormStyles(
  tokens: ThemeTokens,
  minTarget: number,
  reminder: boolean,
  isSubmitting: boolean,
) {
  return StyleSheet.create({
    flex: { flex: 1 },
    container: { padding: tokens.space[4], paddingBottom: tokens.space[9] },
    fieldGroup: { marginBottom: tokens.space[4] },
    label: { ...tokens.typography.caption, color: tokens.color.foreground, fontWeight: '600', marginBottom: tokens.space[2], textTransform: 'uppercase', letterSpacing: 0.5 },
    submitButton: { minHeight: minTarget, backgroundColor: tokens.color.primary, borderRadius: tokens.radius.md, alignItems: 'center', justifyContent: 'center', marginTop: tokens.space[5], minWidth: tokens.layout.buttonMinWidth, opacity: isSubmitting ? tokens.opacity.loading : 1 },
    submitButtonText: { ...tokens.typography.body, color: tokens.color.onPrimary, fontWeight: '700' },
    reminderToggle: { minHeight: minTarget, justifyContent: 'center', paddingHorizontal: tokens.space[3], borderRadius: tokens.radius.md, borderWidth: 1, borderColor: reminder ? tokens.color.primary : tokens.color.border, backgroundColor: reminder ? tokens.color.primarySubtle : tokens.color.card },
    reminderToggleText: { ...tokens.typography.bodySm, color: reminder ? tokens.color.primaryText : tokens.color.foreground, fontWeight: '600' },
  });
}
