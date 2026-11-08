import {scheduleTodoReminder} from "@/core/notifications/reminderScheduling";
import {scheduleTodoTimerAt} from "@/core/notifications/timerScheduling";

export async function rescheduleActiveTimers(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) return;
  const now = Date.now();
  for (const task of tasks) {
    if (task.timerEndAt && task.timerEndAt > now) {
      try {
        await scheduleTodoTimerAt(task, task.timerEndAt);
      } catch (error) {
        console.log('[notifications] reschedule timer error:', error);
      }
    }
  }
}

export async function rescheduleAllReminders(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) return;
  for (const task of tasks) {
    if (task.reminder && !task.completed && !task.deleted) {
      try {
        await scheduleTodoReminder(task, false);
      } catch (error) {
        console.log('[notifications] reschedule reminder error:', error);
      }
    }
  }
}
