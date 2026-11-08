/**
 * RESPONSIBILITY: User feedback submission view (≤200 lines).
 * FLOW: Validates the controlled feedback fields before invoking the existing submit callback.
 */

import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ArrowLeft, Send } from 'lucide-react-native';
import { UserFeedbackCategorySelector } from './UserFeedbackCategorySelector';
import { UserFeedbackDetailsFields } from './UserFeedbackDetailsFields';
import { UserFeedbackSubmitSchema, type UserFeedbackSubmitValues } from '../schemas/user_settings.schema';
import { useThemeTokens } from '../../../../../core/theme/useThemeTokens';
import { getMinTouchTarget } from '../../../../../core/theme/getMinTouchTarget';
import { triggerSuccessNotification, triggerLightImpact } from '../../../../../core/interaction/haptics';
import { useTranslation } from '../../../../../core/i18n/useTranslation';

interface UserFeedbackMainViewProps {
  onSubmit: (feedback: { category: string; rating: number; message: string }) => Promise<boolean>;
  onBack?: () => void;
}

const translationKey = (key: string) => `user_settings_profile.${key}`;

export function UserFeedbackMainView({ onSubmit, onBack }: UserFeedbackMainViewProps) {
  const tokens = useThemeTokens();
  const minTarget = getMinTouchTarget();
  const { t } = useTranslation();
  const pendingRef = useRef(false);
  const { control, handleSubmit, reset, setError, formState: { errors, isSubmitting } } =
    useForm<UserFeedbackSubmitValues>({
      defaultValues: { category: 'feature', rating: 5, message: '' },
    });

  const submitFeedback = async (values: UserFeedbackSubmitValues) => {
    const parsed = UserFeedbackSubmitSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach(({ path, message }) => {
        const field = path[0];
        if (field === 'category' || field === 'rating' || field === 'message') {
          setError(field, { type: 'schema', message: t(message) });
        }
      });
      return;
    }
    if (pendingRef.current) return;
    pendingRef.current = true;
    try {
      if (await onSubmit(parsed.data)) {
        triggerSuccessNotification();
        reset({ ...parsed.data, message: '' });
      }
    } catch {
      return;
    } finally {
      pendingRef.current = false;
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: tokens.color.background },
    scrollContent: { padding: tokens.space[4], paddingBottom: tokens.space[9] },
    header: { marginBottom: tokens.space[4] },
    headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: tokens.space[2], gap: tokens.space[2] },
    backButton: {
      width: minTarget, height: minTarget, borderRadius: tokens.radius.md,
      backgroundColor: tokens.color.card, borderWidth: 1, borderColor: tokens.color.border,
      alignItems: 'center', justifyContent: 'center',
    },
    title: { ...tokens.typography.headingLg, color: tokens.color.foreground },
    subtitle: { ...tokens.typography.bodySm, color: tokens.color.muted, marginTop: 2 },
    sectionCard: {
      backgroundColor: tokens.color.card, borderRadius: tokens.radius.lg,
      borderWidth: 1, borderColor: tokens.color.border, padding: tokens.space[4],
      marginBottom: tokens.space[4],
    },
    sectionTitle: {
      ...tokens.typography.body, color: tokens.color.foreground,
      fontWeight: '600', marginBottom: tokens.space[3],
    },
    error: { ...tokens.typography.bodySm, color: tokens.color.destructive, marginTop: tokens.space[2] },
    submitButton: {
      minHeight: minTarget, backgroundColor: tokens.color.primary, borderRadius: tokens.radius.md,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: tokens.space[2],
    },
    submitButtonDisabled: { opacity: 0.6 },
    submitButtonText: { ...tokens.typography.labelUppercase, color: tokens.color.onPrimary, fontWeight: '700' },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {onBack ? (
            <Pressable
              style={styles.backButton}
              onPress={() => { triggerLightImpact(); onBack(); }}
              accessibilityRole="button"
              accessibilityLabel={t(translationKey('FEEDBACK_BACK_ACCESSIBILITY'))}
              testID="mobile:user_settings:feedback:back_button"
              hitSlop={8}
            >
              <ArrowLeft size={20} color={tokens.color.foreground} strokeWidth={2.2} />
            </Pressable>
          ) : null}
          <Text style={styles.title}>{t(translationKey('FEEDBACK_TITLE'))}</Text>
        </View>
        <Text style={styles.subtitle}>{t(translationKey('FEEDBACK_SUBTITLE'))}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t(translationKey('FEEDBACK_CATEGORY_TITLE'))}</Text>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <UserFeedbackCategorySelector
              selectedCategory={field.value}
              onSelectCategory={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
        {errors.category?.message ? (
          <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">
            {errors.category.message}
          </Text>
        ) : null}
      </View>

      <UserFeedbackDetailsFields
        control={control}
        ratingError={errors.rating?.message}
        messageError={errors.message?.message}
        disabled={isSubmitting}
      />

      <View style={styles.sectionCard}>
        <Pressable
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit(submitFeedback)}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel={t(translationKey('FEEDBACK_SUBMIT_ACCESSIBILITY'))}
          accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
          testID="mobile:user_settings:feedback:submit_button"
        >
          <Send size={18} color={tokens.color.onPrimary} />
          <Text style={styles.submitButtonText}>
            {t(translationKey(isSubmitting ? 'FEEDBACK_SUBMITTING' : 'FEEDBACK_SUBMIT'))}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
