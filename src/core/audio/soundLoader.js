import { Platform } from 'react-native';
import Sound from 'react-native-sound';
import { getSoundDir } from './soundFiles';

export function loadSound(fileName) {
  return new Promise(resolve => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(null);
      }
    }, 3000);

    try {
      if (!Sound) {
        clearTimeout(timer);
        resolve(null);
        return;
      }

      const rawName = Platform.OS === 'android'
        ? fileName.replace(/\.[^/.]+$/, '')
        : fileName;
      const bundleSound = new Sound(rawName, Sound.MAIN_BUNDLE, bundleErr => {
        if (settled) return;
        if (!bundleErr) {
          settled = true;
          clearTimeout(timer);
          resolve(bundleSound);
          return;
        }

        if (rawName !== fileName) {
          try {
            const secondBundle = new Sound(fileName, Sound.MAIN_BUNDLE, secErr => {
              if (settled) return;
              if (!secErr) {
                settled = true;
                clearTimeout(timer);
                resolve(secondBundle);
                return;
              }
              tryFileFallback();
            });
            return;
          } catch (_) {
            tryFileFallback();
            return;
          }
        }
        tryFileFallback();
      });

      function tryFileFallback() {
        const soundDir = getSoundDir();
        if (!soundDir) {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve(null);
          }
          return;
        }

        try {
          const fileSound = new Sound(`${soundDir}/${fileName}`, '', fileErr => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve(fileErr ? null : fileSound);
          });
        } catch (_) {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve(null);
          }
        }
      }
    } catch (_) {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(null);
      }
    }
  });
}
