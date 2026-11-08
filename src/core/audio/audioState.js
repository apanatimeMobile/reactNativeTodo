import { Vibration } from 'react-native';
import Sound from 'react-native-sound';

try {
  if (Sound && typeof Sound.setCategory === 'function') {
    Sound.setCategory('Playback', true);
  }
} catch (_) {}

const sounds = { tick: null, alert: null, alarm: null };
let activeSound = null;
let stopTimer = null;
let initialized = false;
let currentAudioPriority = -1;
let currentAudioSource = null;

export const getSound = name => sounds[name];
export const setSound = (name, sound) => {
  sounds[name] = sound;
};
export const isInitialized = () => initialized;
export const markInitialized = () => {
  initialized = true;
};
export const setActiveSound = sound => {
  activeSound = sound;
};
export const setStopTimer = timer => {
  stopTimer = timer;
};
export const setCurrentAudio = (priority, source) => {
  currentAudioPriority = priority;
  currentAudioSource = source;
};
export const getCurrentAudioPriority = () => currentAudioPriority;
export const getCurrentSoundSource = () => currentAudioSource;
export const isSoundActive = () => activeSound !== null || currentAudioPriority > -1;

export function stopSound() {
  try {
    currentAudioPriority = -1;
    currentAudioSource = null;

    if (stopTimer) {
      clearTimeout(stopTimer);
      stopTimer = null;
    }
    if (activeSound) {
      try {
        activeSound.stop();
        activeSound.setCurrentTime(0);
      } catch (_) {}
      activeSound = null;
    }
    [sounds.alarm, sounds.alert, sounds.tick].forEach(sound => {
      if (!sound) return;
      try {
        sound.stop();
        sound.setCurrentTime(0);
      } catch (_) {}
    });
    Vibration.cancel();
  } catch (err) {
    console.log('[soundService] stopSound error:', err);
  }
}
