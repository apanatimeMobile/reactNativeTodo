import {createId} from "@/core/utils/runtimeHelpers";
import {toDateOnlyTimestamp} from "@/core/utils/localDate";

/**
 * Normalize category name (trim + collapse spaces)
 */
export function normalizeDueDate(dueDate) {
  if (!dueDate || dueDate === 'No date' || dueDate === 'no date') {
    return 'No date';
  }

  const dd = String(dueDate).trim();
  const lower = dd.toLowerCase();

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (lower === 'today') {
    return today.toISOString().slice(0, 10);
  }

  if (lower === 'tomorrow') {
    const t = new Date(today);
    t.setDate(t.getDate() + 1);
    return t.toISOString().slice(0, 10);
  }

  if (lower === 'next week' || lower === 'nextweek') {
    const t = new Date(today);
    t.setDate(t.getDate() + 7);
    return t.toISOString().slice(0, 10);
  }

  // Already ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dd)) {
    return dd;
  }

  // Try parse other formats
  const parsed = new Date(dd);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  // Fallback – keep original if we can't understand it
  return dd;
}

/**
 * Normalize a todo object with defaults for missing fields
 */
export function normalizeTodo(todo) {
  return {
    id: todo.id ?? createId(),
    title: todo.title ?? '',
    description: todo.description ?? '',
    completed: todo.completed ?? false,
    category: todo.category ?? 'Personal',
    priority: todo.priority ?? 'medium',
    dueDate: normalizeDueDate(todo.dueDate),
    reminder: todo.reminder ?? false,
    favorite: todo.favorite ?? false,
    deleted: todo.deleted ?? false,

    // Pin feature
    pinned: todo.pinned ?? false,

    // Recurrence: none | daily | weekly | monthly
    recurrence: todo.recurrence || 'none',

    // Timer feature
    timerEndAt: todo.timerEndAt ?? null,
    timerNotificationId: todo.timerNotificationId ?? null,

    // Extra fields
    color: todo.color ?? null,
    status: todo.status ?? 'pending',
    startedAt: todo.startedAt ?? null,
    reminderTime: todo.reminderTime ?? null,

    // Timestamps
    createdAt: todo.createdAt ?? Date.now(),
    completedAt: todo.completedAt ?? null,
    deletedAt: todo.deletedAt ?? null,
    dueDateTimestamp: todo.dueDateTimestamp ?? toDateOnlyTimestamp(todo.dueDate),
  };
}

