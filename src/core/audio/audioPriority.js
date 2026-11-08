export const AUDIO_PRIORITY = {
  ALARM: 2,
  ALERT: 1,
  TICK: 0,
};

export function checkTimerConflict({ isPomodoroRunning, activeTaskTimers }) {
  const hasTaskTimers =
    Array.isArray(activeTaskTimers) &&
    activeTaskTimers.some(
      timer => timer.timerEndAt && new Date(timer.timerEndAt).getTime() > Date.now(),
    );

  return {
    hasConflict: Boolean(isPomodoroRunning && hasTaskTimers),
    isPomodoroRunning: Boolean(isPomodoroRunning),
    hasTaskTimers,
  };
}
