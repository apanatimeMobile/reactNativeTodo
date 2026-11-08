/**
 * RESPONSIBILITY: Catch render failures without exposing error payloads.
 * FLOW: Render tree failure → token-based recovery UI → explicit retry.
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { darkTheme as tokens } from "@/core/theme/darkTheme";
import { getMinTouchTarget } from "@/core/theme/getMinTouchTarget";
import { getActiveLocale } from "@/core/i18n/locale";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const messages = {
  en: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Try again or restart the app.',
    retry: 'Try again',
  },
  hi: {
    title: 'कुछ गलत हो गया',
    message: 'एक अप्रत्याशित त्रुटि हुई। फिर प्रयास करें या ऐप दोबारा शुरू करें।',
    retry: 'फिर प्रयास करें',
  },
};

// This boundary also catches provider failures, so recovery cannot depend on provider hooks.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleRetry = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;
    const copy = messages[getActiveLocale()];
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title} accessibilityRole="header">{copy.title}</Text>
          <Text style={styles.message} accessibilityRole="alert">{copy.message}</Text>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={this.handleRetry}
            accessibilityRole="button"
            accessibilityLabel={copy.retry}
            testID="app-error-retry"
          >
            <Text style={styles.buttonText}>{copy.retry}</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.color.background,
    justifyContent: 'center',
    padding: tokens.space[6],
  },
  card: {
    backgroundColor: tokens.color.card,
    borderRadius: tokens.radius.xl,
    borderColor: tokens.color.border,
    padding: tokens.space[6],
  },
  title: {
    ...tokens.typography.headingLg,
    color: tokens.color.foreground,
    marginBottom: tokens.space[2],
    textAlign: 'center',
  },
  message: {
    ...tokens.typography.bodySm,
    color: tokens.color.muted,
    textAlign: 'center',
    marginBottom: tokens.space[5],
  },
  button: {
    minHeight: getMinTouchTarget(),
    backgroundColor: tokens.color.primary,
    padding: tokens.space[4],
    borderRadius: tokens.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: { backgroundColor: tokens.color.primaryPressed },
  buttonText: { ...tokens.typography.body, color: tokens.color.onPrimary },
});

export default ErrorBoundary;
