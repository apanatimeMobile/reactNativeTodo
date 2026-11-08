/**
 * RESPONSIBILITY: Describe the app composition port consumed by independent task-aware domains.
 * FLOW: The owning feature implements this interface; core owns no task state or business rules.
 */
export interface HostTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  reminder: boolean;
  favorite: boolean;
  deleted: boolean;
  pinned: boolean;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
  timerEndAt?: string | number | null;
  timerNotificationId?: string | null;
  color?: string | null;
  status?: 'pending' | 'in_progress' | 'completed';
  startedAt?: number | null;
  reminderTime?: string | null;
  createdAt: number;
  completedAt?: number | null;
  deletedAt?: number | null;
}

type TaskAction = (id: string) => void;
export interface TaskHost {
  tasks: HostTask[];
  loading: boolean;
  loadError: boolean;
  loadTodos: () => Promise<HostTask[]>;
  TRASH_RETENTION_DAYS: number;
  customCategories: string[];
  addCategory: (name: string) => void;
  renameCategory: (previous: string, next: string) => void;
  deleteCategory: (name: string) => void;
  addTodo: (values: Partial<HostTask>) => void;
  updateTodo: (id: string, values: Partial<HostTask>) => void;
  importTodos: (values: Partial<HostTask>[], mode?: 'merge' | 'replace') => void;
  toggleTodo: TaskAction;
  toggleFavorite: TaskAction;
  togglePinTodo: TaskAction;
  setTodoPinned: (id: string, pinned: boolean) => void;
  toggleTodoReminder: TaskAction;
  setTodoTimer: (id: string, minutes: number) => void;
  clearTodoTimer: TaskAction;
  startTodoTimer: (id: string, minutes: number) => Promise<void>;
  deleteTodo: TaskAction;
  restoreTodo: TaskAction;
  permanentlyDeleteTodo: TaskAction;
  batchPermanentlyDelete: (ids: string[]) => void;
  clearTodos: () => void;
  autoCleanTrash: (days?: number) => number;
  getTodoById: (id: string) => HostTask | undefined;
  getActiveTodos: () => HostTask[];
  getCompletedTodos: () => HostTask[];
  getFavoriteTodos: () => HostTask[];
  getPinnedTodos: () => HostTask[];
  getTrashTodos: () => HostTask[];
}
