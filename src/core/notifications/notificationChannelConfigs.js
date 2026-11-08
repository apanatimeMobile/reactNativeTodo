import {AndroidImportance, AndroidVisibility} from '@notifee/react-native';
import {
  ALERT_CHANNEL_ID,
  FOCUS_CHANNEL_ID,
  FOCUS_RUNNING_CHANNEL_ID,
  TIMER_CHANNEL_ID,
  TIMER_RUNNING_CHANNEL_ID,
} from './notificationConstants';

export function getAndroidNotificationChannels() {
  return [
  {
    id: TIMER_CHANNEL_ID,
    name: 'Todo Timer Finished',
    importance: AndroidImportance.HIGH,
    vibration: true,
    vibrationPattern: [0, 500, 250, 500, 250, 500, 250, 500, 250, 500, 250, 500, 250, 500],
    sound: 'alarm',
    lights: true,
    lightColor: '#F97316',
    visibility: AndroidVisibility.PUBLIC,
  },
  {
    id: TIMER_RUNNING_CHANNEL_ID,
    name: 'Todo Timer Started',
    importance: AndroidImportance.LOW,
    vibration: false,
    lights: false,
    visibility: AndroidVisibility.PUBLIC,
  },
  {
    id: ALERT_CHANNEL_ID,
    name: 'Todo Alerts & Reminders',
    importance: AndroidImportance.HIGH,
    vibration: true,
    vibrationPattern: [0, 200, 100, 200],
    sound: 'alert',
    lights: true,
    lightColor: '#3B82F6',
    visibility: AndroidVisibility.PUBLIC,
  },
  {
    id: FOCUS_CHANNEL_ID,
    name: 'Focus Session Completed',
    importance: AndroidImportance.HIGH,
    vibration: true,
    vibrationPattern: [0, 400, 200, 400, 200, 400],
    sound: 'alarm',
    lights: true,
    lightColor: '#F97316',
    visibility: AndroidVisibility.PUBLIC,
  },
  {
    id: FOCUS_RUNNING_CHANNEL_ID,
    name: 'Focus Timer Running',
    importance: AndroidImportance.LOW,
    vibration: false,
    lights: false,
    visibility: AndroidVisibility.PUBLIC,
  },
  ];
}
