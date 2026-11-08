import notifee, {
  AndroidImportance,
  AndroidVisibility,
  TriggerType,
} from '@notifee/react-native';
import {ALERT_CHANNEL_ID, LARGE_ICON, SMALL_ICON} from './notificationConstants';
import {prepareTodoTimerNotifications} from './prepareTodoTimerNotifications';
import {calculateReminderTimestamp} from './reminderDates';
import {_notificationsEnabled} from './notificationState';

export async function scheduleTodoReminder(todo, isManualToggle = false) {
  try {
    if (!todo || !todo.id || !todo.reminder) return null;
    if (!_notificationsEnabled) return null;
    await prepareTodoTimerNotifications();
    const timestamp = calculateReminderTimestamp(todo, isManualToggle);
    if (!timestamp || timestamp <= Date.now()) return null;
    const notificationId = `todo-reminder-${todo.id}`;
    await notifee.cancelTriggerNotification(notificationId);
    await notifee.cancelNotification(notificationId);
    await notifee.createTriggerNotification(
      {
        id: notificationId,
        title: '🔔 Task Alert & Reminder',
        body: `"${todo.title || 'Task'}" is scheduled for today!`,
        android: {
          channelId: ALERT_CHANNEL_ID,
          pressAction: {id: 'default'},
          smallIcon: SMALL_ICON,
          largeIcon: LARGE_ICON,
          sound: 'alert',
          vibrationPattern: [0, 200, 100, 200],
          autoCancel: true,
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
        },
        ios: {sound: 'default'},
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp,
        alarmManager: {allowWhileIdle: true},
      },
    );
    return {
      reminderNotificationId: notificationId,
      reminderTimestamp: timestamp,
    };
  } catch (error) {
    console.log('[notifications] schedule reminder error:', error);
    return null;
  }
}

export async function cancelTodoReminder(todo) {
  try {
    if (!todo || !todo.id) return;
    const notificationId = `todo-reminder-${todo.id}`;
    await notifee.cancelTriggerNotification(notificationId);
    await notifee.cancelNotification(notificationId);
  } catch (error) {
    console.log('[notifications] cancel reminder error:', error);
  }
}
