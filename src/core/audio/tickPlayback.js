import { Vibration } from 'react-native';
import { haptic } from '../../utils/haptics';
import { getSound } from './audioState';

export function playTickSound(withVibration = false) {
  try {
    if (withVibration) {
      try {
        haptic('light');
      } catch (_) {
        Vibration.vibrate(20);
      }
    }

    const tickSound = getSound('tick');
    if (tickSound) {
      tickSound.stop(() => {
        try {
          tickSound.setCurrentTime(0);
          tickSound.setVolume(0.8);
          tickSound.play(success => {
            if (!success) tickSound.reset();
          });
        } catch (_) {}
      });
    }
  } catch (err) {
    console.log('[soundService] playTickSound error:', err);
  }
}
