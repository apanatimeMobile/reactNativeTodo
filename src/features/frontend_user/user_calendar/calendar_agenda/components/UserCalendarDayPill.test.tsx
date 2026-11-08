import React from 'react';
import { act, create } from 'react-test-renderer';
import { UserCalendarDayPill } from "@/features/frontend_user/user_calendar/calendar_agenda/components/UserCalendarDayPill";
import { triggerLightImpact } from "@/core/interaction/haptics";

jest.mock("@/core/theme/useThemeTokens", () => ({
  useThemeTokens: () => ({
    color: { primary: '#06c', card: '#fff', border: '#ddd', onPrimary: '#fff', muted: '#555', foreground: '#111' },
    radius: { lg: 12 },
    typography: { caption: {}, body: {} },
  }),
}));
jest.mock("@/core/i18n/useTranslation", () => ({
  useTranslation: () => ({ t: () => 'Select date Monday, June 8, 2026' }),
}));
jest.mock("@/core/interaction/haptics", () => ({ triggerLightImpact: jest.fn() }));

describe('UserCalendarDayPill', () => {
  it('announces the full date and selects it without navigation haptics', () => {
    const onSelect = jest.fn();
    let root!: ReturnType<typeof create>;
    act(() => {
      root = create(
        <UserCalendarDayPill
          dateStr="2026-06-08"
          dayNum={8}
          dayName="Mon"
          dateLabel="Monday, June 8, 2026"
          isActive
          onSelect={onSelect}
        />,
      );
    });

    const button = root.root.findByProps({ accessibilityRole: 'button' });
    expect(button.props.accessibilityLabel).toBe('Select date Monday, June 8, 2026');
    expect(button.props.accessibilityState).toEqual({ selected: true });
    act(() => button.props.onPress());
    expect(onSelect).toHaveBeenCalledWith('2026-06-08');
    expect(triggerLightImpact).not.toHaveBeenCalled();
    act(() => root.unmount());
  });
});
