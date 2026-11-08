import {createContext, useContext, useState} from 'react';

import {useUserTodoCategories} from '../hooks/useUserTodoCategories';
import {useUserTodoCompletion} from '../hooks/useUserTodoCompletion';
import {useUserTodoImport} from '../hooks/useUserTodoImport';
import {useUserTodoLifecycle} from '../hooks/useUserTodoLifecycle';
import {useUserTodoMutations} from '../hooks/useUserTodoMutations';
import {useUserTodoSelectors} from '../hooks/useUserTodoSelectors';
import {useUserTodoTimer} from '../hooks/useUserTodoTimer';
import {useUserTodoTrash} from '../hooks/useUserTodoTrash';

const TodoContext = createContext(null);

export function TodoProvider({children}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const {tasksRef, loadTodos} = useUserTodoLifecycle({
    tasks,
    setTasks,
    loading,
    loadError,
    setLoading,
    setLoadError,
  });
  const categories = useUserTodoCategories({tasks, setTasks});
  const mutations = useUserTodoMutations({tasks, setTasks});
  const completion = useUserTodoCompletion({setTasks});
  const imports = useUserTodoImport({setTasks});
  const timers = useUserTodoTimer({tasksRef, setTasks});
  const trash = useUserTodoTrash({tasks, setTasks});
  const selectors = useUserTodoSelectors(tasks);

  const value = {
    tasks,
    loading,
    loadError,
    loadTodos,
    TRASH_RETENTION_DAYS: trash.TRASH_RETENTION_DAYS,
    autoCleanTrash: trash.autoCleanTrash,
    customCategories: categories.customCategories,
    addCategory: categories.addCategory,
    renameCategory: categories.renameCategory,
    deleteCategory: categories.deleteCategory,
    ...mutations,
    ...completion,
    ...imports,
    ...timers,
    ...trash,
    ...selectors,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodoContext() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used inside TodoProvider.');
  }
  return context;
}
