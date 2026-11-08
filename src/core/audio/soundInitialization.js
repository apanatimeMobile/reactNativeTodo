import { isInitialized, markInitialized, setSound } from './audioState';
import { ensureSoundFiles } from './soundFiles';
import { loadSound } from './soundLoader';

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
