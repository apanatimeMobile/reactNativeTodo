/**
 * RESPONSIBILITY: Preserve the task/focus concurrency decision in the owning task domain.
 * FLOW: Host timer summaries → existing conflict flags; no native audio state is owned here.
 */
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
