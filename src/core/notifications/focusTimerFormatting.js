export function formatFocusDuration(totalSec) {
  const sec = Math.max(0, Math.floor(Number(totalSec) || 0));
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${String(remainingMinutes).padStart(2, '0')}m`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
