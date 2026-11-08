import {useCallback, useRef} from 'react';

import {stopSound} from '../../../../../core/audio/audioState';
import { cancelTodoTimer } from '../../../../../core/notifications/timerCancellation';
import { notifyTimerCompleted } from '../../../../../core/notifications/timerCompletionNotification';
import { showTimerStartedNotification } from '../../../../../core/notifications/timerStartNotification';

export function useUserTodoTimer({tasksRef, setTasks}) {
  const setTodoTimer = useCallback(async (id, minutes, exactMs = null) => {
    const task = (tasksRef.current || []).find(
      item => String(item.id) === String(id),
    );
    if (!task) return;

    const durationMs =
      exactMs != null && Number(exactMs) > 0
        ? Number(exactMs)
        : Math.max(1, Number(minutes) || 1) * 60 * 1000;
    const endAt = Date.now() + durationMs;

    if (task.timerEndAt || task.timerNotificationId) {
      cancelTodoTimer(task).catch(() => {});
    }

    setTasks(currentTasks =>
      currentTasks.map(item =>
        String(item.id) === String(id)
          ? {
              ...item,
              timerEndAt: endAt,
              timerDuration: durationMs,
              timerRemaining: 0,
              timerNotificationId: null,
            }
          : item,
      ),
    );

    const minutesLabel = Math.max(1, Math.round(durationMs / 60000));
    await showTimerStartedNotification(task, minutesLabel);
  }, [setTasks, tasksRef]);

  const clearingTimerIdsRef = useRef(new Set());
  const clearTodoTimer = useCallback(async (id, isExpired = false) => {
    const idString = String(id);
    if (isExpired && clearingTimerIdsRef.current.has(idString)) return;
    if (isExpired) clearingTimerIdsRef.current.add(idString);

    const task = (tasksRef.current || []).find(
      item => String(item.id) === idString,
    );
    if (!task) {
      clearingTimerIdsRef.current.delete(idString);
      return;
    }
    if (isExpired && !task.timerEndAt && !task.timerNotificationId) return;

    const remainingMs = task.timerEndAt
      ? Math.max(0, Number(task.timerEndAt) - Date.now())
      : Number(task.timerRemaining) || 0;

    setTasks(currentTasks =>
      currentTasks.map(item =>
        String(item.id) === idString
          ? {
              ...item,
              timerEndAt: null,
              timerNotificationId: null,
              timerRemaining: isExpired ? 0 : remainingMs,
              timerDuration: Number(item.timerDuration) || 0,
            }
          : item,
      ),
    );

    try {
      if (isExpired) {
        await cancelTodoTimer(task, false);
        await notifyTimerCompleted(task);
      } else {
        stopSound();
        await cancelTodoTimer(task, true);
      }
    } catch (error) {
      console.log('[TodoContext] clearTodoTimer error:', error);
    } finally {
      setTimeout(() => clearingTimerIdsRef.current.delete(idString), 5000);
    }
  }, [setTasks, tasksRef]);

  const startTodoTimer = useCallback(id => {
    const task = (tasksRef.current || []).find(
      item => String(item.id) === String(id),
    );
    if (!task) return;
    const remaining = Number(task.timerRemaining) || 0;
    if (remaining <= 0) return;
    return setTodoTimer(id, null, remaining);
  }, [setTodoTimer, tasksRef]);

  return {setTodoTimer, clearTodoTimer, startTodoTimer};
}
