import NativeFeedback from 'react-native-haptic-feedback';
import { setHapticsEnabled } from "@/core/interaction/deviceHaptics";
import { triggerLightImpact, triggerWarningNotification } from "@/core/interaction/haptics";

jest.mock('react-native-haptic-feedback', () => ({ trigger: jest.fn() }));

it('respects preferences for canonical feedback rather than bypassing the device gate', () => {
  jest.mocked(NativeFeedback.trigger).mockClear();
  setHapticsEnabled(false);
  triggerLightImpact();
  triggerWarningNotification();
  expect(NativeFeedback.trigger).not.toHaveBeenCalled();
  setHapticsEnabled(true);
  triggerWarningNotification();
  expect(NativeFeedback.trigger).toHaveBeenCalledWith('notificationWarning', expect.any(Object));
});
