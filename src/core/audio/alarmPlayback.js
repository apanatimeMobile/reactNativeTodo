/**
 * RESPONSIBILITY: Own the alarmPlayback portion of the migrated runtime.
 * FLOW: Direct consumers call this module; state and side effects retain their existing owners.
 */
import { Vibration } from 'react-native';
import { getSound, getCurrentAudioPriority, getCurrentSoundSource, isSoundActive, setActiveSound, setCurrentAudio, setSound, setStopTimer, stopSound } from "@/core/audio/audioState";
import { AUDIO_PRIORITY } from "@/core/audio/audioPriority";
import { loadSound } from "@/core/audio/soundLoader";

const vibrationPattern = [0, 500, 250, 500, 250, 500, 250, 500, 250, 500, 250, 500, 250, 500];

export function playAlarmSound(withVibration = true, durationMs = 5000, source = 'todo_timer') {
  try {
    if (getCurrentAudioPriority() > AUDIO_PRIORITY.ALARM) return;
    if (
      isSoundActive() &&
      getCurrentSoundSource() === source &&
      getCurrentAudioPriority() === AUDIO_PRIORITY.ALARM
    ) return;

    stopSound();
    setCurrentAudio(AUDIO_PRIORITY.ALARM, source);

    if (withVibration) {
      try {
        Vibration.vibrate(vibrationPattern);
      } catch (vibErr) {
        console.log('[soundService] Vibration error:', vibErr);
      }
    }

    const startPlaying = sound => {
      try {
        setActiveSound(sound);
        setStopTimer(setTimeout(stopSound, durationMs));
        sound.stop(() => {
          try {
            sound.setCurrentTime(0);
            sound.setVolume(1.0);
            sound.setNumberOfLoops(-1);
            sound.play(success => {
              if (!success) {
                sound.reset();
                const alertSound = getSound('alert');
                if (alertSound) alertSound.play();
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
          const alertSound = getSound('alert');
          if (alertSound) alertSound.play();
        }
      }
    };

    const alarmSound = getSound('alarm');
    if (alarmSound) {
      startPlaying(alarmSound);
    } else {
      loadSound('alarm.wav').then(sound => {
        if (sound) {
          setSound('alarm', sound);
          startPlaying(sound);
        } else {
          const alertSound = getSound('alert');
          if (alertSound) {
            startPlaying(alertSound);
          } else {
            try {
              Vibration.vibrate(vibrationPattern);
            } catch (_) {}
          }
        }
      });
    }
  } catch (err) {
    console.log('[soundService] playAlarmSound error:', err);
    try {
      Vibration.vibrate(vibrationPattern);
    } catch (_) {}
  }
}

export function playFocusSound(withVibration = true, durationMs = 3000, source = 'pomodoro') {
  return playAlarmSound(withVibration, durationMs, source);
}
