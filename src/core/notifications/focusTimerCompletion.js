import notifee, {AndroidImportance, AndroidVisibility} from '@notifee/react-native';
import {AppState} from 'react-native';
import {playAlarmSound, stopSound} from '../../services/soundService';
import {FOCUS_RUNNING_CHANNEL_ID, LARGE_ICON, SMALL_ICON} from './notificationConstants';
import {prepareTodoTimerNotifications} from './prepareTodoTimerNotifications';
import {vibrateFocusComplete} from './vibrationNotifications';
import {_notificationsEnabled} from './notificationState';

export async function cancelFocusTimerNotification() {
  try {
    await notifee.cancelTriggerNotification('focus-timer-completion');
    await notifee.cancelNotification('focus-timer-completion');
    await notifee.cancelNotification('focus-timer-start');
    await notifee.cancelNotification('focus-timer-running');
    stopSound();
  } catch (error) {
    console.log('[notifications] cancel focus error:', error);
  }
}

export async function notifyFocusCompleted(
  modeOrOpts = 'work',
  taskTitleArg = null,
) {
  try {
    let mode = 'work';
    let taskTitle = null;
    let durationMinutes = null;
    if (modeOrOpts && typeof modeOrOpts === 'object') {
      mode = modeOrOpts.mode || 'work';
      taskTitle = modeOrOpts.taskTitle || null;
      durationMinutes = modeOrOpts.durationMinutes ?? null;
    } else {
      mode = modeOrOpts || 'work';
      taskTitle = taskTitleArg;
    }

    try {
      await notifee.cancelTriggerNotification('focus-timer-completion');
      await notifee.cancelNotification('focus-timer-completion');
      await notifee.cancelNotification('focus-timer-running');
      await notifee.cancelNotification('focus-timer-start');
    } catch (_) {}

    if (AppState.currentState === 'active') {
      playAlarmSound(true, 5000, 'focus_timer');
    }
    vibrateFocusComplete();

    const minsPart =
      durationMinutes != null ? ` · ${durationMinutes} min` : '';
    const title =
      mode === 'work' || mode === 'focus'
        ? '🎯 Focus Completed'
        : '☕ Break Finished';
    const body = taskTitle
      ? `"${taskTitle}"${minsPart} session complete!`
      : mode === 'work' || mode === 'focus'
      ? `Great work${minsPart} — take a break!`
      : `Break over${minsPart} — back to focus!`;

    if (_notificationsEnabled) {
      await prepareTodoTimerNotifications();
      try {
        await notifee.displayNotification({
          id: `focus-done-${Date.now()}`,
          title,
          body,
          android: {
            channelId: FOCUS_RUNNING_CHANNEL_ID,
            pressAction: {id: 'default'},
            smallIcon: SMALL_ICON,
            largeIcon: LARGE_ICON,
            importance: AndroidImportance.LOW,
            visibility: AndroidVisibility.PUBLIC,
            autoCancel: true,
            onlyAlertOnce: true,
          },
          ios: {sound: null},
        });
      } catch (notifErr) {
        console.log('[notifications] focus done notif error:', notifErr);
      }
    }
  } catch (error) {
    console.log('[notifications] notifyFocusCompleted error:', error);
  }
}
