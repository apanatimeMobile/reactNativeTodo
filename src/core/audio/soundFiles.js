import RNFS from 'react-native-fs';
import { SOUND_DATA } from './soundsData';

export const getSoundDir = () =>
  RNFS && RNFS.DocumentDirectoryPath
    ? `${RNFS.DocumentDirectoryPath}/sounds`
    : null;

export async function ensureSoundFiles() {
  try {
    const soundDir = getSoundDir();
    if (!soundDir || !RNFS) return;

    const dirExists = await RNFS.exists(soundDir);
    if (!dirExists) await RNFS.mkdir(soundDir);

    const files = [
      { name: 'tick.wav', data: SOUND_DATA?.tick },
      { name: 'alert.wav', data: SOUND_DATA?.alert },
      { name: 'alarm.wav', data: SOUND_DATA?.alarm },
    ];

    for (const file of files) {
      if (!file.data) continue;
      const fullPath = `${soundDir}/${file.name}`;
      const exists = await RNFS.exists(fullPath);
      let shouldWrite = !exists;
      if (exists) {
        try {
          const stat = await RNFS.stat(fullPath);
          const expectedBytes = Math.floor((file.data.length * 3) / 4);
          if (Math.abs(Number(stat.size) - expectedBytes) > 200) {
            shouldWrite = true;
          }
        } catch (_) {
          shouldWrite = true;
        }
      }
      if (shouldWrite) await RNFS.writeFile(fullPath, file.data, 'base64');
    }
  } catch (err) {
    console.log('[soundService] ensureSoundFiles error:', err);
  }
}
