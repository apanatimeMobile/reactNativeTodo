import React from 'react';
import {act, create} from 'react-test-renderer';

import {getItem, setItem} from '../../../../../core/storage/jsonStorage';
import APP_CONFIG from '../../../../../core/config/appConfig';
import {TodoProvider, useTodoContext} from './UserTodosContext';

jest.mock('../../../../../core/storage/jsonStorage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../../../core/notifications/reminderScheduling', () => ({
  cancelTodoReminder: jest.fn(() => Promise.resolve()),
  scheduleTodoReminder: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../../../core/notifications/timerCancellation', () => ({
  cancelTodoTimer: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../../../core/notifications/timerCompletionNotification', () => ({
  notifyTimerCompleted: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../../../core/notifications/prepareTodoTimerNotifications', () => ({
  prepareTodoTimerNotifications: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../../../core/notifications/rescheduleNotifications', () => ({
  rescheduleAllReminders: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../../../core/notifications/timerScheduling', () => ({
  scheduleTodoTimerAt: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../../../core/notifications/timerStartNotification', () => ({
  showTimerStartedNotification: jest.fn(() => Promise.resolve()),
}));

function ContextCapture({capture}) {
  capture(useTodoContext());
  return null;
}

describe('User Todos provider persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('keeps a storage read failure from overwriting saved todos', async () => {
    getItem.mockImplementation(key => {
      if (key === APP_CONFIG.STORAGE_KEYS.TODOS) {
        return Promise.reject(new Error('offline storage read failed'));
      }
      return Promise.resolve([]);
    });

    let context;
    let root;
    await act(async () => {
      root = create(
        <TodoProvider>
          <ContextCapture capture={value => { context = value; }} />
        </TodoProvider>,
      );
    });

    expect(context.loadError).toBe(true);
    expect(context.tasks).toEqual([]);
    expect(setItem).not.toHaveBeenCalledWith(
      APP_CONFIG.STORAGE_KEYS.TODOS,
      expect.anything(),
    );
    expect(context.loadTodos).toEqual(expect.any(Function));
    expect(context.addTodo).toEqual(expect.any(Function));
    expect(context.importTodos).toEqual(expect.any(Function));
    expect(context.setTodoTimer).toEqual(expect.any(Function));
    await act(async () => root.unmount());
  });
});
