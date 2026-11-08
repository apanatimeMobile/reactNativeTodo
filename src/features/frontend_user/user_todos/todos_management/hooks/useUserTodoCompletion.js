/**
 * RESPONSIBILITY: Own the useUserTodoCompletion portion of the migrated runtime.
 * FLOW: Direct consumers call this module; state and side effects retain their existing owners.
 */
import {createId} from "@/core/utils/runtimeHelpers";
import {stopSound} from "@/core/audio/audioState";
import { cancelTodoReminder, scheduleTodoReminder } from "@/features/frontend_user/user_todos/todos_management/utils/userTodosReminderScheduling";
import { cancelTodoTimer } from "@/features/frontend_user/user_todos/todos_management/utils/userTodosTimerCancellation";
import {normalizeTodo} from "@/features/frontend_user/user_todos/todos_management/utils/userTodosNormalization";
import {getNextDueDate, isRecurring} from "@/features/frontend_user/user_todos/todos_management/utils/userTodosRecurrence";

export function useUserTodoCompletion({setTasks}) {
  function toggleTodo(id) {
    setTasks(currentTasks => {
      let nextOccurrence = null;
      const updated = currentTasks.map(task => {
        if (String(task.id) !== String(id)) return task;
        const nextCompleted = !task.completed;

        if (nextCompleted && task.reminder) {
          cancelTodoReminder(task).catch(() => {});
        } else if (!nextCompleted && task.reminder) {
          scheduleTodoReminder(task).catch(() => {});
        }

        if (nextCompleted && (task.timerEndAt || task.timerNotificationId)) {
          cancelTodoTimer(task, true).catch(() => {});
          stopSound();
        }

        if (nextCompleted && isRecurring(task)) {
          const nextDue = getNextDueDate(task.dueDate, task.recurrence);
          if (nextDue) {
            nextOccurrence = normalizeTodo({
              ...task,
              id: createId(),
              completed: false,
              completedAt: null,
              deleted: false,
              deletedAt: null,
              dueDate: nextDue,
              timerEndAt: null,
              timerNotificationId: null,
              timerDuration: 0,
              timerRemaining: 0,
              pinned: false,
              createdAt: Date.now(),
            });
          }
        }

        return {
          ...task,
          completed: nextCompleted,
          completedAt: nextCompleted ? Date.now() : null,
          timerEndAt: nextCompleted ? null : task.timerEndAt,
          timerNotificationId: nextCompleted ? null : task.timerNotificationId,
        };
      });

      if (nextOccurrence) {
        if (nextOccurrence.reminder) {
          scheduleTodoReminder(nextOccurrence).catch(() => {});
        }
        return [...updated, nextOccurrence];
      }
      return updated;
    });
  }

  return {toggleTodo};
}
