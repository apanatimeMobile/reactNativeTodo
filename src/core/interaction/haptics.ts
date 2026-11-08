/**
 * RESPONSIBILITY: Provide safe device feedback while respecting the persisted haptics preference.
 * FLOW: Feature interaction → shared preference-aware device adapter → native feedback.
 */
import { haptic } from "@/core/interaction/deviceHaptics";

export function triggerLightImpact(): void { haptic('light'); }
export function triggerMediumImpact(): void { haptic('medium'); }
export function triggerSuccessHaptic(): void { haptic('success'); }
export function triggerErrorHaptic(): void { haptic('error'); }
export const triggerSuccessNotification = triggerSuccessHaptic;
export const triggerErrorNotification = triggerErrorHaptic;

export function triggerWarningNotification(): void {
  // Warning uses the same preference gate as other native feedback.
  haptic('warning');
}
