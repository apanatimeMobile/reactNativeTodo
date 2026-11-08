/**
 * RESPONSIBILITY: Own the useUserTodoImport portion of the migrated runtime.
 * FLOW: Direct consumers call this module; state and side effects retain their existing owners.
 */
import {normalizeTodo} from "@/features/frontend_user/user_todos/todos_management/utils/userTodosNormalization";

export function useUserTodoImport({setTasks}) {
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

  return {importTodos};
}
