import { getItem, setItem } from '../../../../../storage/storage';
export { calculateFocusStats } from './userPomodoroSessionStats';

export const FOCUS_SESSIONS_STORAGE_KEY = '@todomaster/focus_sessions_history';
const MAX_SAVED_SESSIONS = 100;

export function getFocusDateKey(date = new Date()) {
  const d = new Date(date);
  const pad = (value) => String(value).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

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
    const current = await getFocusSessions();
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
    await setItem(FOCUS_SESSIONS_STORAGE_KEY, updated);
    return updated;
  } catch (error) {
    console.warn('Failed to save focus sessions:', error);
    return [];
  }
}

export async function clearFocusSessions() {
  try {
    await setItem(FOCUS_SESSIONS_STORAGE_KEY, []);
    return true;
  } catch (error) {
    console.warn('Failed to clear focus sessions:', error);
    return false;
  }
}
