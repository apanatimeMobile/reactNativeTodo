import notifee from '@notifee/react-native';
import {prepareTodoTimerNotifications} from "@/core/notifications/prepareTodoTimerNotifications";
import {displayFocusTimerNotifications} from "@/features/frontend_user/user_pomodoro/pomodoro_timer/utils/userPomodoroFocusTimerDisplay";
import {formatFocusDuration} from "@/features/frontend_user/user_pomodoro/pomodoro_timer/utils/userPomodoroFocusTimerFormatting";
import {vibrateFocusStart} from "@/core/notifications/vibrationNotifications";
import {_notificationsEnabled} from "@/core/notifications/notificationState";

export async function scheduleFocusTimerNotification({
  mode = 'work',
  durationMinutes = 25,
  secondsLeft = null,
  taskTitle = null,
}) {
  const actualSec =
    secondsLeft !== null && secondsLeft !== undefined
      ? Math.max(1, Math.floor(Number(secondsLeft)))
      : Math.max(1, Math.round(Number(durationMinutes) || 25) * 60);
  const endAt = Date.now() + actualSec * 1000;
  const minsLabel =
    actualSec >= 60
      ? `${Math.round(actualSec / 60)} min`
      : `${actualSec} sec`;
  const timeLabel = formatFocusDuration(actualSec);
  const taskName =
    taskTitle || (mode === 'work' || mode === 'focus' ? 'Focus' : 'Break');
  const modeLabel =
    mode === 'work' || mode === 'focus'
      ? 'Focus'
      : mode === 'shortBreak'
      ? 'Short Break'
      : mode === 'longBreak'
      ? 'Long Break'
      : 'Timer';
  vibrateFocusStart();
  try {
    await prepareTodoTimerNotifications();
    try {
      await notifee.cancelTriggerNotification('focus-timer-completion');
      await notifee.cancelNotification('focus-timer-completion');
      await notifee.cancelNotification('focus-timer-start');
      await notifee.cancelNotification('focus-timer-running');
    } catch (_) {}
    if (_notificationsEnabled) {
      const finishedTitle =
        mode === 'work' || mode === 'focus'
          ? '🎯 Focus Completed'
          : '☕ Break Finished';
      const finishedBody =
        mode === 'work' || mode === 'focus'
          ? `"${taskName}" · ${minsLabel} focus complete!`
          : `Break over (${minsLabel}) — back to focus!`;
      await displayFocusTimerNotifications({
        modeLabel,
        timeLabel,
        taskName,
        finishedTitle,
        finishedBody,
        endAt,
      });
    }
    return {endAt, durationSec: actualSec, timeLabel};
  } catch (error) {
    console.log('[notifications] scheduleFocusTimer error:', error);
    return {endAt, durationSec: actualSec, timeLabel};
  }
}
