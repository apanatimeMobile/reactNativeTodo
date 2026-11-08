/**
 * RESPONSIBILITY: Selects active reminders and reschedules snoozed reminders through the host task store.
 * FLOW: UserRemindersScreen → useUserReminders → TodoContext.updateTodo → scheduleTodoReminder.
 */
import { useMemo, useCallback } from 'react';
import { useTaskHost } from "@/core/contracts/taskHost";
import { showToast } from "@/core/toast/showToast";
import type { ReminderTaskEntity } from "@/features/frontend_user/user_reminders/reminders_active/types/user_reminders.types";
import { calculateSnoozedReminderSchedule } from "@/features/frontend_user/user_reminders/reminders_active/utils/userRemindersSnooze";

type ReminderTaskWithDueTime = ReminderTaskEntity & { dueTime?: string | null };

/**
 * Lists active reminders and updates the reminder date/time when the user snoozes one.
 * @returns Active reminders and an action that reschedules an existing reminder.
 * @sideEffects Updates the host task context; its updateTodo path reschedules native notifications.
 */
export function useUserReminders() {
  const todoCtx = useTaskHost();
  const tasks = useMemo(() => (todoCtx?.tasks ?? []) as ReminderTaskWithDueTime[], [todoCtx?.tasks]);

  const activeReminders = useMemo(
    () => tasks.filter((task) => (task.reminder || task.dueTime) && !task.completed && !task.deleted),
    [tasks],
  );

  const snoozeReminder = useCallback((id: string, minutes: number) => {
    const task = tasks.find((item) => String(item.id) === String(id));
    if (!task || !todoCtx?.updateTodo) {
      showToast('Reminder could not be rescheduled.', 'error', `user_reminders:snooze:unavailable:${id}`);
      return;
    }
    try {
      const { dueDate, reminderTime } = calculateSnoozedReminderSchedule(minutes);
      todoCtx.updateTodo(id, { dueDate, reminderTime, reminder: true });
      showToast(
        'Reminder time updated.',
        'success',
        `user_reminders:snooze:${id}:${dueDate}:${reminderTime}`,
      );
    } catch {
      showToast('Reminder could not be rescheduled.', 'error', `user_reminders:snooze:failed:${id}`);
    }
  }, [tasks, todoCtx]);

  return { loading: Boolean(todoCtx.loading), loadError: Boolean(todoCtx.loadError), retryLoad: todoCtx.loadTodos, reminders: activeReminders, snoozeReminder };
}
