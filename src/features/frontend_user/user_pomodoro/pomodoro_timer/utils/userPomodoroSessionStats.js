export function getFocusDateKey(date = new Date()) {
  const value = new Date(date);
  const pad = (part) => String(part).padStart(2, '0');
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}

export function calculateFocusStats(sessions = []) {
  const todayKey = getFocusDateKey(new Date());
  const focusOnly = sessions.filter(
    (session) => session.mode === 'work' || session.mode === 'focus' || !session.mode,
  );
  let totalMinutes = 0;
  let todayMinutes = 0;
  let todaySessionsCount = 0;
  let weekMinutes = 0;
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const daySet = new Set();

  focusOnly.forEach((session) => {
    const minutes = Number(session.durationMinutes) || 0;
    totalMinutes += minutes;
    const sessionDate = session.completedAt ? new Date(session.completedAt) : null;
    const sessionDateKey = session.dateKey || (sessionDate ? getFocusDateKey(sessionDate) : null);
    if (sessionDateKey) daySet.add(sessionDateKey);
    if (sessionDateKey === todayKey) {
      todayMinutes += minutes;
      todaySessionsCount += 1;
    }
    if (sessionDate && sessionDate >= oneWeekAgo) weekMinutes += minutes;
  });

  let streak = 0;
  const checkDate = new Date(now);
  if (!daySet.has(getFocusDateKey(checkDate))) checkDate.setDate(checkDate.getDate() - 1);
  while (daySet.has(getFocusDateKey(checkDate))) {
    streak += 1;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  const avgMinutesPerSession = focusOnly.length > 0
    ? Math.round(totalMinutes / focusOnly.length)
    : 0;
  return {
    totalSessions: focusOnly.length,
    totalMinutes,
    totalHours: (totalMinutes / 60).toFixed(1),
    todaySessionsCount,
    todayMinutes,
    weekMinutes,
    avgMinutesPerSession,
    streak,
    recentSessions: sessions.slice(0, 10),
  };
}
