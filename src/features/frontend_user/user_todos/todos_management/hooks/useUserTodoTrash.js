import {useCallback} from 'react';

import {stopSound} from "@/core/audio/audioState";
import { cancelTodoReminder, scheduleTodoReminder } from "@/core/notifications/reminderScheduling";
import { cancelTodoTimer } from "@/core/notifications/timerCancellation";
import {
  purgeExpiredTrash,
  TRASH_RETENTION_DAYS,
} from "@/features/frontend_user/user_todos/todos_management/utils/userTodosTrashRetention";

function cancelTaskNotifications(task) {
  if (task.timerEndAt || task.timerNotificationId) {
    cancelTodoTimer(task).catch(() => {});
  }
  if (task.reminder) cancelTodoReminder(task).catch(() => {});
}

export function useUserTodoTrash({tasks, setTasks}) {
  function deleteTodo(id) {
    const task = tasks.find(item => String(item.id) === String(id));
    if (task) cancelTaskNotifications(task);
    setTasks(currentTasks =>
      currentTasks.map(item =>
        String(item.id) === String(id)
          ? {
              ...item,
              deleted: true,
              deletedAt: Date.now(),
              timerEndAt: null,
              timerNotificationId: null,
              timerRemaining: 0,
            }
          : item,
      ),
    );
  }

  function restoreTodo(id) {
    setTasks(currentTasks =>
      currentTasks.map(item => {
        if (String(item.id) !== String(id)) return item;
        if (item.reminder && !item.completed) {
          scheduleTodoReminder(item).catch(() => {});
        }
        return {...item, deleted: false};
      }),
    );
  }

  function permanentlyDeleteTodo(id) {
    const task = tasks.find(item => String(item.id) === String(id));
    if (task) cancelTaskNotifications(task);
    setTasks(currentTasks =>
      currentTasks.filter(item => String(item.id) !== String(id)),
    );
  }

  function batchPermanentlyDelete(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return;
    const idSet = new Set(ids.map(String));
    tasks.forEach(task => {
      if (idSet.has(String(task.id))) cancelTaskNotifications(task);
    });
    setTasks(currentTasks =>
      currentTasks.filter(task => !idSet.has(String(task.id))),
    );
  }

  function clearTodos() {
    tasks.forEach(cancelTaskNotifications);
    stopSound();
    setTasks([]);
  }

  const autoCleanTrash = useCallback((retentionDays = TRASH_RETENTION_DAYS) => {
    let purgedCount = 0;
    setTasks(currentTasks => {
      const remaining = purgeExpiredTrash(currentTasks, retentionDays);
      purgedCount = currentTasks.length - remaining.length;
      return remaining;
    });
    return purgedCount;
  }, [setTasks]);

  return {
    deleteTodo,
    restoreTodo,
    permanentlyDeleteTodo,
    batchPermanentlyDelete,
    clearTodos,
    autoCleanTrash,
    TRASH_RETENTION_DAYS,
  };
}
