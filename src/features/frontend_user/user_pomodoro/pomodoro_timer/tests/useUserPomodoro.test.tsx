import { act, create } from 'react-test-renderer';
import { clearFocusSessions, getFocusSessions } from '../utils/userPomodoroSessions';
import { useUserPomodoro } from '../hooks/useUserPomodoro';

jest.mock('../../../../../core/interaction/haptics', () => ({
  triggerSuccessHaptic: jest.fn(),
}));

describe('useUserPomodoro session persistence', () => {
  let controls: ReturnType<typeof useUserPomodoro>;
  let renderer: ReturnType<typeof create>;

  function HookHarness() {
    controls = useUserPomodoro();
    return null;
  }

  beforeEach(async () => {
    jest.useFakeTimers();
    await clearFocusSessions();
  });

  afterEach(() => {
    act(() => renderer.unmount());
    jest.useRealTimers();
  });

  it('records one completed work session, but not a pause or a repeated completion', async () => {
    act(() => {
      renderer = create(<HookHarness />);
      controls.handleTogglePlay();
    });
    await act(async () => {
      jest.advanceTimersByTime(2_000);
    });
    act(() => controls.handleTogglePlay());
    expect(await getFocusSessions()).toEqual([]);

    act(() => controls.handleTogglePlay());
    await act(async () => {
      jest.advanceTimersByTime(25 * 60 * 1_000);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
    let sessions = await getFocusSessions();
    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({ mode: 'work', durationMinutes: 25 });

    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });
    sessions = await getFocusSessions();
    expect(sessions).toHaveLength(1);
    act(() => renderer.unmount());
  });
});
