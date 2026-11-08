import {useState} from 'react';
import {TaskHostContext} from "@/core/contracts/taskHost";

import {useUserTodoCategories} from "@/features/frontend_user/user_todos/todos_management/hooks/useUserTodoCategories";
import {useUserTodoCompletion} from "@/features/frontend_user/user_todos/todos_management/hooks/useUserTodoCompletion";
import {useUserTodoImport} from "@/features/frontend_user/user_todos/todos_management/hooks/useUserTodoImport";
import {useUserTodoLifecycle} from "@/features/frontend_user/user_todos/todos_management/hooks/useUserTodoLifecycle";
import {useUserTodoMutations} from "@/features/frontend_user/user_todos/todos_management/hooks/useUserTodoMutations";
import {useUserTodoSelectors} from "@/features/frontend_user/user_todos/todos_management/hooks/useUserTodoSelectors";
import {useUserTodoTimer} from "@/features/frontend_user/user_todos/todos_management/hooks/useUserTodoTimer";
import {useUserTodoTrash} from "@/features/frontend_user/user_todos/todos_management/hooks/useUserTodoTrash";

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

  return <TaskHostContext.Provider value={value}>{children}</TaskHostContext.Provider>;
}

