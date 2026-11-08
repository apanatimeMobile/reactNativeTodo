/**
 * RESPONSIBILITY: Own the soundInitialization portion of the migrated runtime.
 * FLOW: Direct consumers call this module; state and side effects retain their existing owners.
 */
import { isInitialized, markInitialized, setSound } from "@/core/audio/audioState";
import { ensureSoundFiles } from "@/core/audio/soundFiles";
import { loadSound } from "@/core/audio/soundLoader";

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
