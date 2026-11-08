/**
 * RESPONSIBILITY: Preserve local focus session integration types in their owning capability.
 * FLOW: Type-only declarations; no runtime facade or persistence changes.
 */
export type FocusMode = 'work' | 'shortBreak' | 'longBreak';

export interface FocusSession {
  id: string;
  type: 'focus' | 'break';
  mode: FocusMode;
  minutes: number;
  durationMinutes: number;
  task?: string | null;
  taskTitle?: string | null;
  taskId?: string | number | null;
  finishedAt: string;
  completedAt: string;
}

export interface FocusStats {
  totalMinutes: number;
  totalSessions: number;
  todayMinutes: number;
  todaySessionsCount: number;
  currentStreakDays: number;
}
