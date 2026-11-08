/**
 * RESPONSIBILITY: Describe shared appearance and preference contracts without feature business models.
 * FLOW: Type-only declarations; no runtime facade or persistence changes.
 */
export type ThemeMode = 'light' | 'dark';

export interface PaletteOption {
  id: string;
  name: string;
  light: string;
  dark: string;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  remindersEnabled: boolean;
  use24Hour: boolean;
  weekStartsMonday: boolean;
  hapticsEnabled: boolean;
  swipeActionsEnabled: boolean;
  snoozeDuration: number;
}
