/**
 * RESPONSIBILITY: Preserve persisted appearance preferences through provider consolidation.
 * FLOW: Legacy storage → canonical theme provider hydration → active tokens.
 */
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { ThemeProvider, useThemeContext } from "@/core/theme/ThemeProvider";
import { AccentPreferencesProvider, useAccentPreferences } from "@/core/theme/AccentThemeProvider";

it('restores the legacy dark mode and saved accent without writing an unrelated default', async () => {
  await AsyncStorage.clear();
  await AsyncStorage.setItem('@todomaster/theme', JSON.stringify('dark'));
  await AsyncStorage.setItem('@todomaster/accent_color', JSON.stringify('emerald'));
  let dark = false;
  let accent = '';
  function Capture() {
    dark = useThemeContext().isDarkMode;
    accent = useAccentPreferences().accentColor;
    return null;
  }
  let root!: ReactTestRenderer;
  await act(async () => {
    root = create(<ThemeProvider><AccentPreferencesProvider><Capture /></AccentPreferencesProvider></ThemeProvider>);
  });
  expect(dark).toBe(true);
  expect(accent).toBe('emerald');
  expect(await AsyncStorage.getItem('@todomaster/theme')).toBe(JSON.stringify('dark'));
  await act(async () => root.unmount());
});
