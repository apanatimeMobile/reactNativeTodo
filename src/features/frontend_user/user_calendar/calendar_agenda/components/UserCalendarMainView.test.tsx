import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { UserCalendarMainView } from "@/features/frontend_user/user_calendar/calendar_agenda/components/UserCalendarMainView";

jest.mock("@/core/theme/useThemeTokens", () => ({
  useThemeTokens: () => ({
    color: {
      background: '#fff', card: '#fff', border: '#ddd', foreground: '#111',
      muted: '#555', primary: '#06c', onPrimary: '#fff',
    },
    space: { 2: 8, 3: 12, 4: 16, 8: 40 },
    radius: { md: 8, lg: 12 },
    typography: { headingLg: {}, body: {}, caption: {} },
  }),
}));

jest.mock("@/core/i18n/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => ({
      'user_calendar_agenda.TASK_ACCESSIBILITY': 'Task',
      'user_calendar_agenda.TOGGLE_TASK_COMPLETION': 'Toggle completion for {task}',
      'user_calendar_agenda.SELECT_DATE': 'Select date {date}',
      'user_calendar_agenda.EMPTY_FOR_DATE': 'No tasks scheduled for {date}',
      'user_calendar_agenda.PAGE_TITLE': 'Calendar',
      'user_calendar_agenda.OPEN_DRAWER': 'Open navigation drawer',
    }[key] ?? key),
  }),
}));

jest.mock("@/core/interaction/haptics", () => ({ triggerLightImpact: jest.fn() }));

describe('UserCalendarMainView accessibility', () => {
  it('provides a localized task checkbox label and platform-sized target', async () => {
    let root!: ReactTestRenderer;
    await act(async () => {
      root = create(
        <UserCalendarMainView
          todos={[{
            id: 'task-1', title: 'Read chapter', dueDate: '2026-06-08',
            completed: false, deleted: false,
          }]}
          selectedDate="2026-06-08"
          onSelectDate={jest.fn()}
        />,
      );
    });

    const checkbox = root.root.findByProps({ accessibilityRole: 'checkbox' });
    expect(checkbox.props.accessibilityLabel).toBe('Toggle completion for Read chapter');
    expect(checkbox.props.accessibilityState).toEqual({ checked: false });
    expect(checkbox.props.style.width).toBeGreaterThanOrEqual(44);
    expect(checkbox.props.style.height).toBeGreaterThanOrEqual(44);
    act(() => root.unmount());
  });
});
