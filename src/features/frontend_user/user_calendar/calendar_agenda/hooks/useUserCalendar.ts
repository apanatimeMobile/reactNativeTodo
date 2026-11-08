/**
 * RESPONSIBILITY: Owns the selected local calendar date and reads task records for the agenda.
 * FLOW: UserCalendarScreen → useUserCalendar → selectedDate/selectDate props → UserCalendarMainView.
 */
import { useState, useCallback } from 'react';
import { useTodoContext } from "../../../user_todos/todos_management/state/UserTodosContext";
import { formatCalendarDateKey } from '../utils/userCalendarFormatters';
import type { CalendarTaskEntity } from '../types/user_calendar.types';

/**
 * Provides one authoritative date selection and the current task collection.
 * @returns Todo records, the selected local date key, and its state setter.
 * @sideEffects Reads and updates local UI state and subscribes to the host TodoContext.
 */
export function useUserCalendar() {
  const todoCtx = useTodoContext();
  const [selectedDate, setSelectedDate] = useState(() => formatCalendarDateKey(new Date()));
  const todos = (todoCtx?.tasks ?? []) as CalendarTaskEntity[];
  const loading = todoCtx?.loading ?? false;
  const loadError = todoCtx?.loadError ?? false;
  const loadTodos = useCallback(() => todoCtx?.loadTodos?.(), [todoCtx]);

  const selectDate = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
  }, []);

  const toggleComplete = useCallback((id: string) => {
    return todoCtx?.toggleTodo ? todoCtx.toggleTodo(id) : undefined;
  }, [todoCtx]);

  return { todos, selectedDate, selectDate, toggleComplete, loading, loadError, loadTodos };
}
