/**
 * RESPONSIBILITY: Thin Screen entry point for User Feedback (≤80 lines).
 * FLOW: Renders SafeAreaView, StatusBar, and UserFeedbackMainView.
 */

import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { showToast } from '../../../../../core/toast/showToast';
import { useTranslation } from '../../../../../core/i18n/useTranslation';
import { createId } from "../../../../../core/utils/runtimeHelpers";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { userSettingsApi } from '../api/user_settings.api';
import { UserFeedbackMainView } from '../components/UserFeedbackMainView';
import { useThemeTokens } from '../../../../../core/theme/useThemeTokens';

export function UserFeedbackScreen() {
  const navigation = useNavigation<any>();
  const tokens = useThemeTokens();
  const { t } = useTranslation();

  const handleSubmitFeedback = async (data: { category: string; rating: number; message: string }) => {
    try {
      await userSettingsApi.submitFeedback(
        { category: data.category, rating: data.rating, comment: data.message },
        createId(),
      );
      navigation.goBack();
      return true;
    } catch {
      showToast(t('user_settings_profile.FEEDBACK_UNAVAILABLE'), 'error');
      return false;
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
      <UserFeedbackMainView
        onSubmit={handleSubmitFeedback}
        onBack={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
}
