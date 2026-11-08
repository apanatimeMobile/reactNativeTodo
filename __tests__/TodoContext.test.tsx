import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { TodoProvider } from "@/features/frontend_user/user_todos/todos_management/state/UserTodosContext";
import { useTaskHost } from "@/core/contracts/taskHost";
import APP_CONFIG from "@/core/config/appConfig";

let state: ReturnType<typeof useTaskHost>;
function Capture() {
  state = useTaskHost();
  return null;
}

describe('TodoProvider load recovery', () => {
  it.each(['read failure', 'invalid shape'])('does not overwrite task data after %s and retries safely', async (failure) => {
    const get = jest.spyOn(AsyncStorage, 'getItem');
    const set = jest.spyOn(AsyncStorage, 'setItem');
    let failing = true;
    get.mockImplementation(async (key: string) => {
      if (key === APP_CONFIG.STORAGE_KEYS.TODOS) {
        if (failing) {
          if (failure === 'read failure') throw new Error('storage unavailable');
          return JSON.stringify({ corrupt: true });
        }
        return JSON.stringify([{ id: 'kept', title: 'Keep task' }]);
      }
      return null;
    });
    set.mockClear();
    let root!: ReactTestRenderer;
    try {
      await act(async () => { root = create(<TodoProvider><Capture /></TodoProvider>); });
      expect(state.loadError).toBe(true);
      expect(state.loading).toBe(false);
      expect(set.mock.calls.filter(([key]) => key === APP_CONFIG.STORAGE_KEYS.TODOS)).toEqual([]);
      failing = false;
      await act(async () => { await state.loadTodos(); });
      expect(state.loadError).toBe(false);
      expect(state.tasks[0].id).toBe('kept');
      expect(set).toHaveBeenCalledWith(APP_CONFIG.STORAGE_KEYS.TODOS, expect.stringContaining('Keep task'));
      await act(async () => root.unmount());
    } finally {
      get.mockRestore();
      set.mockRestore();
    }
  });
});
