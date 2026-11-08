import notifee from '@notifee/react-native';
import {PermissionsAndroid, Platform} from 'react-native';

export async function ensureNotificationPermissions() {
  if (Platform.OS !== 'android') {
    await notifee.requestPermission();
    return;
  }
  if (Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.check(
        'android.permission.POST_NOTIFICATIONS',
      );
      if (!granted) {
        await PermissionsAndroid.request(
          'android.permission.POST_NOTIFICATIONS',
        );
      }
    } catch (permErr) {
      console.log('[notifications] permission request error:', permErr);
    }
  }
  await notifee.requestPermission();
  try {
    const settings = await notifee.getNotificationSettings();
    const alarm = settings?.android?.alarm;
    if (alarm !== undefined && alarm !== 1) {
      await notifee.openAlarmPermissionSettings().catch(() => {});
    }
  } catch (alarmErr) {
    console.log('[notifications] alarm permission check error:', alarmErr);
  }
}
