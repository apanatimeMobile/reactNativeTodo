import {useCallback} from 'react';

import {createId} from '../../../../../core/utils/runtimeHelpers';
import {
  cancelTodoReminder,
  cancelTodoTimer,
  scheduleTodoReminder,
} from '../../../../../utils/todoTimerNotifications';
import {stopSound} from '../../../../../core/audio/audioState';
import {
  normalizeDueDate,
  normalizeTodo,
} from '../utils/userTodosNormalization';
import {getNextDueDate, isRecurring} from '../utils/userTodosRecurrence';

export function useUserTodoMutations({tasks, setTasks}) {
  function addTodo(todo) {
    const newTodo = normalizeTodo({
      ...todo,
      id: createId(),
      completed: false,
      favorite: todo.favorite ?? false,
      deleted: false,
      pinned: todo.pinned ?? false,
      recurrence: todo.recurrence || 'none',
      timerEndAt: todo.timerEndAt ?? null,
      timerNotificationId: null,
      timerDuration: todo.timerDuration ?? 0,
      timerRemaining: todo.timerRemaining ?? 0,
      createdAt: Date.now(),
    });

    if (newTodo.reminder) scheduleTodoReminder(newTodo).catch(() => {});
    setTasks(currentTasks => [...currentTasks, newTodo]);
  }

  function updateTodo(id, updatedData) {
    setTasks(currentTasks =>
      currentTasks.map(task => {
        if (String(task.id) !== String(id)) return task;
        const merged = {
          ...task,
          ...updatedData,
          dueDate:
            updatedData.dueDate !== undefined
              ? normalizeDueDate(updatedData.dueDate)
              : task.dueDate,
        };
        if (merged.reminder && !merged.completed && !merged.deleted) {
          scheduleTodoReminder(merged).catch(() => {});
        } else if (
          task.reminder &&
          (!merged.reminder || merged.completed || merged.deleted)
        ) {
          cancelTodoReminder(task).catch(() => {});
        }
        return merged;
      }),
    );
  }

  function togglePinTodo(id) {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        String(task.id) === String(id)
          ? {...task, pinned: !task.pinned}
          : task,
      ),
    );
  }

  function setTodoPinned(id, pinned) {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        String(task.id) === String(id)
          ? {...task, pinned: Boolean(pinned)}
          : task,
      ),
    );
  }

  async function toggleTodoReminder(id) {
    const task = tasks.find(item => String(item.id) === String(id));
    if (!task) return;
    const nextValue = !task.reminder;
    if (nextValue) {
      await scheduleTodoReminder({...task, reminder: true}, true);
    } else {
      await cancelTodoReminder(task);
    }
    setTasks(currentTasks =>
      currentTasks.map(item =>
        String(item.id) === String(id)
          ? {...item, reminder: nextValue}
          : item,
      ),
    );
  }

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
        if (nextOccurrence.reminder) scheduleTodoReminder(nextOccurrence).catch(() => {});
        return [...updated, nextOccurrence];
      }
      return updated;
    });
  }

  function toggleFavorite(id) {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        String(task.id) === String(id)
          ? {...task, favorite: !task.favorite}
          : task,
      ),
    );
  }

  function importTodos(importedList, mode = 'replace') {
    if (!Array.isArray(importedList)) return;
    const seenImportedIds = new Set();
    const normalized = importedList.map(normalizeTodo).filter(todo => {
      const id = String(todo?.id ?? '').trim();
      if (!id || seenImportedIds.has(id)) return false;
      seenImportedIds.add(id);
      return true;
    });

    if (mode === 'merge') {
      setTasks(currentTasks => {
        const existingIds = new Set(currentTasks.map(task => String(task.id)));
        const newItems = normalized.filter(todo => {
          const id = String(todo.id);
          if (existingIds.has(id)) return false;
          existingIds.add(id);
          return true;
        });
        return [...currentTasks, ...newItems];
      });
    } else {
      setTasks(normalized);
    }
  }

  return {
    addTodo,
    updateTodo,
    togglePinTodo,
    setTodoPinned,
    toggleTodoReminder,
    toggleTodo,
    toggleFavorite,
    importTodos,
  };
}
