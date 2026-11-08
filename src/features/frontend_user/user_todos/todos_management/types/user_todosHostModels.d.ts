/**
 * RESPONSIBILITY: Preserve the existing todo integration type contracts in their owning feature.
 * FLOW: Type-only declarations; no runtime facade or persistence changes.
 */
export type Priority = 'low' | 'medium' | 'high';

export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export type Category =
  | 'Personal'
  | 'Work'
  | 'Learning'
  | 'Shopping'
  | 'Health'
  | 'Project'
  | 'Finance'
  | 'Family'
  | 'Home'
  | 'Travel'
  | 'Other'
  | string;

export interface TodoItem {
  id: string | number;
  title: string;
  description?: string;
  completed: boolean;
  category: Category;
  priority: Priority;
  dueDate: string;
  reminder: boolean;
  favorite: boolean;
  deleted: boolean;
  pinned: boolean;
  /** Repeat rule — none | daily | weekly | monthly */
  recurrence?: Recurrence;
  timerEndAt?: string | number | null;
  timerNotificationId?: string | null;
  color?: string | null;
  status?: 'pending' | 'in_progress' | 'completed';
  startedAt?: number | null;
  reminderTime?: string | null;
  createdAt: number;
  completedAt?: number | null;
  deletedAt?: number | null;
}
