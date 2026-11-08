/**
 * RESPONSIBILITY: Persist local Pomodoro session history with retention-safe storage I/O.
 * FLOW: Timer completion → recordFocusSession → strict history read/write → local session list.
 */
import { getItem, setItem } from '../../../../../storage/storage';
import { getFocusDateKey } from './userPomodoroSessionStats';

export const FOCUS_SESSIONS_STORAGE_KEY = '@todomaster/focus_sessions_history';
const MAX_SAVED_SESSIONS = 100;

export async function getFocusSessions() {
  try {
    const list = await getItem(FOCUS_SESSIONS_STORAGE_KEY, []);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.warn('Failed to load focus sessions:', error);
    return [];
  }
}

export async function recordFocusSession(session) {
  try {
    const stored = await getItem(FOCUS_SESSIONS_STORAGE_KEY, [], true);
    if (!Array.isArray(stored)) throw new Error('Invalid session history format');
    const current = stored;
    const newSession = {
      id: session.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      mode: session.mode || 'work',
      durationMinutes: Number(session.durationMinutes) || 25,
      taskTitle: session.taskTitle || null,
      taskId: session.taskId || null,
      preset: session.preset || 'classic',
      completedAt: session.completedAt || new Date().toISOString(),
      dateKey: getFocusDateKey(session.completedAt ? new Date(session.completedAt) : new Date()),
    };
    const updated = [newSession, ...current].slice(0, MAX_SAVED_SESSIONS);
    await setItem(FOCUS_SESSIONS_STORAGE_KEY, updated, true);
    return updated;
  } catch (error) {
    console.warn('Failed to save focus sessions:', error);
    return [];
  }
}

export async function clearFocusSessions() {
  try {
    await setItem(FOCUS_SESSIONS_STORAGE_KEY, [], true);
    return true;
  } catch (error) {
    console.warn('Failed to clear focus sessions:', error);
    return false;
  }
}
