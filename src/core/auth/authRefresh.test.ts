import { refreshAuthToken } from "@/core/auth/authRefresh";
import { getRefreshToken, clearAuthSession } from "@/core/auth/authSession";

jest.mock("@/core/auth/authSession", () => ({
  getRefreshToken: jest.fn(async () => 'private-refresh-token'),
  clearAuthSession: jest.fn(),
}));

describe('unconfigured refresh contract', () => {
  it('never exposes the stored refresh credential or destroys the current session', async () => {
    await expect(refreshAuthToken()).resolves.toBeNull();
    expect(getRefreshToken).not.toHaveBeenCalled();
    expect(clearAuthSession).not.toHaveBeenCalled();
  });
});
