/**
 * RESPONSIBILITY: Accessible category choices for UserFeedbackMainView (≤200 lines).
 * FLOW: Localized category buttons report the selected schema value to the controlled form.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Bug, Lightbulb, Heart, MessageCircle } from 'lucide-react-native';
import { useThemeTokens } from '../../../../../core/theme/useThemeTokens';
import { getMinTouchTarget } from '../../../../../core/theme/getMinTouchTarget';
import { triggerLightImpact } from '../../../../../core/interaction/haptics';
import { useTranslation } from '../../../../../core/i18n/useTranslation';
import type { UserFeedbackSubmitValues } from '../schemas/user_settings.schema';

interface UserFeedbackCategorySelectorProps {
  selectedCategory: UserFeedbackSubmitValues['category'];
  onSelectCategory: (category: UserFeedbackSubmitValues['category']) => void;
  disabled?: boolean;
}

const CATEGORIES = [
  { key: 'bug', labelKey: 'FEEDBACK_CATEGORY_BUG', Icon: Bug },
  { key: 'feature', labelKey: 'FEEDBACK_CATEGORY_FEATURE', Icon: Lightbulb },
  { key: 'praise', labelKey: 'FEEDBACK_CATEGORY_PRAISE', Icon: Heart },
  { key: 'other', labelKey: 'FEEDBACK_CATEGORY_OTHER', Icon: MessageCircle },
] as const;

export function UserFeedbackCategorySelector({
  selectedCategory,
  onSelectCategory,
  disabled = false,
}: UserFeedbackCategorySelectorProps) {
  const tokens = useThemeTokens();
  const minTarget = getMinTouchTarget();
  const { t } = useTranslation();
  const styles = StyleSheet.create({
    categoriesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.space[2] },
    categoryChip: {
      minHeight: minTarget, flexDirection: 'row', alignItems: 'center', gap: tokens.space[2],
      paddingHorizontal: tokens.space[3], borderRadius: tokens.radius.md,
      borderWidth: 1, borderColor: tokens.color.border, backgroundColor: tokens.color.card,
    },
    categoryChipActive: {
      borderColor: tokens.color.primary, backgroundColor: tokens.color.primarySubtle,
    },
    categoryText: { ...tokens.typography.bodySm, color: tokens.color.foreground },
    categoryTextActive: { color: tokens.color.primaryText, fontWeight: '600' },
  });

  return (
    <View style={styles.categoriesRow}>
      {CATEGORIES.map(({ key, labelKey, Icon }) => {
        const isActive = selectedCategory === key;
        const label = t(`user_settings_profile.${labelKey}`);
        return (
          <Pressable
            key={key}
            style={[styles.categoryChip, isActive && styles.categoryChipActive]}
            onPress={() => {
              if (disabled) return;
              triggerLightImpact();
              onSelectCategory(key);
            }}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={`${t('user_settings_profile.FEEDBACK_SELECT_CATEGORY')} ${label}`}
            accessibilityState={{ selected: isActive, disabled }}
            testID={`mobile:user_settings:feedback:category_${key}`}
          >
            <Icon size={16} color={isActive ? tokens.color.primary : tokens.color.muted} />
            <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
