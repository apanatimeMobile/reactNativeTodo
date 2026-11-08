jest.resetModules();
jest.doMock('react-native-sound', () => {
  const SoundMock = jest.fn(function SoundConstructor(filename, basePath, callback) {
    this.filename = filename;
    this.basePath = basePath;
    if (callback) Promise.resolve().then(() => callback(null));
  });
  SoundMock.MAIN_BUNDLE = 'MAIN_BUNDLE';
  SoundMock.setCategory = jest.fn();
  SoundMock.prototype.stop = jest.fn(function stop(callback) {
    if (callback) callback();
  });
  SoundMock.prototype.play = jest.fn(function play(callback) {
    if (callback) callback(true);
  });
  SoundMock.prototype.reset = jest.fn();
  SoundMock.prototype.setCurrentTime = jest.fn();
  SoundMock.prototype.setVolume = jest.fn();
  SoundMock.prototype.setNumberOfLoops = jest.fn();
  return {__esModule: true, default: SoundMock};
});

jest.doMock('react-native-fs', () => ({
  __esModule: true,
  default: {
    DocumentDirectoryPath: '/audio-test-documents',
    exists: jest.fn(() => Promise.resolve(true)),
    mkdir: jest.fn(() => Promise.resolve()),
    stat: jest.fn(() => Promise.resolve({size: 0})),
    writeFile: jest.fn(() => Promise.resolve()),
  },
}));

const Sound = require('react-native-sound').default;
const RNFS = require('react-native-fs').default;
const {
  initSoundService,
} = require('../soundInitialization');
const {
  playTickSound,
} = require('../tickPlayback');
const {
  playAlertSound,
} = require('../alertPlayback');
const {
  playAlarmSound,
} = require('../alarmPlayback');
const {
  getCurrentSoundSource,
  isSoundActive,
  stopSound,
} = require('../audioState');
const {
  AUDIO_PRIORITY,
  checkTimerConflict,
} = require('../audioPriority');

let loadedSounds = {};
const findLoadedSound = filename =>
  loadedSounds[filename] || Sound.mock.instances.find(sound => sound.filename === filename);

describe('modular audio API', () => {
  beforeEach(() => {
    stopSound();
    jest.clearAllMocks();
  });

  it('initializes each embedded sound once', async () => {
    await initSoundService();

    expect(Sound).toHaveBeenCalledTimes(3);
    expect(Sound.mock.calls.map(([filename]) => filename)).toEqual([
      'tick.wav',
      'alert.wav',
      'alarm.wav',
    ]);
    loadedSounds = Object.fromEntries(
      Sound.mock.instances.map(sound => [sound.filename, sound]),
    );
    expect(RNFS.exists).toHaveBeenCalledWith('/audio-test-documents/sounds');

    await initSoundService();
    expect(Sound).toHaveBeenCalledTimes(3);
  });

  it('preserves alarm priority, alert suppression, source, and timer conflict checks', () => {
    expect(AUDIO_PRIORITY).toEqual({ALARM: 2, ALERT: 1, TICK: 0});
    playAlarmSound(false, 5000, 'test-alarm');

    expect(getCurrentSoundSource()).toBe('test-alarm');
    expect(isSoundActive()).toBe(true);
    expect(findLoadedSound('alarm.wav').setNumberOfLoops).toHaveBeenCalledWith(-1);

    playAlertSound(false, 'lower-priority-alert');
    expect(getCurrentSoundSource()).toBe('test-alarm');
    expect(findLoadedSound('alert.wav').play).not.toHaveBeenCalled();

    const future = new Date(Date.now() + 60_000).toISOString();
    expect(checkTimerConflict({
      isPomodoroRunning: true,
      activeTaskTimers: [{timerEndAt: future}],
    })).toEqual({hasConflict: true, isPomodoroRunning: true, hasTaskTimers: true});
    expect(checkTimerConflict({
      isPomodoroRunning: false,
      activeTaskTimers: [{timerEndAt: future}],
    }).hasConflict).toBe(false);
  });

  it('stops active alarm loops and alert playback and clears source and priority', () => {
    playAlarmSound(false, 5000, 'alarm-to-stop');
    const alarm = findLoadedSound('alarm.wav');
    expect(alarm.setNumberOfLoops).toHaveBeenCalledWith(-1);
    stopSound();
    expect(alarm.stop).toHaveBeenCalled();
    expect(alarm.setCurrentTime).toHaveBeenCalledWith(0);
    expect(getCurrentSoundSource()).toBeNull();
    expect(isSoundActive()).toBe(false);

    playAlertSound(false, 'alert-to-stop');
    const alert = findLoadedSound('alert.wav');
    expect(getCurrentSoundSource()).toBe('alert-to-stop');
    expect(alert.setNumberOfLoops).toHaveBeenCalledWith(0);
    stopSound();
    expect(alert.stop).toHaveBeenCalled();
    expect(alert.setCurrentTime).toHaveBeenCalledWith(0);
    expect(getCurrentSoundSource()).toBeNull();
    expect(isSoundActive()).toBe(false);
  });

  it('stops and resets active tick playback safely', () => {
    playTickSound();
    const tick = findLoadedSound('tick.wav');

    expect(tick.setVolume).toHaveBeenCalledWith(0.8);
    expect(tick.play).toHaveBeenCalled();
    stopSound();
    expect(tick.stop).toHaveBeenCalled();
    expect(tick.setCurrentTime).toHaveBeenCalledWith(0);
    expect(getCurrentSoundSource()).toBeNull();
    expect(isSoundActive()).toBe(false);
  });
});
