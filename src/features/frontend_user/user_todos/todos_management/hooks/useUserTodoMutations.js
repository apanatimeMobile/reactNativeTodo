import {createId} from '../../../../../core/utils/runtimeHelpers';
import { cancelTodoReminder, scheduleTodoReminder } from '../../../../../core/notifications/reminderScheduling';
import {
  normalizeDueDate,
  normalizeTodo,
} from '../utils/userTodosNormalization';

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

  function toggleFavorite(id) {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        String(task.id) === String(id)
          ? {...task, favorite: !task.favorite}
          : task,
      ),
    );
  }

  return {
    addTodo,
    updateTodo,
    togglePinTodo,
    setTodoPinned,
    toggleTodoReminder,
    toggleFavorite,
  };
}
