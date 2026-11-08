import notifee from '@notifee/react-native';

export async function createChannelSafe(config) {
  try {
    await notifee.createChannel(config);
    return true;
  } catch (err) {
    console.log(
      `[notifications] channel "${config.id}" failed:`,
      err?.message || err,
    );
    if (config.sound && config.sound !== 'default') {
      try {
        await notifee.createChannel({...config, sound: 'default'});
        return true;
      } catch (retryErr) {
        console.log(
          `[notifications] channel "${config.id}" retry failed:`,
          retryErr?.message || retryErr,
        );
      }
    }
    return false;
  }
}
