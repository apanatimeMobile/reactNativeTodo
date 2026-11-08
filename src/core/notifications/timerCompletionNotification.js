import notifee, {AndroidImportance, AndroidVisibility} from '@notifee/react-native';
import {AppState} from 'react-native';
import {playAlarmSound} from '../../services/soundService';
import {LARGE_ICON, SMALL_ICON, TIMER_RUNNING_CHANNEL_ID} from './notificationConstants';
import {prepareTodoTimerNotifications} from './prepareTodoTimerNotifications';
import {recentCompletedTimers} from './timerCompletionState';
import {_notificationsEnabled} from './notificationState';

export async function notifyTimerCompleted(todo) {
  try {
    if (!todo || !todo.id) return;
    const todoId = String(todo.id);
    const now = Date.now();
    const lastNotified = recentCompletedTimers.get(todoId) || 0;
    if (now - lastNotified < 8000) return;
    recentCompletedTimers.set(todoId, now);
    if (recentCompletedTimers.size > 100) {
      for (const [key, value] of recentCompletedTimers.entries()) {
        if (now - value > 60000) recentCompletedTimers.delete(key);
      }
    }

    await prepareTodoTimerNotifications();
    const triggerId = todo.timerNotificationId || `todo-timer-${todoId}`;
    try {
      await notifee.cancelTriggerNotification(triggerId);
      await notifee.cancelNotification(triggerId);
      await notifee.cancelNotification(`todo-timer-start-${todoId}`);
      await notifee.cancelNotification(`todo-timer-done-${todoId}`);
    } catch (_) {}

    if (AppState.currentState === 'active') {
      playAlarmSound(true, 5000, 'todo_timer');
    }
    if (!_notificationsEnabled) return;

    try {
      const displayed = await notifee.getDisplayedNotifications();
      if (Array.isArray(displayed)) {
        for (const notification of displayed) {
          const id = notification?.notification?.id || notification?.id;
          if (
            id &&
            (String(id) === `todo-timer-done-${todoId}` ||
              String(id).startsWith(`todo-timer-done-${todoId}-`))
          ) {
            await notifee.cancelNotification(id).catch(() => {});
          }
        }
      }
    } catch (_) {}

    await notifee.displayNotification({
      id: `todo-timer-done-${todoId}`,
      title: '⏱️ Timer Finished',
      body: `"${todo.title || 'Task'}" ka timer pura ho gaya.`,
      android: {
        channelId: TIMER_RUNNING_CHANNEL_ID,
        pressAction: {id: 'default'},
        smallIcon: SMALL_ICON,
        largeIcon: LARGE_ICON,
        importance: AndroidImportance.LOW,
        visibility: AndroidVisibility.PUBLIC,
        autoCancel: true,
        onlyAlertOnce: true,
      },
    });
  } catch (error) {
    console.log('[notifications] notifyTimerCompleted error:', error);
  }
}
