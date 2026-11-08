/**
 * RESPONSIBILITY: Controlled rating and message fields for UserFeedbackMainView (≤200 lines).
 * FLOW: RHF Controllers expose input state and translated validation errors accessibly.
 */

import React from 'react';
import { Controller, type Control, type UseFormClearErrors } from 'react-hook-form';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Star } from 'lucide-react-native';
import type { UserFeedbackSubmitValues } from '../schemas/user_settings.schema';
import { useThemeTokens } from '../../../../../core/theme/useThemeTokens';
import { getMinTouchTarget } from '../../../../../core/theme/getMinTouchTarget';
import { triggerLightImpact } from '../../../../../core/interaction/haptics';
import { useTranslation } from '../../../../../core/i18n/useTranslation';

interface UserFeedbackDetailsFieldsProps {
  control: Control<UserFeedbackSubmitValues>;
  clearErrors: UseFormClearErrors<UserFeedbackSubmitValues>;
  ratingError?: string;
  messageError?: string;
  disabled: boolean;
}

const translationKey = (key: string) => `user_settings_profile.${key}`;

export function UserFeedbackDetailsFields({
  control,
  clearErrors,
  ratingError,
  messageError,
  disabled,
}: UserFeedbackDetailsFieldsProps) {
  const tokens = useThemeTokens();
  const minTarget = getMinTouchTarget();
  const { t } = useTranslation();
  const styles = StyleSheet.create({
    sectionCard: {
      backgroundColor: tokens.color.card, borderRadius: tokens.radius.lg,
      borderWidth: 1, borderColor: tokens.color.border, padding: tokens.space[4],
      marginBottom: tokens.space[4],
    },
    sectionTitle: {
      ...tokens.typography.body, color: tokens.color.foreground,
      fontWeight: '600', marginBottom: tokens.space[3],
    },
    starsRow: { flexDirection: 'row', gap: tokens.space[2], alignItems: 'center' },
    starButton: {
      width: minTarget, height: minTarget, alignItems: 'center', justifyContent: 'center',
      borderRadius: tokens.radius.md,
    },
    input: {
      minHeight: 120, borderWidth: 1, borderColor: tokens.color.border,
      borderRadius: tokens.radius.md, padding: tokens.space[3], color: tokens.color.foreground,
      textAlignVertical: 'top', ...tokens.typography.body, marginBottom: tokens.space[2],
    },
    inputInvalid: { borderColor: tokens.color.destructive },
    error: { ...tokens.typography.bodySm, color: tokens.color.destructive, marginBottom: tokens.space[3] },
  });

  return (
    <>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t(translationKey('FEEDBACK_RATING_TITLE'))}</Text>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => {
                const selected = star <= field.value;
                return (
                  <Pressable
                    key={star}
                    style={styles.starButton}
                    onPress={() => { triggerLightImpact(); clearErrors('rating'); field.onChange(star); }}
                    disabled={disabled}
                    accessibilityRole="button"
                    accessibilityLabel={`${t(translationKey('FEEDBACK_RATE_ACCESSIBILITY'))} ${star} ${t(translationKey('FEEDBACK_STARS'))}`}
                    accessibilityState={{ selected, disabled }}
                    testID={`mobile:user_settings:feedback:rating_${star}`}
                  >
                    <Star
                      size={28}
                      color={selected ? tokens.color.primary : tokens.color.border}
                      fill={selected ? tokens.color.primary : 'transparent'}
                    />
                  </Pressable>
                );
              })}
            </View>
          )}
        />
        {ratingError ? (
          <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">
            {ratingError}
          </Text>
        ) : null}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t(translationKey('FEEDBACK_THOUGHTS_TITLE'))}</Text>
        <Controller
          control={control}
          name="message"
          render={({ field }) => (
            <TextInput
              style={[styles.input, messageError && styles.inputInvalid]}
              value={field.value}
              onChangeText={(message) => { clearErrors('message'); field.onChange(message); }}
              multiline
              editable={!disabled}
              placeholder={t(translationKey('FEEDBACK_MESSAGE_PLACEHOLDER'))}
              placeholderTextColor={tokens.color.muted}
              accessibilityLabel={t(translationKey('FEEDBACK_MESSAGE_ACCESSIBILITY'))}
              accessibilityHint={messageError}
              accessibilityState={{ disabled }}
              testID="mobile:user_settings:feedback:message_input"
            />
          )}
        />
        {messageError ? (
          <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">
            {messageError}
          </Text>
        ) : null}
      </View>
    </>
  );
}
