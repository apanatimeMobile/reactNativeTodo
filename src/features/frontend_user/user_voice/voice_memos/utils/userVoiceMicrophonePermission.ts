/**
 * RESPONSIBILITY: Resolve the native microphone grant without starting a recording.
 * FLOW: Recorder rationale → platform permission request → grant/recovery state.
 */
import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Requests microphone permission where Android requires an explicit runtime prompt.
 * @returns True only when audio recording permission is granted.
 */
export async function requestMicrophonePermission(rationale: Parameters<typeof PermissionsAndroid.request>[1]): Promise<{ granted: boolean; permanentlyDenied: boolean }> {
  if (Platform.OS !== 'android') return { granted: true, permanentlyDenied: false };
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale);
  return {
    granted: result === PermissionsAndroid.RESULTS.GRANTED,
    permanentlyDenied: result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
  };
}

