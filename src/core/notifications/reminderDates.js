export function parseTaskDueDate(dueDate) {
  if (!dueDate || dueDate === 'No date') return null;
  const value = String(dueDate).trim();
  if (!value) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lower = value.toLowerCase();
  if (lower === 'today') return today;
  if (lower === 'tomorrow') {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  if (lower === 'next week' || lower === 'nextweek') {
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) return parsed;
  return null;
}

export function calculateReminderTimestamp(todo, isManualToggle = false) {
  const dateObj = parseTaskDueDate(todo.dueDate);
  if (!dateObj) return null;
  const target = new Date(dateObj);
  let targetHour = 9;
  let targetMinute = 0;
  if (todo.reminderTime && typeof todo.reminderTime === 'string') {
    const [hour, minute] = todo.reminderTime.split(':').map(Number);
    if (!isNaN(hour) && !isNaN(minute)) {
      targetHour = hour;
      targetMinute = minute;
    }
  }
  target.setHours(targetHour, targetMinute, 0, 0);
  const now = Date.now();
  if (target.getTime() <= now) {
    const isToday =
      dateObj.getFullYear() === new Date().getFullYear() &&
      dateObj.getMonth() === new Date().getMonth() &&
      dateObj.getDate() === new Date().getDate();
    if (isToday) {
      if (isManualToggle) return now + 15 * 1000;
      return null;
    }
    return null;
  }
  return target.getTime();
}
