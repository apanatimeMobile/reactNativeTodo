import notifee, {
  AndroidImportance,
  AndroidVisibility,
  TriggerType,
} from '@notifee/react-native';
import {LARGE_ICON, SMALL_ICON, TIMER_CHANNEL_ID} from "@/core/notifications/notificationConstants";
import {prepareTodoTimerNotifications} from "@/core/notifications/prepareTodoTimerNotifications";
import {showTimerStartedNotification} from "@/features/frontend_user/user_todos/todos_management/utils/userTodosTimerStartNotification";
import {_notificationsEnabled} from "@/core/notifications/notificationState";

export async function scheduleTodoTimerAt(todo, endAt) {
  const timestamp = Number(endAt);
  if (!timestamp || timestamp <= Date.now()) {
    return {timerEndAt: timestamp, timerNotificationId: null};
  }
  try {
    await prepareTodoTimerNotifications();
    if (!todo || !todo.id) {
      return {timerEndAt: timestamp, timerNotificationId: null};
    }
    const notificationId = `todo-timer-${todo.id}`;
    try {
      await notifee.cancelTriggerNotification(notificationId);
      await notifee.cancelNotification(notificationId);
    } catch (_) {}

    if (!_notificationsEnabled) {
      return {timerEndAt: timestamp, timerNotificationId: null};
    }

    const notifConfig = {
      id: notificationId,
      title: '⏱️ Timer Finished!',
      body: `"${todo.title || 'Task'}" ka timer complete ho gaya!`,
      android: {
        channelId: TIMER_CHANNEL_ID,
        pressAction: {id: 'default'},
        smallIcon: SMALL_ICON,
        largeIcon: LARGE_ICON,
        sound: 'alarm',
        vibrationPattern: [0, 500, 250, 500, 250, 500, 250, 500, 250, 500, 250, 500, 250, 500],
        autoCancel: true,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
      },
      ios: {sound: 'default'},
    };

    let scheduledId = notificationId;
    try {
      await notifee.createTriggerNotification(notifConfig, {
        type: TriggerType.TIMESTAMP,
        timestamp,
        alarmManager: {allowWhileIdle: true},
      });
    } catch (triggerErr) {
      try {
        await notifee.createTriggerNotification(notifConfig, {
          type: TriggerType.TIMESTAMP,
          timestamp,
        });
      } catch (fallbackErr) {
        scheduledId = null;
      }
    }
    return {timerEndAt: timestamp, timerNotificationId: scheduledId};
  } catch (error) {
    return {timerEndAt: timestamp, timerNotificationId: null};
  }
}

export async function scheduleTodoTimer(
  todo,
  durationMinutes,
  showStartBanner = true,
) {
  const mins = Math.max(1, Number(durationMinutes) || 1);
  const endAt = Date.now() + mins * 60 * 1000;
  if (showStartBanner) {
    await showTimerStartedNotification(todo, mins);
  }
  return scheduleTodoTimerAt(todo, endAt);
}
