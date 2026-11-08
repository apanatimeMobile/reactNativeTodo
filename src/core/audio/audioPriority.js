/**
 * RESPONSIBILITY: Own the audioPriority portion of the migrated runtime.
 * FLOW: Direct consumers call this module; state and side effects retain their existing owners.
 */
export const AUDIO_PRIORITY = {
  ALARM: 2,
  ALERT: 1,
  TICK: 0,
};
