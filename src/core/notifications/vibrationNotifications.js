/**
 * RESPONSIBILITY: Own the vibrationNotifications portion of the migrated runtime.
 * FLOW: Direct consumers call this module; state and side effects retain their existing owners.
 */
import {Vibration} from 'react-native';

export function vibrateNow() {
  try {
    Vibration.vibrate([0, 400, 200, 400, 200, 400]);
  } catch (error) {
    console.log('[notifications] vibrate error:', error);
  }
}

export function vibrateStart() {
  try {
    Vibration.vibrate(100);
  } catch (error) {
    console.log('[notifications] vibrateStart error:', error);
  }
}

export function vibrateFocusStart() {
  try {
    Vibration.vibrate(100);
  } catch (error) {
    console.log('[notifications] vibrateFocusStart error:', error);
  }
}

export function vibrateFocusComplete() {
  try {
    Vibration.vibrate([0, 400, 200, 400, 200, 400]);
  } catch (error) {
    console.log('[notifications] vibrateFocusComplete error:', error);
  }
}
