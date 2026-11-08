import React from 'react';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import Sound from 'react-native-nitro-sound';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { useVoiceRecorder } from "@/features/frontend_user/user_voice/voice_memos/hooks/useVoiceRecorder";
import { showToast } from "@/core/toast/showToast";

jest.mock('react-native', () => {
  const native = jest.requireActual('react-native');
  Object.defineProperty(native, 'PermissionsAndroid', {
    configurable: true,
    value: jest.requireMock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid'),
  });
  return native;
});

jest.mock("@/core/i18n/useTranslation", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock("@/core/toast/showToast", () => ({ showToast: jest.fn() }));
let recorder: ReturnType<typeof useVoiceRecorder>;
const save = jest.fn(async () => true);
const stop = jest.fn(async () => undefined);
function Harness() { recorder = useVoiceRecorder(save, stop); return null; }

describe('microphone permission recovery', () => {
  afterEach(() => jest.restoreAllMocks());
  it('does not start audio when permission is permanently denied and can open Settings', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');
    jest.spyOn(PermissionsAndroid, 'request').mockResolvedValueOnce(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN);
    const settings = jest.spyOn(Linking, 'openSettings').mockResolvedValueOnce(undefined);
    jest.mocked(Sound.startRecorder).mockClear();
    let root!: ReactTestRenderer;
    await act(async () => { root = create(<Harness />); });
    await act(async () => { await recorder.startRecording(); });
    expect(recorder.permissionBlocked).toBe(true);
    expect(recorder.isRecording).toBe(false);
    expect(Sound.startRecorder).not.toHaveBeenCalled();
    await act(async () => { await recorder.openPermissionSettings(); });
    expect(settings).toHaveBeenCalledTimes(1);
    await act(async () => root.unmount());
  });

  it('reports a settings-launch failure without claiming permission was granted', async () => {
    jest.spyOn(Linking, 'openSettings').mockRejectedValueOnce(new Error('unavailable'));
    let root!: ReactTestRenderer;
    await act(async () => { root = create(<Harness />); });
    await act(async () => { await recorder.openPermissionSettings(); });
    expect(showToast).toHaveBeenCalledWith('user_voice_memos.PERMISSION_SETTINGS_FAILED', 'error', 'user_voice:permission:settings-failed');
    expect(recorder.isRecording).toBe(false);
    await act(async () => root.unmount());
  });
});
