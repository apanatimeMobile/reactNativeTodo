/**
 * RESPONSIBILITY: Apply the existing local trash retention policy.
 * FLOW: Stored tasks and retention days → non-expired task records.
 */
export const TRASH_RETENTION_DAYS = 30;
export const TRASH_RETENTION_MS = TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Filter out tasks in trash that have exceeded retention period (30 days)
 */
export function purgeExpiredTrash(todoList, retentionDays = TRASH_RETENTION_DAYS) {
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  return todoList.filter(task => {
    if (!task.deleted) return true;
    if (!task.deletedAt) return true; // keep if no timestamp
    return task.deletedAt > cutoff;
  });
}
