/**
 * RESPONSIBILITY: Canonical feature hook for User Todos Management (≤150 lines).
 * FLOW: Connects UI components to todos state and local actions with complete parameter alignment.
 */

import { useMemo, useCallback } from 'react';
import { useTaskHost } from "@/core/contracts/taskHost";
import type { TodoEntity } from "@/features/frontend_user/user_todos/todos_management/types/user_todos.types";

export function useUserTodos() {
  const ctx = useTaskHost();
  const tasks = useMemo<TodoEntity[]>(() => ctx.tasks ?? [], [ctx.tasks]);

  const categories = useMemo(() => {
    return ['All', ...(ctx.customCategories || [])];
  }, [ctx.customCategories]);
  const todoCategories = useMemo(() => categories.filter((category) => category !== 'All'), [categories]);

  const toggleComplete = useCallback((id: string) => {
    return ctx.toggleTodo(id);
  }, [ctx]);

  const permanentDeleteTodo = useCallback((id: string) => {
    return ctx.permanentlyDeleteTodo ? ctx.permanentlyDeleteTodo(id) : ctx.deleteTodo(id);
  }, [ctx]);

  const emptyTrash = useCallback(() => {
    if (ctx.batchPermanentlyDelete) {
      const trashIds = tasks.filter((task) => task.deleted).map((task) => task.id);
      return ctx.batchPermanentlyDelete(trashIds);
    }
  }, [ctx, tasks]);

  return {
    ...ctx,
    todos: tasks,
    categories,
    todoCategories,
    loading: ctx.loading,
    refreshTodos: ctx.loadTodos,
    toggleComplete,
    permanentDeleteTodo,
    emptyTrash,
  };
}

