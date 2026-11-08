/**
 * RESPONSIBILITY: Own the useUserTodoLifecycle portion of the migrated runtime.
 * FLOW: Direct consumers call this module; state and side effects retain their existing owners.
 */
import {useCallback, useEffect, useRef} from 'react';
import {AppState} from 'react-native';

import {getItem, setItem} from "@/core/storage/jsonStorage";
import APP_CONFIG from "@/core/config/appConfig";
import { cancelTodoTimer } from "@/features/frontend_user/user_todos/todos_management/utils/userTodosTimerCancellation";
import { prepareTodoTimerNotifications } from "@/core/notifications/prepareTodoTimerNotifications";
import { rescheduleAllReminders } from "@/features/frontend_user/user_todos/todos_management/utils/userTodosRescheduleNotifications";
import { scheduleTodoTimerAt } from "@/features/frontend_user/user_todos/todos_management/utils/userTodosTimerScheduling";
import {normalizeTodo} from "@/features/frontend_user/user_todos/todos_management/utils/userTodosNormalization";
import {purgeExpiredTrash} from "@/features/frontend_user/user_todos/todos_management/utils/userTodosTrashRetention";

export function useUserTodoLifecycle({
  tasks,
  setTasks,
  loading,
  loadError,
  setLoading,
  setLoadError,
}) {
  const tasksRef = useRef(tasks);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    try {
      const savedTodos = await getItem(APP_CONFIG.STORAGE_KEYS.TODOS, null, true);
      let loaded;

      if (Array.isArray(savedTodos)) {
        loaded = purgeExpiredTrash(savedTodos.map(normalizeTodo));
      } else if (savedTodos === null) {
        loaded = [];
      } else {
        throw new Error('Invalid task storage format');
      }

      setTasks(loaded);
      setLoadError(false);
      setLoading(false);

      prepareTodoTimerNotifications()
        .then(() => rescheduleAllReminders(loaded).catch(() => {}))
        .catch(() => {});
      return loaded;
    } catch {
      setLoadError(true);
      setLoading(false);
      return [];
    }
  }, [setLoadError, setLoading, setTasks]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    if (!loading && !loadError) {
      setItem(APP_CONFIG.STORAGE_KEYS.TODOS, tasks).catch(error => {
        console.log('Failed to save todos:', error);
      });
    }
  }, [tasks, loading, loadError]);

  useEffect(() => {
    const handleChange = next => {
      const currentTasks = tasksRef.current || [];
      if (next === 'background') {
        currentTasks.forEach(task => {
          if (task.timerEndAt && task.timerEndAt > Date.now()) {
            scheduleTodoTimerAt(task, task.timerEndAt).catch(() => {});
          }
        });
      } else if (next === 'active') {
        currentTasks.forEach(task => {
          if (task.timerEndAt) cancelTodoTimer(task).catch(() => {});
        });
      }
    };

    const subscription = AppState.addEventListener('change', handleChange);
    return () => subscription.remove();
  }, []);

  return {tasksRef, loadTodos};
}
