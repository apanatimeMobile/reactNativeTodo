import { Vibration } from 'react-native';
import { getSound, getCurrentAudioPriority, setActiveSound, setCurrentAudio, setSound, setStopTimer, stopSound } from './audioState';
import { AUDIO_PRIORITY } from './audioPriority';
import { loadSound } from './soundLoader';

export function playAlertSound(withVibration = true, source = 'reminder') {
  try {
    if (getCurrentAudioPriority() > AUDIO_PRIORITY.ALERT) return;

    stopSound();
    setCurrentAudio(AUDIO_PRIORITY.ALERT, source);

    if (withVibration) Vibration.vibrate([0, 200, 100, 200]);

    const startPlaying = sound => {
      try {
        setActiveSound(sound);
        setStopTimer(setTimeout(stopSound, 1500));
        sound.stop(() => {
          try {
            sound.setCurrentTime(0);
            sound.setVolume(1.0);
            sound.setNumberOfLoops(0);
            sound.play(success => {
              if (!success) {
                sound.reset();
                Vibration.vibrate([0, 250, 100, 250]);
              }
            });
          } catch {}
        });
      } catch (_) {
        try {
          sound.setCurrentTime(0);
          sound.setVolume(1.0);
          sound.play();
        } catch {
          Vibration.vibrate([0, 250, 100, 250]);
        }
      }
    };

    const alertSound = getSound('alert');
    if (alertSound) {
      startPlaying(alertSound);
    } else {
      loadSound('alert.wav').then(sound => {
        if (sound) {
          setSound('alert', sound);
          startPlaying(sound);
        } else {
          Vibration.vibrate([0, 250, 100, 250]);
        }
      });
    }
  } catch (err) {
    console.log('[soundService] playAlertSound error:', err);
    Vibration.vibrate([0, 250, 100, 250]);
  }
}
