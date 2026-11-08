import notifee from '@notifee/react-native';
import {Platform} from 'react-native';
import {getAndroidNotificationChannels} from './notificationChannelConfigs';
import {createChannelSafe} from './notificationChannelCreation';
import {ensureNotificationPermissions} from './notificationPermissions';
import {channelsReady, setChannelsReady} from './notificationState';

const OLD_CHANNEL_IDS = [
  'todo-timers-channel-v2','todo-reminders-channel-v2','pomodoro-focus-channel-v3',
  'todo-timers-channel-v4','todo-timers-running-v4','todo-reminders-channel-v4',
  'pomodoro-focus-channel-v4','pomodoro-running-channel-v4','todo-timers-channel-v5',
  'todo-timers-running-v5','todo-timers-running-v6','todo-timers-running-v7',
  'todo-timers-running-v8','todo-timers-running-v9','todo-timers-running-v10',
  'todo-reminders-channel-v5','todo-reminders-channel-v6','pomodoro-focus-channel-v5',
  'pomodoro-focus-channel-v6','pomodoro-running-channel-v5','pomodoro-running-channel-v6',
  'pomodoro-running-channel-v7','pomodoro-running-channel-v8','pomodoro-running-v9',
  'pomodoro-running-v10','pomodoro-running-v11','todo-timers-channel-v6',
];

export async function prepareTodoTimerNotifications(force = false) {
  if (channelsReady && !force) return;
  try {
    await ensureNotificationPermissions();
    if (Platform.OS === 'android') {
      try {
        for (const channelId of OLD_CHANNEL_IDS) {
          await notifee.deleteChannel(channelId).catch(() => {});
        }
      } catch (_) {}

      for (const channel of getAndroidNotificationChannels()) {
        await createChannelSafe(channel);
      }
    }
    setChannelsReady(true);
  } catch (error) {
    console.log('[notifications] prepare error:', error);
  }
}
