/**
 * RESPONSIBILITY: Own the notificationState portion of the migrated runtime.
 * FLOW: Direct consumers call this module; state and side effects retain their existing owners.
 */
export let channelsReady = false;
export let _notificationsEnabled = true;

export function setChannelsReady(ready) {
  channelsReady = ready;
}

export function setNotificationsEnabled(enabled) {
  _notificationsEnabled = Boolean(enabled);
}

export function isNotificationsEnabled() {
  return _notificationsEnabled;
}
