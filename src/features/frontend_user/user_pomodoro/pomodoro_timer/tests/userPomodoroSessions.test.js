import * as storage from '../../../../../storage/storage';
import { calculateFocusStats, getFocusDateKey } from '../utils/userPomodoroSessionStats';
import {
  clearFocusSessions,
  getFocusSessions,
  recordFocusSession,
} from '../utils/userPomodoroSessions';

describe('Pomodoro session history and analytics', () => {
  beforeEach(async () => {
    await clearFocusSessions();
  });

  it('formats focus date keys as YYYY-MM-DD', () => {
    expect(getFocusDateKey(new Date(2026, 4, 15))).toBe('2026-05-15');
  });

  it('records and retrieves a focus session', async () => {
    const saved = await recordFocusSession({
      mode: 'work',
      durationMinutes: 25,
      taskTitle: 'Unit Test Task',
      preset: 'classic',
    });
    expect(saved).toHaveLength(1);
    expect(saved[0].taskTitle).toBe('Unit Test Task');
    expect(saved[0].durationMinutes).toBe(25);
    expect((await getFocusSessions())[0].id).toBeDefined();
  });

  it('retains only the newest 100 sessions', async () => {
    for (let index = 0; index <= 100; index += 1) {
      await recordFocusSession({ id: String(index), mode: 'work', durationMinutes: 1 });
    }
    const sessions = await getFocusSessions();
    expect(sessions).toHaveLength(100);
    expect(sessions[0].id).toBe('100');
    expect(sessions[99].id).toBe('1');
  });

  it('does not overwrite history when strict storage loading fails', async () => {
    const readError = new Error('history unavailable');
    const writeSpy = jest.spyOn(storage, 'setItem');
    const readSpy = jest.spyOn(storage, 'getItem').mockImplementation(
      (_key, fallback, strict) => strict ? Promise.reject(readError) : Promise.resolve(fallback),
    );
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    writeSpy.mockClear();
    readSpy.mockClear();

    await expect(recordFocusSession({ mode: 'work', durationMinutes: 25 })).resolves.toEqual([]);
    expect(readSpy).toHaveBeenCalledTimes(1);
    expect(writeSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
    readSpy.mockRestore();
    writeSpy.mockRestore();
  });

  it('reports history clear failure instead of claiming success', async () => {
    const writeSpy = jest.spyOn(storage, 'setItem').mockRejectedValueOnce(new Error('write failed'));
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      await expect(clearFocusSessions()).resolves.toBe(false);
    } finally {
      writeSpy.mockRestore();
      warnSpy.mockRestore();
    }
  });

  it('calculates focus statistics without counting breaks', () => {
    const today = new Date();
    const dateKey = getFocusDateKey(today);
    const stats = calculateFocusStats([
      { mode: 'work', durationMinutes: 25, dateKey, completedAt: today.toISOString() },
      { mode: 'work', durationMinutes: 50, dateKey, completedAt: today.toISOString() },
      { mode: 'break', durationMinutes: 5, dateKey, completedAt: today.toISOString() },
    ]);
    expect(stats.totalSessions).toBe(2);
    expect(stats.totalMinutes).toBe(75);
    expect(stats.totalHours).toBe('1.3');
    expect(stats.todayMinutes).toBe(75);
    expect(stats.todaySessionsCount).toBe(2);
    expect(stats.streak).toBeGreaterThanOrEqual(1);
  });

  it('handles empty histories and clears saved sessions', async () => {
    const stats = calculateFocusStats([]);
    expect(stats.totalSessions).toBe(0);
    expect(stats.totalMinutes).toBe(0);
    expect(stats.totalHours).toBe('0.0');
    expect(stats.todayMinutes).toBe(0);
    expect(stats.streak).toBe(0);
    await recordFocusSession({ mode: 'work', durationMinutes: 25 });
    expect(await clearFocusSessions()).toBe(true);
    expect(await getFocusSessions()).toEqual([]);
  });
});
