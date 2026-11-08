export function useUserTodoSelectors(tasks) {
  return {
    getTodoById: id => tasks.find(task => String(task.id) === String(id)),
    getActiveTodos: () => tasks.filter(task => !task.completed && !task.deleted),
    getCompletedTodos: () => tasks.filter(task => task.completed && !task.deleted),
    getFavoriteTodos: () => tasks.filter(task => task.favorite && !task.deleted),
    getPinnedTodos: () => tasks.filter(task => task.pinned && !task.deleted),
    getTrashTodos: () => tasks.filter(task => task.deleted),
  };
}
