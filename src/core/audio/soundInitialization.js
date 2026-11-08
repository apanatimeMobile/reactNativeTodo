import Sound from 'react-native-sound';
import { isInitialized, markInitialized, setSound } from './audioState';
import { ensureSoundFiles } from './soundFiles';
import { loadSound } from './soundLoader';

try {
  if (Sound && typeof Sound.setCategory === 'function') {
    Sound.setCategory('Playback', true);
  }
} catch (_) {}

export async function initSoundService() {
  if (isInitialized()) return;
  try {
    await ensureSoundFiles();
    const [tick, alert, alarm] = await Promise.all([
      loadSound('tick.wav'),
      loadSound('alert.wav'),
      loadSound('alarm.wav'),
    ]);
    setSound('tick', tick);
    setSound('alert', alert);
    setSound('alarm', alarm);
    markInitialized();
  } catch (err) {
    console.log('[soundService] init error:', err);
  }
}
