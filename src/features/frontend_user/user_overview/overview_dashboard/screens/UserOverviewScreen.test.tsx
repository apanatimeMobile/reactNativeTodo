import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { UserOverviewScreen } from "@/features/frontend_user/user_overview/overview_dashboard/screens/UserOverviewScreen";

const mockRetry = jest.fn();
const mockState = { loading: false, loadError: false, retryLoad: mockRetry };
jest.mock("@/features/frontend_user/user_overview/overview_dashboard/hooks/useUserOverview", () => ({ useUserOverview: () => mockState }));
jest.mock("@/core/theme/useThemeTokens", () => ({
  useThemeTokens: () => require("@/core/theme/darkTheme").darkTheme,
}));
jest.mock("@/features/frontend_user/user_overview/overview_dashboard/components/UserOverviewMainView", () => ({ UserOverviewMainView: () => 'main' }));
jest.mock("@/features/frontend_user/user_overview/overview_dashboard/components/UserOverviewSkeleton", () => ({ UserOverviewSkeleton: () => 'loading' }));
jest.mock("@/features/frontend_user/user_overview/overview_dashboard/components/UserOverviewErrorFallback", () => ({ UserOverviewErrorFallback: () => 'error' }));

describe('UserOverviewScreen loading states', () => {
  it.each([
    [true, false, 'loading'],
    [false, true, 'error'],
    [false, false, 'main'],
  ] as const)('renders the correct state (loading %s, error %s)', async (loading, loadError, expected) => {
    Object.assign(mockState, { loading, loadError });
    let root!: ReactTestRenderer;
    await act(async () => { root = create(<UserOverviewScreen />); });
    expect(JSON.stringify(root.toJSON())).toContain(`"${expected}"`);
    await act(async () => root.unmount());
  });
});
