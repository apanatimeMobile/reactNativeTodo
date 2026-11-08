import notifee, {AndroidImportance, AndroidVisibility, TriggerType} from '@notifee/react-native';
import {FOCUS_RUNNING_CHANNEL_ID, LARGE_ICON, SMALL_ICON} from "@/core/notifications/notificationConstants";

export async function displayFocusTimerNotifications({
  modeLabel,
  timeLabel,
  taskName,
  finishedTitle,
  finishedBody,
  endAt,
}) {
  try {
    await notifee.displayNotification({
      id: 'focus-timer-running',
      title: `🎯 ${modeLabel} · ${timeLabel} left`,
      body: `"${taskName}" in progress`,
      android: {
        channelId: FOCUS_RUNNING_CHANNEL_ID,
        pressAction: {id: 'default'},
        smallIcon: SMALL_ICON,
        largeIcon: LARGE_ICON,
        importance: AndroidImportance.LOW,
        visibility: AndroidVisibility.PUBLIC,
        ongoing: true,
        autoCancel: false,
        onlyAlertOnce: true,
        asForegroundService: false,
      },
    });
  } catch (runErr) {
    console.log('[notifications] focus running banner error:', runErr);
  }

  try {
    await notifee.createTriggerNotification(
      {
        id: 'focus-timer-completion',
        title: finishedTitle,
        body: finishedBody,
        android: {
          channelId: FOCUS_RUNNING_CHANNEL_ID,
          pressAction: {id: 'default'},
          smallIcon: SMALL_ICON,
          largeIcon: LARGE_ICON,
          autoCancel: true,
          importance: AndroidImportance.LOW,
          visibility: AndroidVisibility.PUBLIC,
        },
        ios: {sound: null},
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: endAt,
        alarmManager: {allowWhileIdle: true},
      },
    );
  } catch (triggerErr) {
    try {
      await notifee.createTriggerNotification(
        {
          id: 'focus-timer-completion',
          title: finishedTitle,
          body: finishedBody,
          android: {
            channelId: FOCUS_RUNNING_CHANNEL_ID,
            pressAction: {id: 'default'},
            smallIcon: SMALL_ICON,
            largeIcon: LARGE_ICON,
            autoCancel: true,
            importance: AndroidImportance.LOW,
            visibility: AndroidVisibility.PUBLIC,
          },
          ios: {sound: null},
        },
        {type: TriggerType.TIMESTAMP, timestamp: endAt},
      );
    } catch (fallbackErr) {
      console.log(
        '[notifications] focus fallback trigger error:',
        fallbackErr,
      );
    }
  }
}
