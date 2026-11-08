import notifee from '@notifee/react-native';
import { setNotificationsEnabled } from '@/core/notifications/notificationState';
import { ALERT_CHANNEL_ID } from '@/core/notifications/notificationConstants';
import { scheduleTodoReminder, cancelTodoReminder } from '@/features/frontend_user/user_todos/todos_management/utils/userTodosReminderScheduling';

jest.mock('@/core/notifications/prepareTodoTimerNotifications', () => ({
  prepareTodoTimerNotifications: jest.fn(async () => undefined),
}));
jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    cancelTriggerNotification: jest.fn(async () => undefined),
    cancelNotification: jest.fn(async () => undefined),
    createTriggerNotification: jest.fn(async () => 'scheduled'),
  },
  AndroidImportance: { HIGH: 4 },
  AndroidVisibility: { PUBLIC: 1 },
  TriggerType: { TIMESTAMP: 0 },
}));

const task = { id: 'saved-id', title: 'Saved reminder', reminder: true, dueDate: 'tomorrow', reminderTime: '09:30' };
afterEach(() => { setNotificationsEnabled(true); jest.clearAllMocks(); });

it('preserves reminder identifiers and shared notification preferences', async () => {
  setNotificationsEnabled(false);
  await expect(scheduleTodoReminder(task)).resolves.toBeNull();
  expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
  setNotificationsEnabled(true);
  const result = await scheduleTodoReminder(task);
  expect(result).toMatchObject({ reminderNotificationId: 'todo-reminder-saved-id' });
  expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'todo-reminder-saved-id', android: expect.objectContaining({ channelId: ALERT_CHANNEL_ID }) }),
    expect.objectContaining({ timestamp: expect.any(Number) }),
  );
  await cancelTodoReminder(task);
  expect(notifee.cancelTriggerNotification).toHaveBeenLastCalledWith('todo-reminder-saved-id');
});
