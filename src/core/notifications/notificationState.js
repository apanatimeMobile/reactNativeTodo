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
