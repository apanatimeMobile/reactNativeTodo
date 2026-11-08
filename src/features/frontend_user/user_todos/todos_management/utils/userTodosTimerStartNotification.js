import notifee, {AndroidImportance, AndroidVisibility} from '@notifee/react-native';
import {LARGE_ICON, SMALL_ICON, TIMER_RUNNING_CHANNEL_ID} from "@/core/notifications/notificationConstants";
import {prepareTodoTimerNotifications} from "@/core/notifications/prepareTodoTimerNotifications";
import {_notificationsEnabled} from "@/core/notifications/notificationState";

export async function showTimerStartedNotification(todo, minutes) {
  try {
    if (!todo || !todo.id) return;
    if (!_notificationsEnabled) return;
    await prepareTodoTimerNotifications();
    const mins = Math.max(1, Number(minutes) || 1);
    await notifee.displayNotification({
      id: `todo-timer-start-${todo.id}`,
      title: '⏱️ Timer Started',
      body: `"${todo.title || 'Task'}" ke liye ${mins} min ka timer shuru hua.`,
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
  } catch (e) {
    console.log('[notifications] showTimerStartedNotification error:', e);
  }
}
