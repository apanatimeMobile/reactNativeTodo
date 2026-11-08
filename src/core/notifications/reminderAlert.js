import notifee, {AndroidImportance, AndroidVisibility} from '@notifee/react-native';
import {playAlertSound} from '../../services/soundService';
import {ALERT_CHANNEL_ID, LARGE_ICON, SMALL_ICON} from './notificationConstants';
import {prepareTodoTimerNotifications} from './prepareTodoTimerNotifications';
import {_notificationsEnabled} from './notificationState';

export async function notifyReminderAlert(todo) {
  try {
    if (!todo) return;
    await prepareTodoTimerNotifications();
    playAlertSound(false);
    if (_notificationsEnabled) {
      await notifee.displayNotification({
        id: `todo-reminder-alert-${todo.id || Date.now()}`,
        title: '🔔 Task Alert & Reminder',
        body: `"${todo.title || 'Task'}" is due today!`,
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
      });
    }
  } catch (error) {
    console.log('[notifications] notifyReminderAlert error:', error);
  }
}
