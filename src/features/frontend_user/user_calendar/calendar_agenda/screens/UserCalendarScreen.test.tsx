import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { UserCalendarScreen } from "@/features/frontend_user/user_calendar/calendar_agenda/screens/UserCalendarScreen";
import { useUserCalendar } from "@/features/frontend_user/user_calendar/calendar_agenda/hooks/useUserCalendar";

jest.mock("@/core/theme/useThemeTokens", () => ({
  useThemeTokens: () => ({ color: { background: '#fff', isDark: false } }),
}));
jest.mock("@/features/frontend_user/user_calendar/calendar_agenda/hooks/useUserCalendar", () => ({ useUserCalendar: jest.fn() }));
jest.mock("@/features/frontend_user/user_calendar/calendar_agenda/components/UserCalendarMainView", () => ({
  UserCalendarMainView: () => {
    const { Text } = require('react-native');
    return <Text testID="calendar-main" />;
  },
}));
jest.mock("@/features/frontend_user/user_calendar/calendar_agenda/components/UserCalendarSkeleton", () => ({
  UserCalendarSkeleton: () => {
    const { Text } = require('react-native');
    return <Text testID="calendar-loading" />;
  },
}));
jest.mock("@/features/frontend_user/user_calendar/calendar_agenda/components/UserCalendarErrorFallback", () => ({
  UserCalendarErrorFallback: ({ onRetry }: { onRetry: () => void }) => {
    const { Pressable } = require('react-native');
    return <Pressable testID="calendar-error" onPress={onRetry} />;
  },
}));

const mockUseUserCalendar = useUserCalendar as jest.MockedFunction<typeof useUserCalendar>;

function makeState(overrides: Partial<ReturnType<typeof useUserCalendar>> = {}) {
  return {
    todos: [],
    selectedDate: '2026-06-08',
    selectDate: jest.fn(),
    toggleComplete: jest.fn(),
    loading: false,
    loadError: false,
    loadTodos: jest.fn(),
    ...overrides,
  };
}

describe('UserCalendarScreen storage states', () => {
  const navigation = { dispatch: jest.fn(), navigate: jest.fn() };

  it('shows the error over loading and retries the local task load', () => {
    const state = makeState({ loading: true, loadError: true });
    mockUseUserCalendar.mockReturnValue(state);
    let root!: ReactTestRenderer;
    act(() => { root = create(<UserCalendarScreen navigation={navigation} />); });

    const error = root.root.findByProps({ testID: 'calendar-error' });
    expect(root.root.findAllByProps({ testID: 'calendar-loading' })).toHaveLength(0);
    expect(root.root.findAllByProps({ testID: 'calendar-main' })).toHaveLength(0);
    act(() => error.props.onPress());
    expect(state.loadTodos).toHaveBeenCalledTimes(1);
    act(() => root.unmount());
  });

  it('shows loading until local tasks finish loading, then shows the agenda', () => {
    mockUseUserCalendar.mockReturnValue(makeState({ loading: true }));
    let root!: ReactTestRenderer;
    act(() => { root = create(<UserCalendarScreen navigation={navigation} />); });
    expect(root.root.findByProps({ testID: 'calendar-loading' })).toBeDefined();
    act(() => root.unmount());

    mockUseUserCalendar.mockReturnValue(makeState());
    act(() => { root = create(<UserCalendarScreen navigation={navigation} />); });
    expect(root.root.findByProps({ testID: 'calendar-main' })).toBeDefined();
    act(() => root.unmount());
  });
});
