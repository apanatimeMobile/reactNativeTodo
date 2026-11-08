import notifee from '@notifee/react-native';
import {stopSound} from '../../services/soundService';
import {recentCompletedTimers} from './timerCompletionState';

export async function cancelTodoTimer(todo, cancelDone = false) {
  try {
    if (!todo || !todo.id) return;
    const todoId = String(todo.id);
    const notificationId = todo.timerNotificationId || `todo-timer-${todoId}`;
    await notifee.cancelTriggerNotification(notificationId);
    await notifee.cancelNotification(notificationId);
    await notifee.cancelNotification(`todo-timer-start-${todoId}`);
    if (cancelDone) {
      recentCompletedTimers.delete(todoId);
      await notifee.cancelNotification(`todo-timer-done-${todoId}`);
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
      stopSound();
    }
  } catch (error) {
    console.log('[notifications] cancel error:', error);
  }
}
