/**
 * RESPONSIBILITY: Derive local todo summary counters without owning shared infrastructure.
 * FLOW: Persisted task records → active/non-trash summary values.
 */
export function calculateTodoStats(tasks) {
  // Trash items ignore
  const list = tasks.filter(task => !task.deleted);

  const total = list.length;

  const completed = list.filter(
    task => task.completed,
  ).length;

  const active = total - completed;

  const highPriority = list.filter(
    task =>
      task.priority === 'high' &&
      !task.completed,
  ).length;

  // Support both string labels and ISO / timestamp due dates
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

  const dueToday = list.filter(task => {
    if (task.completed) return false;
    const d = task.dueDate;
    if (!d || d === 'No date') return false;
    if (d === 'Today' || d === 'today') return true;
    if (typeof d === 'string' && d.startsWith(todayStr)) return true;
    // Try parse as date
    try {
      const parsed = new Date(d);
      if (!isNaN(parsed.getTime())) {
        return (
          parsed.getFullYear() === today.getFullYear() &&
          parsed.getMonth() === today.getMonth() &&
          parsed.getDate() === today.getDate()
        );
      }
    } catch (_) {}
    return false;
  }).length;

  const favorites = list.filter(
    task => task.favorite,
  ).length;

  const completionPercentage =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    active,
    highPriority,
    dueToday,
    favorites,
    completionPercentage,
  };
}
