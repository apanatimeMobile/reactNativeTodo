import React from 'react';
import { act, create } from 'react-test-renderer';
import { UserPomodoroModeSelector } from './UserPomodoroModeSelector';

jest.mock('../../../../../core/theme/useThemeTokens', () => ({
  useThemeTokens: () => ({
    color: { card: '#fff', border: '#ddd', primary: '#06c', muted: '#555', onPrimary: '#fff' },
    space: { 2: 8, 4: 16, 8: 40 },
    radius: { full: 999 },
    typography: { caption: {} },
  }),
}));
jest.mock('../../../../../core/i18n/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => ({
      'user_pomodoro_timer.MODE_FOCUS': 'Focus',
      'user_pomodoro_timer.MODE_SHORT_BREAK': 'Short Break',
      'user_pomodoro_timer.MODE_LONG_BREAK': 'Long Break',
      'user_pomodoro_timer.SWITCH_TO_MODE': 'Switch to {mode} mode',
    }[key] ?? key),
  }),
}));
jest.mock('../../../../../core/interaction/haptics', () => ({ triggerLightImpact: jest.fn() }));

describe('UserPomodoroModeSelector', () => {
  it('localizes mode labels, marks the selected mode, and meets the touch target', () => {
    let root!: ReturnType<typeof create>;
    act(() => {
      root = create(<UserPomodoroModeSelector currentMode="shortBreak" onSelectMode={jest.fn()} />);
    });

    const buttons = root.root.findAllByProps({ accessibilityRole: 'button' });
    expect(buttons).toHaveLength(3);
    expect(buttons.map((button) => button.props.accessibilityLabel)).toEqual([
      'Switch to Focus mode', 'Switch to Short Break mode', 'Switch to Long Break mode',
    ]);
    expect(buttons.map((button) => button.props.accessibilityState.selected)).toEqual([
      false, true, false,
    ]);
    expect(buttons.every((button) => button.props.style.some(
      (style: { minHeight?: number }) => (style.minHeight ?? 0) >= 44,
    ))).toBe(true);
    act(() => root.unmount());
  });
});
